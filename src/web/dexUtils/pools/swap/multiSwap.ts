import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js'

import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { OpenOrdersMap } from '@sb/compositions/Rebalance/utils/loadOpenOrdersFromMarkets'
import { getVariablesForPlacingOrder } from '@sb/compositions/Rebalance/utils/marketOrderProgram/getVariablesForPlacingOrder'
import {
  MARKET_ORDER_PROGRAM_ADDRESS,
  ProgramsMultiton,
} from '@sb/dexUtils/ProgramsMultiton'
import { isTransactionFailed } from '@sb/dexUtils/send'
import { signAndSendTransactions } from '@sb/dexUtils/transactions'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { notEmpty } from '@sb/dexUtils/utils'
import { WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'

import {
  AldrinConnection,
  buildSwapTransaction,
  buildTransactions,
  SWAP_FEES_SETTINGS,
  walletAdapterToWallet,
} from '@core/solana'
import { toBNWithDecimals } from '@core/utils/helpers'

import { checkIsTransactionFromNativeSOL } from './checkIsTransactionFromNativeSOL'
import { SwapRoute } from './getSwapRoute'
import {
  createAndCloseWSOLAccount,
  getOrCreateOpenOrdersAddress,
  routeAtaInstructions,
} from './serum'

const multiSwap = async ({
  wallet,
  connection,
  swapRoute,
  openOrdersMap,
  feeAccountTokens,
  selectedInputTokenAddressFromSeveral,
  selectedOutputTokenAddressFromSeveral,
}: {
  wallet: WalletAdapter
  connection: AldrinConnection
  swapRoute: SwapRoute
  openOrdersMap: OpenOrdersMap
  feeAccountTokens: TokenInfo[]
  selectedInputTokenAddressFromSeveral?: string
  selectedOutputTokenAddressFromSeveral?: string
}) => {
  if (!wallet.publicKey) return 'failed'

  const commonInstructions = []
  const commonSigners = []

  const firstSwapStep = swapRoute[0]
  const lastSwapStep = swapRoute[swapRoute.length - 1]

  const { swapAmountInWithSlippage: firstStepSwapAmountIn } = firstSwapStep

  // check if we start swap from native SOL (we'll need to handle it later)
  const isSwapFromNativeSOL = checkIsTransactionFromNativeSOL({
    swapStep: firstSwapStep,
    inputTokenAddress: selectedInputTokenAddressFromSeveral,
    outputTokenAddress: selectedOutputTokenAddressFromSeveral,
    walletPubkey: wallet.publicKey,
  })

  // create token accounts if needed and OOA
  const isInputTokenSOL = WRAPPED_SOL_MINT.equals(
    new PublicKey(firstSwapStep.inputMint)
  )

  const uniqSwapRouteMints = [
    ...new Set(
      swapRoute
        .map((step, index) =>
          // TODO: explain
          index === 0 && isSwapFromNativeSOL
            ? [isInputTokenSOL ? step.outputMint : step.inputMint]
            : [step.inputMint, step.outputMint]
        )
        .flat()
    ),
  ]

  // get ata addresses for all swap route tokens
  // we also cover creation of ata instructions here & wSOL
  const tokenAccountsMap = await routeAtaInstructions({
    connection,
    userPublicKey: wallet.publicKey,
    mints: uniqSwapRouteMints,
  })

  // get all OOA addresses for all serum market steps & create + close instructions
  const swapRouteOpenOrders = (
    await Promise.all(
      swapRoute.map((step) => {
        if (step.ammLabel === 'Serum') {
          return getOrCreateOpenOrdersAddress({
            connection,
            user: wallet.publicKey,
            serumMarket: step.market.market,
            marketToOpenOrdersAddress: openOrdersMap,
          })
        }

        return undefined
      })
    )
  ).filter(notEmpty)

  const swapRouteOpenOrdersMap = swapRouteOpenOrders.reduce(
    (acc, openOrders) => acc.set(openOrders.marketAddress, openOrders),
    new Map()
  )

  console.log('setup', {
    tokenAccountsMap,
    swapRouteOpenOrders,
    swapRouteOpenOrdersMap,
  })

  // create ata and OpenOrders accounts
  const { setupInstructions, setupSigners } = [
    ...tokenAccountsMap.values(),
    ...swapRouteOpenOrders,
  ].reduce(
    (acc, current) => {
      acc.setupInstructions.push(...current.instructions)
      acc.setupSigners.push(...current.signers)

      return acc
    },
    { setupInstructions: [], setupSigners: [] }
  )

  // close wSOL & OpenOrders accounts
  const { cleanupInstructions } = [
    ...tokenAccountsMap.values(),
    ...swapRouteOpenOrders,
  ].reduce(
    (acc, current) => {
      acc.cleanupInstructions.push(...current.cleanupInstructions)
      return acc
    },
    { cleanupInstructions: [] }
  )

  if (isSwapFromNativeSOL) {
    const {
      address,
      instructions: createWSOLIxs,
      cleanupInstructions: closeWSOLIxs,
    } = await createAndCloseWSOLAccount({
      connection,
      amount: (firstStepSwapAmountIn * LAMPORTS_PER_SOL).toFixed(0),
      owner: wallet.publicKey,
    })

    // reassign input token address to wrapped one for first swap step
    // eslint-disable-next-line no-param-reassign
    selectedInputTokenAddressFromSeveral = address.toString()

    // add to setup & cleanup ix
    setupInstructions.push(...createWSOLIxs)
    cleanupInstructions.push(...closeWSOLIxs)
  }

  commonInstructions.push(...setupInstructions)
  commonSigners.push(...setupSigners)

  for (let i = 1; i <= swapRoute.length; i += 1) {
    const swapStep = swapRoute[i - 1]
    const { isSwapBaseToQuote, inputMint, outputMint } = swapStep

    const [baseMint, quoteMint] = isSwapBaseToQuote
      ? [inputMint, outputMint]
      : [outputMint, inputMint]

    let { address: userBaseTokenAccount } = tokenAccountsMap.get(baseMint) || {
      address: null,
    }

    let { address: userQuoteTokenAccount } = tokenAccountsMap.get(
      quoteMint
    ) || { address: null }

    const isFirstSwapStep = i === 1
    // change input token account address for first step
    if (isFirstSwapStep && selectedInputTokenAddressFromSeveral) {
      if (isSwapBaseToQuote) {
        userBaseTokenAccount = selectedInputTokenAddressFromSeveral
      } else {
        userQuoteTokenAccount = selectedInputTokenAddressFromSeveral
      }
    }

    const isLastSwapStep = i === swapRoute.length
    // change output token account address for last step
    if (isLastSwapStep && selectedOutputTokenAddressFromSeveral) {
      if (isSwapBaseToQuote) {
        userQuoteTokenAccount = selectedOutputTokenAddressFromSeveral
      } else {
        userBaseTokenAccount = selectedOutputTokenAddressFromSeveral
      }
    }

    if (swapStep.ammLabel === 'Serum') {
      const { swapAmountInWithSlippage, swapAmountOutWithSlippage, market } =
        swapStep

      const tokenADecimals = market.market?._baseSplTokenDecimals
      const tokenBDecimals = market.market?._quoteSplTokenDecimals

      const isBuySide = !isSwapBaseToQuote
      const side = isBuySide ? 'buy' : 'sell'

      // create open orders account if needed
      const { address: openOrdersAccountAddress } = swapRouteOpenOrdersMap.get(
        market.market?.address.toString()
      )

      const variablesForPlacingOrder = await getVariablesForPlacingOrder({
        wallet,
        connection,
        market: market.market,
        vaultSigner: market.vaultSigner,
        openOrdersAccountAddress,
        side,
        tokenAccountA: new PublicKey(userBaseTokenAccount),
        tokenAccountB: new PublicKey(userQuoteTokenAccount),
      })

      const Side = { Ask: { ask: {} }, Bid: { bid: {} } }

      const swapAmountInBN = toBNWithDecimals(
        swapAmountInWithSlippage,
        isSwapBaseToQuote ? tokenADecimals : tokenBDecimals
      )

      const swapAmountOutBN = toBNWithDecimals(
        swapAmountOutWithSlippage,
        isSwapBaseToQuote ? tokenBDecimals : tokenADecimals
      )

      console.log('variablesForPlacingOrder', {
        ...variablesForPlacingOrder,
        isBuySide,
        swapAmountInWithSlippage,
        swapAmountOutWithSlippage,
        swapAmountInBN: swapAmountInBN.toString(),
        swapAmountOutBN: swapAmountOutBN.toString(),
      })

      const serumMarketOrderProgram = ProgramsMultiton.getProgramByAddress({
        wallet,
        connection,
        programAddress: MARKET_ORDER_PROGRAM_ADDRESS,
      })

      const placeMarketOrderInstruction =
        await serumMarketOrderProgram.instruction.swap(
          isBuySide ? Side.Bid : Side.Ask,
          swapAmountInBN,
          swapAmountOutBN,
          {
            accounts: variablesForPlacingOrder,
          }
        )

      commonInstructions.push(placeMarketOrderInstruction)
    } else {
      const { swapAmountInWithSlippage, swapAmountOutWithSlippage, pool } =
        swapStep

      const { curveType, swapToken, tokenADecimals, tokenBDecimals } = pool

      const [tokenInDecimals, tokenOutDecimals] = isSwapBaseToQuote
        ? [tokenADecimals, tokenBDecimals]
        : [tokenBDecimals, tokenADecimals]

      const swapAmountInWithDecimals = toBNWithDecimals(
        swapAmountInWithSlippage,
        tokenInDecimals
      )

      const swapAmountOutWithDecimals = toBNWithDecimals(
        swapAmountOutWithSlippage,
        tokenOutDecimals
      )

      console.log({
        swapAmountInWithDecimals,
        swapAmountOutWithDecimals,
        swapAmountInWithDecimalsN: swapAmountInWithDecimals.toNumber(),
        swapAmountOutWithDecimalsN: swapAmountOutWithDecimals.toNumber(),
      })

      const walletWithPk = walletAdapterToWallet(wallet)

      const swapTransactionAndSigners = await buildSwapTransaction({
        wallet: walletWithPk,
        connection,
        poolPublicKey: new PublicKey(swapToken),
        userBaseTokenAccount: new PublicKey(userBaseTokenAccount),
        userQuoteTokenAccount: new PublicKey(userQuoteTokenAccount),
        swapAmountIn: swapAmountInWithDecimals,
        swapAmountOut: swapAmountOutWithDecimals,
        isSwapBaseToQuote,
        transferSOLToWrapped: false,
        curveType,
      })

      if (!swapTransactionAndSigners) {
        throw new Error('Swap transaction creation failed')
      }

      const { transaction, signers } = swapTransactionAndSigners

      commonInstructions.push(...transaction.instructions)
      commonSigners.push(...signers)
    }
  }

  const { address: lastStepOutputTokenAccount } = tokenAccountsMap.get(
    lastSwapStep.outputMint
  )

  const takeFeesFromAccount = new PublicKey(lastStepOutputTokenAccount)

  const { address: feesDestination, decimals: feesDestinationTokenDecimals } =
    getTokenDataByMint(feeAccountTokens, lastSwapStep.outputMint)

  const refFeeAmount =
    ((lastSwapStep.swapAmountOutWithSlippage * SWAP_FEES_SETTINGS.percentage) /
      100) *
    10 ** feesDestinationTokenDecimals

  // add check if serum was in route, mul by serum steps in route
  if (SWAP_FEES_SETTINGS.enabled && feesDestination) {
    // charge extra fees
    if (lastSwapStep.outputMint === WRAPPED_SOL_MINT.toString()) {
      commonInstructions.push(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(feesDestination),
          lamports: parseInt(refFeeAmount.toString(), 10),
        })
      )
    } else {
      commonInstructions.push(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          takeFeesFromAccount,
          new PublicKey(feesDestination),
          wallet.publicKey,
          [],
          parseInt(refFeeAmount.toString(), 10)
        )
      )
    }
  }

  // add close wSOL & OpenOrders ix
  commonInstructions.push(...cleanupInstructions)

  const buildedTransactions = buildTransactions(
    commonInstructions.map((ix) => ({ instruction: ix })),
    wallet.publicKey,
    commonSigners
  )

  console.log('buildedTransactions', buildedTransactions)

  try {
    const tx = await signAndSendTransactions({
      wallet,
      connection,
      transactionsAndSigners: buildedTransactions,
      commitment: 'confirmed',
      skipPreflight: false,
    })

    if (!isTransactionFailed(tx)) {
      return 'success'
    }

    return tx
  } catch (e) {
    console.error('multi swap catch error', e)
  }

  return 'failed'
}

export { multiSwap }
