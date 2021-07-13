import { notify } from './notifications'
import { getDecimalCount, isCCAITradingEnabled, sleep } from './utils'
import {
  Account,
  Commitment,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js'
import { BN } from 'bn.js'
import {
  DexInstructions,
  Market,
  TOKEN_MINTS,
  TokenInstructions,
  OpenOrders,
  parseInstructionErrorResponse,
} from '@project-serum/serum'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { feeTiers } from '@sb/components/TradingTable/Fee/FeeTiers'
import {
  getSelectedTokenAccountForMint,
  getOpenOrdersAccountsCustom,
  ALL_TOKENS_MINTS,
} from './markets'
import { WalletAdapter } from './types'

const getNotificationText = ({
  baseSymbol = 'CCAI',
  quoteSymbol = 'USDC',
  baseUnsettled = 0,
  quoteUnsettled = 0,
  side = 'buy',
  amount = 0,
  price = 0,
  orderType = 'limit',
  operationType,
}: {
  baseSymbol?: string
  quoteSymbol?: string
  baseUnsettled?: number
  quoteUnsettled?: number
  side?: string
  amount?: number
  price?: number
  orderType?: string
  operationType: string
}): [string, string] => {
  const baseSettleText = `${baseUnsettled} ${baseSymbol}`
  const quoteSettleText = `${quoteUnsettled} ${quoteSymbol}`

  const texts = {
    createOrder: [
      `${orderType.slice(0, 1).toUpperCase()}${orderType.slice(
        1
      )} order placed.`,
      `${baseSymbol}/${quoteSymbol}: ${side} ${amount} ${baseSymbol} order placed at ${price} ${quoteSymbol}.`,
    ],
    cancelOrder: [
      `Order canceled.`,
      `${baseSymbol}/${quoteSymbol}: ${side} ${amount} ${baseSymbol} order canceled at ${price} ${quoteSymbol}.`,
    ],
    settleFunds: [
      `Funds Settled.`,
      `${
        baseUnsettled > 0 && quoteUnsettled > 0
          ? `${baseSettleText} and ${quoteSettleText}`
          : baseUnsettled > 0
          ? baseSettleText
          : quoteSettleText
      } has been successfully settled in your wallet.`,
    ],
  }

  return texts[operationType]
}

export async function createTokenAccountTransaction({
  connection,
  wallet,
  mintPublicKey,
}) {
  const newAccount = new Account()
  const transaction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(165),
    space: 165,
    programId: TokenInstructions.TOKEN_PROGRAM_ID,
  })
  transaction.add(
    TokenInstructions.initializeAccount({
      account: newAccount.publicKey,
      mint: mintPublicKey,
      owner: wallet.publicKey,
    })
  )
  return {
    transaction,
    signer: newAccount,
    newAccountPubkey: newAccount.publicKey,
  }
}

export async function settleAllFunds({
  connection,
  wallet,
  tokenAccounts,
  markets,
  selectedTokenAccounts,
}: {
  connection: Connection
  wallet: Wallet
  tokenAccounts: TokenAccount[]
  markets: Market[]
  selectedTokenAccounts?: SelectedTokenAccounts
}) {
  if (!markets || !wallet || !connection || !tokenAccounts) {
    return
  }

  const programIds: PublicKey[] = []
  markets
    .reduce((cumulative, m) => {
      // @ts-ignore
      cumulative.push(m._programId)
      return cumulative
    }, [])
    .forEach((programId) => {
      if (!programIds.find((p) => p.equals(programId))) {
        programIds.push(programId)
      }
    })

  const getOpenOrdersAccountsForProgramId = async (programId) => {
    const openOrdersAccounts = await OpenOrders.findForOwner(
      connection,
      wallet.publicKey,
      programId
    )
    return openOrdersAccounts.filter(
      (openOrders) =>
        openOrders.baseTokenFree.toNumber() ||
        openOrders.quoteTokenFree.toNumber()
    )
  }

  const openOrdersAccountsForProgramIds = await Promise.all(
    programIds.map((programId) => getOpenOrdersAccountsForProgramId(programId))
  )
  const openOrdersAccounts = openOrdersAccountsForProgramIds.reduce(
    (accounts, current) => accounts.concat(current),
    []
  )

  let settleTransactions = await Promise.all(
    openOrdersAccounts.map((openOrdersAccount) => {
      const market = markets.find((m) =>
        // @ts-ignore
        m._decoded?.ownAddress?.equals(openOrdersAccount.market)
      )
      const baseMint = market?.baseMintAddress
      const quoteMint = market?.quoteMintAddress

      const selectedBaseTokenAccount = getSelectedTokenAccountForMint(
        tokenAccounts,
        baseMint,
        baseMint &&
          selectedTokenAccounts &&
          selectedTokenAccounts[baseMint.toBase58()]
      )?.pubkey
      const selectedQuoteTokenAccount = getSelectedTokenAccountForMint(
        tokenAccounts,
        quoteMint,
        quoteMint &&
          selectedTokenAccounts &&
          selectedTokenAccounts[quoteMint.toBase58()]
      )?.pubkey
      console.log(
        'selectedBaseTokenAccount',
        selectedBaseTokenAccount,
        'selectedQuoteTokenAccount',
        selectedQuoteTokenAccount
      )
      if (!selectedBaseTokenAccount || !selectedQuoteTokenAccount) {
        return null
      }

      let referrerQuoteWallet = null

      if (market.supportsReferralFees) {
        if (
          process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS &&
          market.quoteMintAddress.equals(
            ALL_TOKENS_MINTS.find(({ name }) => name === 'USDT').address
          )
        ) {
          referrerQuoteWallet = new PublicKey(
            process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS
          )
        } else if (
          process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS &&
          market.quoteMintAddress.equals(
            ALL_TOKENS_MINTS.find(({ name }) => name === 'USDC').address
          )
        ) {
          referrerQuoteWallet = new PublicKey(
            process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS
          )
        }
      }

      return (
        market &&
        market.makeSettleFundsTransaction(
          connection,
          openOrdersAccount,
          selectedBaseTokenAccount,
          selectedQuoteTokenAccount,
          referrerQuoteWallet
        )
      )
    })
  )
  console.log('settleTransactions before', settleTransactions)
  settleTransactions = settleTransactions.filter(
    (x): x is { signers: [PublicKey | Account]; transaction: Transaction } =>
      !!x
  )
  console.log('settleTransactions after', settleTransactions)
  if (!settleTransactions || settleTransactions.length === 0) return

  const transactions = settleTransactions.slice(0, 4).map((t) => t.transaction)
  const signers: Array<Account | PublicKey> = []
  settleTransactions
    .reduce(
      (cumulative: Array<Account | PublicKey>, t) =>
        cumulative.concat(t.signers),
      []
    )
    .forEach((signer) => {
      if (
        !signers.find((s) => {
          if (s.constructor.name !== signer.constructor.name) {
            return false
          } else if (s.constructor.name === 'PublicKey') {
            // @ts-ignore
            return s.equals(signer)
          } else {
            // @ts-ignore
            return s.publicKey.equals(signer.publicKey)
          }
        })
      ) {
        signers.push(signer)
      }
    })

  const transaction = mergeTransactions(transactions)

  return await sendTransaction({
    transaction,
    signers,
    wallet,
    connection,
  })
}

export async function settleFunds({
  market,
  openOrders,
  connection,
  wallet,
  baseCurrencyAccount,
  quoteCurrencyAccount,
  tokenAccounts,
  selectedTokenAccounts,
  baseCurrency,
  quoteCurrency,
  baseUnsettled,
  quoteUnsettled,
}) {
  if (!wallet) {
    notify({ message: 'Please, connect wallet to settle funds' })
    return
  }

  if (!market) {
    notify({ message: 'Sorry, looks like something went wrong with market' })
    return
  }

  if (!baseCurrencyAccount && !quoteCurrencyAccount) {
    return
  }

  if (!connection || !openOrders) {
    notify({ message: 'Sorry, something went wrong while settling funds' })
    return
  }

  const programIds: PublicKey[] = []
  const m = market
  ;[m]
    .reduce((cumulative, m) => {
      // @ts-ignore
      cumulative.push(m._programId)
      return cumulative
    }, [])
    .forEach((programId) => {
      if (!programIds.find((p) => p.equals(programId))) {
        programIds.push(programId)
      }
    })

  const getOpenOrdersAccountsForProgramId = async (programId) => {
    const openOrdersAccounts = await OpenOrders.findForOwner(
      connection,
      wallet.publicKey,
      programId
    )
    return openOrdersAccounts.filter(
      (openOrders) =>
        openOrders.baseTokenFree.toNumber() ||
        openOrders.quoteTokenFree.toNumber()
    )
  }

  const openOrdersAccountsForProgramIds = await Promise.all(
    programIds.map((programId) => getOpenOrdersAccountsForProgramId(programId))
  )
  const openOrdersAccounts = openOrdersAccountsForProgramIds.reduce(
    (accounts, current) => accounts.concat(current),
    []
  )

  // console.log('openOrdersAccounts', openOrdersAccounts)

  let settleTransactions = await Promise.all(
    openOrdersAccounts.map((openOrdersAccount) => {
      const market = [m].find((m) =>
        // @ts-ignore
        m._decoded?.ownAddress?.equals(openOrdersAccount.market)
      )
      const baseMint = market?.baseMintAddress
      const quoteMint = market?.quoteMintAddress

      const selectedBaseTokenAccount = getSelectedTokenAccountForMint(
        tokenAccounts,
        baseMint,
        baseMint &&
          selectedTokenAccounts &&
          selectedTokenAccounts[baseMint.toBase58()]
      )?.pubkey
      const selectedQuoteTokenAccount = getSelectedTokenAccountForMint(
        tokenAccounts,
        quoteMint,
        quoteMint &&
          selectedTokenAccounts &&
          selectedTokenAccounts[quoteMint.toBase58()]
      )?.pubkey

      if (!selectedBaseTokenAccount || !selectedQuoteTokenAccount) {
        return null
      }

      let referrerQuoteWallet = null

      if (market.supportsReferralFees) {
        if (
          process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS &&
          market.quoteMintAddress.equals(
            ALL_TOKENS_MINTS.find(({ name }) => name === 'USDT').address
          )
        ) {
          referrerQuoteWallet = new PublicKey(
            process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS
          )
        } else if (
          process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS &&
          market.quoteMintAddress.equals(
            ALL_TOKENS_MINTS.find(({ name }) => name === 'USDC').address
          )
        ) {
          referrerQuoteWallet = new PublicKey(
            process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS
          )
        }
      }

      return (
        market &&
        market.makeSettleFundsTransaction(
          connection,
          openOrdersAccount,
          selectedBaseTokenAccount,
          selectedQuoteTokenAccount,
          referrerQuoteWallet
        )
      )
    })
  )

  settleTransactions = settleTransactions.filter(
    (x): x is { signers: [PublicKey | Account]; transaction: Transaction } =>
      !!x
  )
  if (
    (!settleTransactions || settleTransactions.length === 0) &&
    !wallet.autoApprove
  ) {
    notify({
      message: 'No funds to settle',
      type: 'error',
    })

    return
  }

  const transactions = settleTransactions.slice(0, 4).map((t) => t.transaction)
  const signers: Array<Account | PublicKey> = []
  settleTransactions
    .reduce(
      (cumulative: Array<Account | PublicKey>, t) =>
        cumulative.concat(t.signers),
      []
    )
    .forEach((signer) => {
      if (
        !signers.find((s) => {
          if (s.constructor.name !== signer.constructor.name) {
            return false
          } else if (s.constructor.name === 'PublicKey') {
            // @ts-ignore
            return s.equals(signer)
          } else {
            // @ts-ignore
            return s.publicKey.equals(signer.publicKey)
          }
        })
      ) {
        signers.push(signer)
      }
    })

  const transaction = mergeTransactions(transactions)
  return await sendTransaction({
    transaction,
    signers,
    wallet,
    connection,
    operationType: 'settleFunds',
    params: {
      baseSymbol: baseCurrency,
      quoteSymbol: quoteCurrency,
      baseUnsettled: baseUnsettled,
      quoteUnsettled: quoteUnsettled,
    },
  })

  // let createAccountTransaction;
  // let createAccountSigner;
  // let baseCurrencyAccountPubkey = baseCurrencyAccount?.pubkey;
  // let quoteCurrencyAccountPubkey = quoteCurrencyAccount?.pubkey;

  // if (!baseCurrencyAccountPubkey) {
  //   const result = await createTokenAccountTransaction({
  //     connection,
  //     wallet,
  //     mintPublicKey: market.baseMintAddress,
  //   });
  //   baseCurrencyAccountPubkey = result?.newAccountPubkey;
  //   createAccountTransaction = result?.transaction;
  //   createAccountSigner = result?.signer;
  // }
  // if (!quoteCurrencyAccountPubkey) {
  //   const result = await createTokenAccountTransaction({
  //     connection,
  //     wallet,
  //     mintPublicKey: market.quoteMintAddress,
  //   });
  //   quoteCurrencyAccountPubkey = result?.newAccountPubkey;
  //   createAccountTransaction = result?.transaction;
  //   createAccountSigner = result?.signer;
  // }
  // let referrerQuoteWallet = null;

  // if (market.supportsReferralFees) {
  //   if (
  //     process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS &&
  //     market.quoteMintAddress.equals(
  //       ALL_TOKENS_MINTS.find(({ name }) => name === 'USDT').address,
  //     )
  //   ) {
  //     referrerQuoteWallet = new PublicKey(
  //       process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS,
  //     );
  //   } else if (
  //     process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS &&
  //     market.quoteMintAddress.equals(
  //       ALL_TOKENS_MINTS.find(({ name }) => name === 'USDC').address,
  //     )
  //   ) {
  //     referrerQuoteWallet = new PublicKey(
  //       process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS,
  //     );
  //   }
  // }

  // const {
  //   transaction: settleFundsTransaction,
  //   signers: settleFundsSigners,
  // } = await market.makeSettleFundsTransaction(
  //   connection,
  //   openOrders,
  //   baseCurrencyAccountPubkey,
  //   quoteCurrencyAccountPubkey,
  //   referrerQuoteWallet,
  // );

  // console.log('settleFundsTransaction', settleFundsTransaction, settleFundsTransaction.length)
  // console.log('settleFundsSigners', settleFundsSigners, settleFundsSigners.length)

  // if (!settleFundsSigners || settleFundsSigners.length === 0) return;

  // let transaction = mergeTransactions([
  //   createAccountTransaction,
  //   settleFundsTransaction,
  // ]);

  // let signers = createAccountSigner
  //   ? [...settleFundsSigners, createAccountSigner]
  //   : settleFundsSigners;

  // return await sendTransaction({
  //   transaction,
  //   signers,
  //   wallet,
  //   connection,
  //   sendingMessage: 'Settling funds...',
  // });
}

export async function cancelOrder(params) {
  return cancelOrders({ ...params, orders: [params.order] })
}

export async function cancelOrders({ market, wallet, connection, orders }) {
  const transaction = market.makeMatchOrdersTransaction(5)
  orders.forEach((order) => {
    transaction.add(
      market.makeCancelOrderInstruction(connection, wallet.publicKey, order)
    )
  })
  transaction.add(market.makeMatchOrdersTransaction(5))

  return await sendTransaction({
    transaction,
    wallet,
    connection,
    signers: [],
    sendingMessage: 'Sending cancel...',
    params: {
      baseSymbol: orders[0]?.marketName.split('/')[0],
      quoteSymbol: orders[0]?.marketName.split('/')[1],
      side: orders[0]?.side,
      amount: orders[0]?.size,
      price: orders[0]?.price,
    },
    operationType: 'cancelOrder',
  })
}

export const validateVariablesForPlacingOrder = ({
  price,
  size,
  market,
  wallet,
  pair,
}) => {
  let formattedMinOrderSize =
    market?.minOrderSize?.toFixed(getDecimalCount(market.minOrderSize)) ||
    market?.minOrderSize

  let formattedTickSize =
    market?.tickSize?.toFixed(getDecimalCount(market.tickSize)) ||
    market?.tickSize

  if (pair === 'CCAI_USDC' && !isCCAITradingEnabled()) {
    notify({
      message: 'Please, wait until 2pm UTC time before trading CCAI',
      type: 'error',
    })
    return
  }

  if (isNaN(price)) {
    notify({ message: 'Invalid price', type: 'error' })
    return
  }
  if (isNaN(size)) {
    notify({ message: 'Invalid size', type: 'error' })
    return
  }
  if (!wallet || !wallet.publicKey) {
    notify({ message: 'Connect wallet', type: 'error' })
    return
  }
  if (!market) {
    notify({ message: 'Invalid  market', type: 'error' })
    return
  }
  if (!isIncrement(size, market.minOrderSize)) {
    notify({
      message: `Size must be an increment of ${formattedMinOrderSize}`,
      type: 'error',
    })
    return
  }
  if (size < market.minOrderSize) {
    notify({ message: 'Size too small', type: 'error' })
    return
  }
  if (!isIncrement(price, market.tickSize)) {
    notify({
      message: `Price must be an increment of ${formattedTickSize}`,
      type: 'error',
    })
    return
  }
  if (price < market.tickSize) {
    notify({ message: 'Price under tick size', type: 'error' })
    return
  }

  return true
}

const isIncrement = (num, step) =>
  Math.abs((num / step) % 1) < 1e-5 || Math.abs(((num / step) % 1) - 1) < 1e-5

export async function placeOrder({
  side,
  price,
  size,
  pair,
  orderType,
  market,
  isMarketOrder,
  connection,
  wallet,
  baseCurrencyAccount,
  quoteCurrencyAccount,
  feeAccounts,
}) {
  console.log('place ORDER', market?.minOrderSize, size)
  const isValidationSuccessfull = validateVariablesForPlacingOrder({
    price,
    size,
    market,
    wallet,
    pair,
  })

  if (!isValidationSuccessfull) {
    return
  }

  const owner = wallet.publicKey

  const payer =
    side === 'sell' ? baseCurrencyAccount.pubkey : quoteCurrencyAccount.pubkey
  if (!payer) {
    notify({
      message: 'Need an SPL token account for cost currency',
      type: 'error',
    })
    return
  }
  const params = {
    owner,
    payer,
    side,
    price,
    size,
    pair,
    orderType,
    isMarketOrder,
  }
  console.log(params)

  const transaction = market.makeMatchOrdersTransaction(5)
  console.log('placeOrder transaction: ', transaction)
  let {
    transaction: placeOrderTx,
    signers,
    ...rest
  } = await market.makePlaceOrderTransaction(connection, params, 10_000, 10_000)

  console.log('placeOrder placeOrderTx', placeOrderTx)
  console.log('placeOrder rest', rest)

  transaction.add(placeOrderTx)
  transaction.add(market.makeMatchOrdersTransaction(5))

  console.log('placeOrder transaction after add', transaction)

  return await sendTransaction({
    transaction,
    wallet,
    connection,
    signers,
    sendingMessage: 'Sending order...',
    operationType: 'createOrder',
    params: {
      side: side,
      price: price,
      amount: size,
      baseSymbol: pair.split('_')[0],
      quoteSymbol: pair.split('_')[1],
      orderType: orderType === 'ioc' ? 'market' : 'limit',
    },
  })
}

export async function sendSignedTransaction({
  signedTransaction,
  connection,
  sendingMessage = 'Sending transaction...',
  sentMessage = 'Transaction sent',
  successMessage = 'Transaction confirmed',
  timeout = DEFAULT_TIMEOUT,
}: {
  signedTransaction: Transaction
  connection: Connection
  sendingMessage?: string
  sentMessage?: string
  successMessage?: string
  timeout?: number
}): Promise<string> {
  const rawTransaction = signedTransaction.serialize()
  const startTime = getUnixTs()
  notify({ message: sendingMessage })
  const txid: TransactionSignature = await connection.sendRawTransaction(
    rawTransaction,
    {
      skipPreflight: true,
    }
  )
  notify({ message: sentMessage, type: 'success', txid })

  console.log('Started awaiting confirmation for', txid)

  let done = false
  ;(async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      })
      await sleep(700)
    }
  })()
  try {
    await awaitTransactionSignatureConfirmation(txid, timeout, connection)
  } catch (err) {
    if (err.timeout) {
      throw new Error('Timed out awaiting confirmation on transaction')
    }
    let simulateResult: SimulatedTransactionResponse | null = null
    try {
      simulateResult = (
        await simulateTransaction(connection, signedTransaction, 'single')
      ).value
    } catch (e) {}
    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i]
          if (line.startsWith('Program log: ')) {
            throw new Error(
              'Transaction failed: ' + line.slice('Program log: '.length)
            )
          }
        }
      }
      let parsedError
      if (
        typeof simulateResult.err == 'object' &&
        'InstructionError' in simulateResult.err
      ) {
        const parsedErrorInfo = parseInstructionErrorResponse(
          signedTransaction,
          simulateResult.err['InstructionError']
        )
        parsedError = parsedErrorInfo.error
      } else {
        parsedError = JSON.stringify(simulateResult.err)
      }
      throw new Error(parsedError)
    }
    throw new Error('Transaction failed')
  } finally {
    done = true
  }
  notify({ message: successMessage, type: 'success', txid })

  console.log('Latency', txid, getUnixTs() - startTime)
  return txid
}

export async function signTransaction({
  transaction,
  wallet,
  signers = [],
  connection,
}: {
  transaction: Transaction
  wallet: WalletAdapter
  signers?: Array<Account>
  connection: Connection
}) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash
  transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey))
  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }
  return await wallet.signTransaction(transaction)
}

export async function signTransactions({
  transactionsAndSigners,
  wallet,
  connection,
}: {
  transactionsAndSigners: {
    transaction: Transaction
    signers?: Array<Account>
  }[]
  wallet: WalletAdapter
  connection: Connection
}) {
  const blockhash = (await connection.getRecentBlockhash('max')).blockhash
  transactionsAndSigners.forEach(({ transaction, signers = [] }) => {
    transaction.recentBlockhash = blockhash
    transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey))
    if (signers?.length > 0) {
      transaction.partialSign(...signers)
    }
  })
  return await wallet.signAllTransactions(
    transactionsAndSigners.map(({ transaction }) => transaction)
  )
}

export async function listMarket({
  connection,
  wallet,
  baseMint,
  quoteMint,
  baseLotSize,
  quoteLotSize,
  dexProgramId,
}: {
  connection: Connection
  wallet: WalletAdapter
  baseMint: PublicKey
  quoteMint: PublicKey
  baseLotSize: number
  quoteLotSize: number
  dexProgramId: PublicKey
}) {
  const market = new Account()
  const requestQueue = new Account()
  const eventQueue = new Account()
  const bids = new Account()
  const asks = new Account()
  const baseVault = new Account()
  const quoteVault = new Account()
  const feeRateBps = 0
  const quoteDustThreshold = new BN(100)

  async function getVaultOwnerAndNonce() {
    const nonce = new BN(0)
    while (true) {
      try {
        const vaultOwner = await PublicKey.createProgramAddress(
          [market.publicKey.toBuffer(), nonce.toArrayLike(Buffer, 'le', 8)],
          dexProgramId
        )
        return [vaultOwner, nonce]
      } catch (e) {
        nonce.iaddn(1)
      }
    }
  }
  const [vaultOwner, vaultSignerNonce] = await getVaultOwnerAndNonce()

  const tx1 = new Transaction()
  tx1.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: baseVault.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(165),
      space: 165,
      programId: TokenInstructions.TOKEN_PROGRAM_ID,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: quoteVault.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(165),
      space: 165,
      programId: TokenInstructions.TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeAccount({
      account: baseVault.publicKey,
      mint: baseMint,
      owner: vaultOwner,
    }),
    TokenInstructions.initializeAccount({
      account: quoteVault.publicKey,
      mint: quoteMint,
      owner: vaultOwner,
    })
  )

  const tx2 = new Transaction()
  tx2.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: market.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        Market.getLayout(dexProgramId).span
      ),
      space: Market.getLayout(dexProgramId).span,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: requestQueue.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(5120 + 12),
      space: 5120 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: eventQueue.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(262144 + 12),
      space: 262144 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: bids.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(65536 + 12),
      space: 65536 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: asks.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(65536 + 12),
      space: 65536 + 12,
      programId: dexProgramId,
    }),
    DexInstructions.initializeMarket({
      market: market.publicKey,
      requestQueue: requestQueue.publicKey,
      eventQueue: eventQueue.publicKey,
      bids: bids.publicKey,
      asks: asks.publicKey,
      baseVault: baseVault.publicKey,
      quoteVault: quoteVault.publicKey,
      baseMint,
      quoteMint,
      baseLotSize: new BN(baseLotSize),
      quoteLotSize: new BN(quoteLotSize),
      feeRateBps,
      vaultSignerNonce,
      quoteDustThreshold,
      programId: dexProgramId,
    })
  )

  const signedTransactions = await signTransactions({
    transactionsAndSigners: [
      { transaction: tx1, signers: [baseVault, quoteVault] },
      {
        transaction: tx2,
        signers: [market, requestQueue, eventQueue, bids, asks],
      },
    ],
    wallet,
    connection,
  })
  for (let signedTransaction of signedTransactions) {
    await sendSignedTransaction({
      signedTransaction,
      connection,
    })
  }

  return market.publicKey
}

const getUnixTs = () => {
  return new Date().getTime() / 1000
}

const DEFAULT_TIMEOUT = 15000

export async function sendTransaction({
  transaction,
  wallet,
  signers = [],
  connection,
  sendingMessage = 'Sending transaction...',
  sentMessage = 'Transaction sent',
  successMessage = 'Transaction confirmed',
  timeout = DEFAULT_TIMEOUT,
  operationType = 'createOrder',
  params,
}: {
  transaction: Transaction
  wallet: WalletAdapter
  signers: Account[]
  connection: Connection
  sendingMessage?: string
  sentMessage?: string
  successMessage?: string
  timeout?: number
  operationType?: string
  params: any
}) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash

  console.log('operationType', operationType)
  console.log('signers', signers)

  transaction.setSigners(
    wallet.publicKey,
    ...signers.map((s) => s.publicKey).filter((p) => !!p)
  )

  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }

  const transactionFromWallet = await wallet.signTransaction(transaction)

  console.log('sendTransaction transactionFromWallet: ', transactionFromWallet)

  const rawTransaction = await transactionFromWallet.serialize()

  console.log('sendTransaction rawTransaction: ', rawTransaction)
  const startTime = getUnixTs()

  // notify({ message: sendingMessage })
  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
  })

  const [title, text] = getNotificationText({
    baseSymbol: params?.baseSymbol || '',
    quoteSymbol: params?.quoteSymbol || '',
    quoteUnsettled: params?.quoteUnsettled || 0,
    baseUnsettled: params?.baseUnsettled || 0,
    price: params?.price || 0,
    amount: params?.amount || 0,
    side: params?.side || '',
    orderType: params?.orderType || 'limit',
    operationType,
  })

  notify({
    message: title,
    description: text,
    type: 'success',
    txid,
  })

  console.log('Started awaiting confirmation for', txid)

  let done = false
  ;(async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      const resultOfSendingConfirm = connection.sendRawTransaction(
        rawTransaction,
        {
          skipPreflight: true,
        }
      )

      console.log(
        'sendTransaction resultOfSendingConfirm',
        resultOfSendingConfirm
      )
      await sleep(700)
    }
  })()
  try {
    const resultOfSignature = await awaitTransactionSignatureConfirmation(
      txid,
      timeout,
      connection
    )

    console.log('sendTransaction resultOfSignature', resultOfSignature)
  } catch (err) {
    if (err.timeout) {
      notify({
        message: 'Timed out awaiting confirmation on transaction',
        type: 'error',
      })
      throw new Error('Timed out awaiting confirmation on transaction')
    }

    notify({ message: 'Transaction failed', type: 'error' })
    throw new Error('Transaction failed')
  } finally {
    done = true
  }
  // notify({ message: successMessage, type: 'success', txid })
  console.log('Latency', txid, getUnixTs() - startTime)
  return txid
}

async function awaitTransactionSignatureConfirmation(
  txid,
  timeout,
  connection
) {
  let done = false
  const result = await new Promise((resolve, reject) => {
    ;(async () => {
      setTimeout(() => {
        if (done) {
          return
        }
        done = true
        console.log('Timed out for txid', txid)
        reject({ timeout: true })
      }, timeout)
      try {
        connection.onSignature(
          txid,
          (result) => {
            console.log('WS confirmed', txid, result)
            done = true
            if (result.err) {
              reject(result.err)
            } else {
              resolve(result)
            }
          },
          'recent'
        )
        console.log('Set up WS connection', txid)
      } catch (e) {
        done = true
        console.log('WS error in setup', txid, e)
      }
      while (!done) {
        // eslint-disable-next-line no-loop-func
        ;(async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ])
            const result = signatureStatuses && signatureStatuses.value[0]
            if (!done) {
              if (!result) {
                console.log('REST null result for', txid, result)
              } else if (result.err) {
                console.log('REST error for', txid, result)
                done = true
                reject(result.err)
              } else if (!result.confirmations) {
                console.log('REST no confirmations for', txid, result)
              } else {
                console.log('REST confirmation for', txid, result)
                done = true
                resolve(result)
              }
            }
          } catch (e) {
            if (!done) {
              console.log('REST connection error: txid', txid, e)
            }
          }
        })()
        await sleep(700)
      }
    })()
  })
  done = true
  return result
}

function mergeTransactions(transactions) {
  const transaction = new Transaction()
  transactions
    .filter((t) => t)
    .forEach((t) => {
      transaction.add(t)
    })
  return transaction
}

// export async function sendTransaction({
//   transaction,
//   wallet,
//   signers = [],
//   connection,
//   sendingMessage = 'Sending transaction...',
//   sentMessage = 'Transaction sent',
//   successMessage = 'Transaction confirmed',
//   timeout = DEFAULT_TIMEOUT,
// }: {
//   transaction: Transaction;
//   wallet: Wallet;
//   signers?: Array<Account>;
//   connection: Connection;
//   sendingMessage?: string;
//   sentMessage?: string;
//   successMessage?: string;
//   timeout?: number;
// }) {
//   const signedTransaction = await signTransaction({
//     transaction,
//     wallet,
//     signers,
//     connection,
//   });

//   return await sendSignedTransaction({
//     signedTransaction,
//     connection,
//     sendingMessage,
//     sentMessage,
//     successMessage,
//     timeout,
//   });
// }

/** Copy of Connection.simulateTransaction that takes a commitment parameter. */
async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching
  )

  const signData = transaction.serializeMessage()
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData)
  const encodedTransaction = wireTransaction.toString('base64')
  const config: any = { encoding: 'base64', commitment }
  const args = [encodedTransaction, config]

  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args)
  if (res.error) {
    throw new Error('failed to simulate transaction: ' + res.error.message)
  }
  return res.result
}
