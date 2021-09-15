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

import { WalletAdapter } from './types'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { getCache } from './fetch-loop'
import { Metrics } from '../../utils/metrics'
import {
  getConnectionFromMultiConnections,
  getProviderNameFromUrl,
} from './connection'

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
      `${baseSymbol}/${quoteSymbol}: ${side} ${amount} ${baseSymbol} order placed${
        orderType === 'market' ? '' : ` at ${price} ${quoteSymbol}`
      }.`,
    ],
    cancelOrder: [
      `Limit Order canceled.`,
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
}: {
  connection: Connection
  wallet: WalletAdapter
  mintPublicKey: PublicKey
}): Promise<{
  transaction: Transaction
  newAccountPubkey: PublicKey
}> {
  const ata = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintPublicKey,
    wallet.publicKey
  )
  const transaction = new Transaction()
  transaction.add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintPublicKey,
      ata,
      wallet.publicKey,
      wallet.publicKey
    )
  )
  return {
    transaction,
    newAccountPubkey: ata,
  }
}

export async function settleFunds({
  market,
  openOrders,
  connection,
  wallet,
  baseCurrency,
  quoteCurrency,
  baseTokenAccount,
  quoteTokenAccount,
  baseUnsettled,
  quoteUnsettled,
  focusPopup = false,
}: {
  market: Market
  wallet: WalletAdapter
  connection: Connection
  openOrders: OpenOrders
  baseCurrency: string
  quoteCurrency: string
  baseTokenAccount: any
  quoteTokenAccount: any
  baseUnsettled: number
  quoteUnsettled: number
  focusPopup?: boolean
}) {
  if (!wallet) {
    notify({ message: 'Please, connect wallet to settle funds' })
    return
  }

  if (!market) {
    notify({ message: 'Sorry, looks like something went wrong with market' })
    return
  }

  if (!baseCurrency || !quoteCurrency) {
    notify({
      message: `Sorry, looks base & quote symbols doesnt loaded in the market`,
    })
    return
  }

  if (!connection || !openOrders) {
    notify({ message: 'Sorry, something went wrong while settling funds' })
    return
  }

  const usdcRef = process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS
  const usdtRef = process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS

  let createAccountTransaction: Transaction | undefined
  let baseCurrencyAccountPubkey = baseTokenAccount?.pubkey
  let quoteCurrencyAccountPubkey = quoteTokenAccount?.pubkey

  if (!baseCurrencyAccountPubkey) {
    const result = await createTokenAccountTransaction({
      connection,
      wallet,
      mintPublicKey: market.baseMintAddress,
    })
    baseCurrencyAccountPubkey = result?.newAccountPubkey
    createAccountTransaction = result?.transaction
  }
  if (!quoteCurrencyAccountPubkey) {
    const result = await createTokenAccountTransaction({
      connection,
      wallet,
      mintPublicKey: market.quoteMintAddress,
    })
    quoteCurrencyAccountPubkey = result?.newAccountPubkey
    createAccountTransaction = result?.transaction
  }
  let referrerQuoteWallet: PublicKey | null = null
  if (market.supportsReferralFees) {
    const usdt = TOKEN_MINTS.find(({ name }) => name === 'USDT')
    const usdc = TOKEN_MINTS.find(({ name }) => name === 'USDC')
    if (usdtRef && usdt && market.quoteMintAddress.equals(usdt.address)) {
      referrerQuoteWallet = new PublicKey(usdtRef)
    } else if (
      usdcRef &&
      usdc &&
      market.quoteMintAddress.equals(usdc.address)
    ) {
      referrerQuoteWallet = new PublicKey(usdcRef)
    }
  }
  const {
    transaction: settleFundsTransaction,
    signers: settleFundsSigners,
  } = await market.makeSettleFundsTransaction(
    connection,
    openOrders,
    baseCurrencyAccountPubkey,
    quoteCurrencyAccountPubkey,
    referrerQuoteWallet
  )

  let transaction = mergeTransactions([
    createAccountTransaction,
    settleFundsTransaction,
  ])

  if (
    (!settleFundsTransaction ||
      settleFundsTransaction.instructions.length === 0) &&
    !wallet.autoApprove
  ) {
    notify({
      message: 'No funds to settle',
      type: 'error',
    })

    return
  }

  return await sendTransaction({
    transaction,
    signers: settleFundsSigners,
    wallet,
    connection,
    operationType: 'settleFunds',
    params: {
      baseSymbol: baseCurrency,
      quoteSymbol: quoteCurrency,
      baseUnsettled: baseUnsettled,
      quoteUnsettled: quoteUnsettled,
    },
    focusPopup,
  })
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

  if (pair === 'RIN_USDC' && !isCCAITradingEnabled()) {
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
  openOrdersAccount,
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

  const openOrdersAccountFromCache = getCache(
    `preCreatedOpenOrdersFor${market?.publicKey}`
  )

  console.log('openOrdersAccount in placeOrder', openOrdersAccount)

  const transaction = new Transaction()

  if (!baseCurrencyAccount) {
    const {
      transaction: createAccountTransaction,
      newAccountPubkey,
    } = await createTokenAccountTransaction({
      connection,
      wallet,
      mintPublicKey: market.baseMintAddress,
    })
    transaction.add(createAccountTransaction)
    baseCurrencyAccount = { pubkey: newAccountPubkey }
  }
  if (!quoteCurrencyAccount) {
    const {
      transaction: createAccountTransaction,
      newAccountPubkey,
    } = await createTokenAccountTransaction({
      connection,
      wallet,
      mintPublicKey: market.quoteMintAddress,
    })
    transaction.add(createAccountTransaction)
    quoteCurrencyAccount = { pubkey: newAccountPubkey }
  }

  const payer =
    side === 'sell' ? baseCurrencyAccount.pubkey : quoteCurrencyAccount.pubkey
  const usdcRef = process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS
  const usdtRef = process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS

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
    ...(!openOrdersAccount
      ? { openOrdersAccount: openOrdersAccountFromCache }
      : { openOrdersAccount }),
  }
  console.log(params)

  transaction.add(market.makeMatchOrdersTransaction(5))
  let referrerQuoteWallet: PublicKey | null = null
  if (market.supportsReferralFees) {
    const usdt = TOKEN_MINTS.find(({ name }) => name === 'USDT')
    const usdc = TOKEN_MINTS.find(({ name }) => name === 'USDC')
    if (usdtRef && usdt && market.quoteMintAddress.equals(usdt.address)) {
      referrerQuoteWallet = new PublicKey(usdtRef)
    } else if (
      usdcRef &&
      usdc &&
      market.quoteMintAddress.equals(usdc.address)
    ) {
      referrerQuoteWallet = new PublicKey(usdcRef)
    }
  }

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

  let baseCurrencyAccountPubkey = baseCurrencyAccount?.pubkey
  let quoteCurrencyAccountPubkey = quoteCurrencyAccount?.pubkey

  if (isMarketOrder && openOrdersAccount) {
    const {
      transaction: settleFundsTransaction,
      signers: settleFundsSigners,
    } = await market.makeSettleFundsTransaction(
      connection,
      openOrdersAccount,
      baseCurrencyAccountPubkey,
      quoteCurrencyAccountPubkey,
      referrerQuoteWallet
    )

    transaction.add(settleFundsTransaction)
    signers.push(...settleFundsSigners)
  }

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
      orderType: isMarketOrder ? 'market' : 'limit',
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
    await awaitTransactionSignatureConfirmation({ txid, timeout, connection })
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
    transactionsAndSigners.map(({ transaction }) => transaction),
    true
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

const DEFAULT_TIMEOUT = 30000

export async function sendTransaction({
  transaction,
  wallet,
  signers = [],
  connection,
  sentMessage = 'Transaction sent',
  successMessage = 'Transaction confirmed',
  timeout = DEFAULT_TIMEOUT,
  operationType,
  params,
  focusPopup,
}: {
  transaction: Transaction
  wallet: WalletAdapter
  signers: Account[]
  connection: Connection
  sentMessage?: string
  successMessage?: string
  timeout?: number
  operationType?: string
  params?: any
  focusPopup?: boolean
}) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash

  console.log('signers', signers)

  transaction.setSigners(
    wallet.publicKey,
    ...signers.map((s) => s.publicKey).filter((p) => !!p)
  )

  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }

  const transactionFromWallet = await wallet
    .signTransaction(transaction, focusPopup)
    .then((res) => {
      window.focus()
      return res
    })

  console.log('sendTransaction transactionFromWallet: ', transactionFromWallet)

  const rawTransaction = await transactionFromWallet.serialize()

  console.log('sendTransaction rawTransaction: ', rawTransaction)
  const startTime = getUnixTs()

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
  })

  if (operationType) {
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
  } else {
    notify({
      message: sentMessage,
      type: 'success',
      txid,
    })
  }

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
      await sleep(1200)
    }
  })()

  const rawConnection = getConnectionFromMultiConnections({
    connection: connection,
  })

  let result = await awaitTransactionSignatureConfirmationWithNotifications({
    txid,
    timeout,
    connection: rawConnection,
    showErrorForTimeout: false,
  })
  if (result === 'timeout') {
    const rpcProvider = getProviderNameFromUrl({ rawConnection })
    Metrics.sendMetrics({
      metricName: `error.rpc.${rpcProvider}.timeoutConfirmationTransaction`,
    })

    // trying again for another 30s with probably another connection
    const rawConnectionForRetry = getConnectionFromMultiConnections({
      connection: connection,
    })

    result = await awaitTransactionSignatureConfirmationWithNotifications({
      txid,
      timeout,
      connection: rawConnectionForRetry,
      interval: 2400,
      showErrorForTimeout: true,
    })

    if (!result) {
      const rpcProvider = getProviderNameFromUrl({
        rawConnection: rawConnectionForRetry,
      })

      Metrics.sendMetrics({
        metricName: `error.rpc.${rpcProvider}.secondTimeoutConfirmationTransaction`,
      })
    }
  }

  done = true
  if (result !== true) return null

  if (!operationType) notify({ message: successMessage, type: 'success', txid })
  console.log('Latency', txid, getUnixTs() - startTime)
  return txid
}

const awaitTransactionSignatureConfirmationWithNotifications = async ({
  txid,
  timeout,
  interval,
  connection,
  showErrorForTimeout = false,
}: {
  txid: string
  timeout: number
  interval?: number
  connection: Connection
  showErrorForTimeout: boolean
}) => {
  try {
    const resultOfSignature = await awaitTransactionSignatureConfirmation({
      txid,
      timeout,
      interval,
      connection,
    })

    console.log('sendTransaction resultOfSignature', resultOfSignature)
  } catch (err) {
    console.log('sendTransaction error', err)
    if (err.timeout && !showErrorForTimeout) {
      notify({
        message: 'Timed out awaiting confirmation on transaction',
        type: 'info',
        description:
          "We'll continue checking confirmations for this transactions",
      })

      return 'timeout'
    }

    notify({ message: 'Transaction failed', type: 'error' })
    const rpcProvider = getProviderNameFromUrl({
      rawConnection: connection,
    })

    Metrics.sendMetrics({
      metricName: `error.rpc.${rpcProvider}.transactionFailed-${JSON.stringify(
        err
      )}`,
    })
    return null
  }

  return true
}

async function awaitTransactionSignatureConfirmation({
  txid,
  timeout,
  connection,
  interval = 1200,
}: {
  txid: string
  timeout: number
  connection: Connection
  interval?: number
}) {
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
          const rpcProvider = getProviderNameFromUrl({
            rawConnection: connection,
          })
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

                Metrics.sendMetrics({
                  metricName: `error.rpc.${rpcProvider}.getSignatureStatusesError-${JSON.stringify(
                    result.err
                  )}`,
                })
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
              Metrics.sendMetrics({
                metricName: `error.rpc.${rpcProvider}.connectionError-${JSON.stringify(
                  e
                )}`,
              })
            }
          }
        })()
        await sleep(interval)
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
