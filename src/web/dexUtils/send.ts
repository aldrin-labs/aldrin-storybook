import { Metrics } from '@core/utils/metrics'
import {
  DexInstructions,
  Market,
  OpenOrders,
  parseInstructionErrorResponse,
  TokenInstructions,
} from '@project-serum/serum'
import { OrderParams } from '@project-serum/serum/lib/market'
import {
  AmendOrderParams,
  CancelOrderParams,
  Maybe,
  PlaceOrder,
  SendTransactionParams,
  SignTransactionsParams,
  ValidateOrderParams,
  WalletAdapter,
  SendSignedTransactionParams,
  SendSignedTransactionResult,
  AsyncSendSignedTransactionResult,
} from '@sb/dexUtils/types'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
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
import BN, { BN } from 'bn.js'
import {
  getConnectionFromMultiConnections,
  getProviderNameFromUrl,
} from './connection'
import { getCache } from './fetch-loop'
import { getReferrerQuoteWallet } from './getReferrerQuoteWallet'
import { isTokenAccountsForSettleValid } from './isTokenAccountsForSettleValid'
import { notify } from './notifications'
import { getDecimalCount, isCCAITradingEnabled, sleep } from './utils'

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
    cancelAll: ['Orders canceled.', ``],
    settleAllFunds: ['Funds settled.', ''],
  }

  return texts[operationType]
}

export async function createTokenAccountTransaction({
  wallet,
  mintPublicKey,
}: {
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

export async function getSettleFundsTransaction({
  market,
  openOrders,
  connection,
  wallet,
  baseCurrency,
  quoteCurrency,
  baseTokenAccount,
  quoteTokenAccount,
}: {
  market: Market
  wallet: WalletAdapter
  connection: Connection
  openOrders: OpenOrders
  baseCurrency: string
  quoteCurrency: string
  baseTokenAccount: PublicKey
  quoteTokenAccount: PublicKey
}): Promise<[Transaction, Account[]] | null | undefined> {
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

  try {
    const isTokenAccountsValid = await isTokenAccountsForSettleValid({
      wallet,
      connection,
      market,
      baseTokenAccount,
      quoteTokenAccount,
    })
    if (!isTokenAccountsValid) {
      throw new Error('Error checking tokenAccounts validity')
    }
  } catch (e) {
    console.log(
      `[settleFunds] Check validity of tokenAccounts is failed, err: `,
      e
    )
    notify({ message: 'Sorry, validity of tokenAccounts is failed' })
    return
  }

  let createAccountTransaction: Transaction | undefined
  let baseCurrencyAccountPubkey = baseTokenAccount?.pubkey
  let quoteCurrencyAccountPubkey = quoteTokenAccount?.pubkey

  if (!baseCurrencyAccountPubkey) {
    const result = await createTokenAccountTransaction({
      wallet,
      mintPublicKey: market.baseMintAddress,
    })
    baseCurrencyAccountPubkey = result?.newAccountPubkey
    createAccountTransaction = result?.transaction
  }
  if (!quoteCurrencyAccountPubkey) {
    const result = await createTokenAccountTransaction({
      wallet,
      mintPublicKey: market.quoteMintAddress,
    })
    quoteCurrencyAccountPubkey = result?.newAccountPubkey
    createAccountTransaction = result?.transaction
  }

  const referrerQuoteWallet: PublicKey | null = getReferrerQuoteWallet({
    quoteMintAddress: market.quoteMintAddress,
    supportsReferralFees: market.supportsReferralFees,
  })

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

  const transaction = mergeTransactions([
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

  return [transaction, settleFundsSigners]
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
  const result = await getSettleFundsTransaction({
    market,
    openOrders,
    connection,
    wallet,
    baseCurrency,
    quoteCurrency,
    baseTokenAccount,
    quoteTokenAccount,
  })

  if (!result) return

  const [transaction, settleFundsSigners] = result

  return await sendTransaction({
    transaction,
    signers: settleFundsSigners,
    wallet,
    connection,
    operationType: 'settleFunds',
    params: {
      baseSymbol: baseCurrency,
      quoteSymbol: quoteCurrency,
      baseUnsettled,
      quoteUnsettled,
    },
    focusPopup,
  })
}

export async function cancelOrder({
  market,
  wallet,
  connection,
  order,
}: CancelOrderParams) {
  if (!wallet.publicKey) {
    throw new Error(`cancelOrders: no publicKey for wallet: ${wallet}`)
  }
  const { publicKey } = wallet
  const transaction = market.makeMatchOrdersTransaction(5)

  transaction.add(
    market.makeCancelOrderInstruction(connection, publicKey, order)
  )

  transaction.add(market.makeMatchOrdersTransaction(5))

  return sendTransaction({
    transaction,
    wallet,
    connection,
    signers: [],
    params: {
      baseSymbol: order.marketName.split('/')[0],
      quoteSymbol: order.marketName.split('/')[1],
      side: order.side,
      amount: order.size,
      price: order.price,
    },
    operationType: 'cancelOrder',
  })
}

export async function amendOrder(params: AmendOrderParams) {
  const {
    market,
    wallet,
    connection,
    order,
    amendOrder,
    baseCurrencyAccount,
    quoteCurrencyAccount,
    openOrdersAccount,
  } = params
  if (!wallet.publicKey) {
    throw new Error(`Wallet does not have public key: ${wallet}`)
  }
  const transaction = market.makeMatchOrdersTransaction(5)
  transaction.add(
    market.makeCancelOrderInstruction(connection, wallet.publicKey, order)
  )
  const p: PlaceOrder = {
    side: order.side,
    price: amendOrder.price || order.price,
    size: amendOrder.size || order.size,
    pair: order.marketName,
    orderType: 'limit', // TODO: additional check?
    isMarketOrder: false,
    market: order.market,
    wallet,
    connection,
    baseCurrencyAccount,
    quoteCurrencyAccount,
    openOrdersAccount,
  }
  const d = await generatePlacOrderTransactions(p)

  if (!d) {
    return null
  }

  const { transaction: placeTransaction, signers } = d

  const t = mergeTransactions([transaction, placeTransaction])

  return sendTransaction({
    transaction: t,
    wallet,
    connection,
    signers,
    operationType: 'createOrder',
    params: {
      side: p.side,
      price: p.price,
      amount: p.size,
      baseSymbol: p.pair.split('_')[0],
      quoteSymbol: p.pair.split('_')[1],
      orderType: 'limit',
    },
  })
}

const isIncrement = (num: number, step: number) =>
  Math.abs((num / step) % 1) < 1e-5 || Math.abs(((num / step) % 1) - 1) < 1e-5

export const validateVariablesForPlacingOrder = ({
  price,
  size,
  market,
  wallet,
  pair,
}: ValidateOrderParams): boolean => {
  const formattedMinOrderSize =
    market?.minOrderSize?.toFixed(getDecimalCount(market.minOrderSize)) ||
    market?.minOrderSize

  const formattedTickSize =
    market?.tickSize?.toFixed(getDecimalCount(market.tickSize)) ||
    market?.tickSize

  if (pair === 'RIN_USDC' && !isCCAITradingEnabled()) {
    notify({
      message: 'Please, wait until 2pm UTC time before trading CCAI',
      type: 'error',
    })
    return false
  }

  if (Number.isNaN(price)) {
    notify({ message: 'Invalid price', type: 'error' })
    return false
  }
  if (Number.isNaN(size)) {
    notify({ message: 'Invalid size', type: 'error' })
    return false
  }
  if (!wallet || !wallet.publicKey) {
    notify({ message: 'Connect wallet', type: 'error' })
    return false
  }
  if (!market) {
    notify({ message: 'Invalid  market', type: 'error' })
    return false
  }
  if (!isIncrement(size, market.minOrderSize)) {
    notify({
      message: `Size must be an increment of ${formattedMinOrderSize}`,
      type: 'error',
    })
    return false
  }
  if (size < market.minOrderSize) {
    notify({ message: 'Size too small', type: 'error' })
    return false
  }
  if (!isIncrement(price, market.tickSize)) {
    notify({
      message: `Price must be an increment of ${formattedTickSize}`,
      type: 'error',
    })
    return false
  }
  if (price < market.tickSize) {
    notify({ message: 'Price under tick size', type: 'error' })
    return false
  }

  return true
}

const createTokenAccount = async (
  mintPublicKey: PublicKey,
  connection: Connection,
  wallet: WalletAdapter,
  transaction?: Transaction
) => {
  const {
    transaction: createAccountTransaction,
    newAccountPubkey,
  } = await createTokenAccountTransaction({
    wallet,
    mintPublicKey,
  })
  if (transaction) {
    transaction.add(createAccountTransaction)
  }
  return { pubkey: newAccountPubkey }
}

const generatePlacOrderTransactions = async (data: PlaceOrder) => {
  const {
    side,
    price,
    size,
    pair,
    orderType,
    market,
    isMarketOrder,
    connection,
    wallet,
  } = data

  let { baseCurrencyAccount, quoteCurrencyAccount, openOrdersAccount } = data
  console.log('Place order', market?.minOrderSize, size)
  const isValidationSuccessfull = validateVariablesForPlacingOrder({
    price,
    size,
    market,
    wallet,
    pair,
  })

  if (!isValidationSuccessfull) {
    return null
  }

  const owner = wallet.publicKey

  if (!owner) {
    throw new Error(`No owner for wallet: ${wallet}`)
  }

  const openOrdersAccountFromCache = getCache(
    `preCreatedOpenOrdersFor${market?.publicKey}`
  )

  console.log('openOrdersAccount in placeOrder', openOrdersAccount)

  try {
    const isTokenAccountsValid = await isTokenAccountsForSettleValid({
      wallet,
      connection,
      market,
      baseTokenAccount: baseCurrencyAccount,
      quoteTokenAccount: quoteCurrencyAccount,
    })
    if (!isTokenAccountsValid) {
      throw new Error('Error checking tokenAccounts validity')
    }
  } catch (e) {
    console.error(
      `[settleFunds] Check validity of tokenAccounts is failed, err: `,
      e
    )
    notify({ message: 'Sorry, validity of tokenAccounts is failed' })
    return null
  }

  const transaction = new Transaction()
  baseCurrencyAccount =
    baseCurrencyAccount ||
    (await createTokenAccount(
      market.baseMintAddress,
      connection,
      wallet,
      transaction
    ))
  quoteCurrencyAccount =
    quoteCurrencyAccount ||
    (await createTokenAccount(
      market.quoteMintAddress,
      connection,
      wallet,
      transaction
    ))

  const payer =
    side === 'sell' ? baseCurrencyAccount.pubkey : quoteCurrencyAccount.pubkey

  if (!payer) {
    notify({
      message: 'Need an SPL token account for cost currency',
      type: 'error',
    })
    return null
  }

  const params: OrderParams<PublicKey> = {
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

  transaction.add(market.makeMatchOrdersTransaction(5))
  const referrerQuoteWallet: PublicKey | null = getReferrerQuoteWallet({
    quoteMintAddress: market.quoteMintAddress,
    supportsReferralFees: market.supportsReferralFees,
  })

  const {
    transaction: placeOrderTx,
    signers,
    ...rest
  } = await market.makePlaceOrderTransaction(connection, params, 10_000, 10_000)

  console.log('placeOrder placeOrderTx', placeOrderTx)
  console.log('placeOrder rest', rest)

  transaction.add(placeOrderTx)
  transaction.add(market.makeMatchOrdersTransaction(5))

  console.log('placeOrder transaction after add', transaction)

  const baseCurrencyAccountPubkey = baseCurrencyAccount?.pubkey
  const quoteCurrencyAccountPubkey = quoteCurrencyAccount?.pubkey

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

  return { transaction, signers }
}

export async function placeOrder(data: PlaceOrder) {
  const d = await generatePlacOrderTransactions(data)

  if (!d) {
    return null
  }

  const { transaction, signers } = d
  const { wallet, connection } = data

  return sendTransaction({
    transaction,
    wallet,
    connection,
    signers,
    operationType: 'createOrder',
    params: {
      side: data.side,
      price: data.price,
      amount: data.size,
      baseSymbol: data.pair.split('_')[0],
      quoteSymbol: data.pair.split('_')[1],
      orderType: data.isMarketOrder ? 'market' : 'limit',
    },
  })
}

export async function signTransactions({
  transactionsAndSigners,
  wallet,
  connection,
}: SignTransactionsParams) {
  if (!wallet.publicKey) {
    throw new Error(`No key for wallet: ${wallet}`)
  }
  const { publicKey } = wallet
  const { blockhash } = await connection.getRecentBlockhash('max')
  transactionsAndSigners.forEach(({ transaction, signers = [] }) => {
    transaction.recentBlockhash = blockhash
    transaction.setSigners(publicKey, ...signers.map((s) => s.publicKey))
    if (signers?.length > 0) {
      transaction.partialSign(...signers)
    }
  })
  return wallet.signAllTransactions(
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

  async function getVaultOwnerAndNonce(
    nonce = new BN(0)
  ): Promise<[PublicKey, BN]> {
    try {
      const vaultOwner = await PublicKey.createProgramAddress(
        [market.publicKey.toBuffer(), nonce.toArrayLike(Buffer, 'le', 8)],
        dexProgramId
      )
      return [vaultOwner, nonce]
    } catch (e) {
      nonce.iaddn(1)
      return getVaultOwnerAndNonce(nonce)
    }
  }

  const [vaultOwner, vaultSignerNonce] = await getVaultOwnerAndNonce()

  if (!wallet.publicKey) {
    throw new Error(`No publicKey for wallet: ${wallet}`)
  }

  // const fromPubkey = wallet.publicKey

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

  await Promise.all(
    signedTransactions.map((signedTransaction) =>
      sendSignedTransaction({
        transaction: signedTransaction,
        connection,
      })
    )
  )

  return market.publicKey
}

const getUnixTs = () => {
  return new Date().getTime() / 1000
}

const DEFAULT_TIMEOUT = 30000

export async function sendTransaction({
  transaction,
  wallet,
  signers,
  connection,
  sentMessage,
  successMessage,
  timeout,
  operationType,
  params,
  focusPopup,
}: SendTransactionParams): AsyncSendSignedTransactionResult {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash

  console.log('signers', signers, wallet)

  if (!wallet.publicKey) {
    throw new Error(`No publicKey for wallet: ${wallet}`)
  }

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

  const tx = await sendSignedTransaction({
    connection,
    transaction: transactionFromWallet,
    sentMessage,
    successMessage,
    timeout,
    operationType,
    params,
  })

  return tx
}

export const sendSignedTransaction = async ({
  connection,
  transaction,
  sentMessage = 'Transaction sent',
  successMessage = 'Transaction confirmed',
  timeout = DEFAULT_TIMEOUT,
  operationType,
  params,
}: SendSignedTransactionParams): AsyncSendSignedTransactionResult => {
  const rawTransaction = transaction.serialize()

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
    // TODO
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
    connection,
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
      connection,
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
  if (result === null) {
    return 'failed'
  }

  if (result === 'timeout') {
    return result
  }

  if (!operationType) notify({ message: successMessage, type: 'success', txid })
  console.log('Latency', txid, getUnixTs() - startTime)
  return txid
}

export const isTransactionFailed = (result: SendSignedTransactionResult) =>
  result === 'failed' || result === 'timeout'

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

function mergeTransactions(transactions: Maybe<Transaction>[]) {
  const transaction = new Transaction()
  transactions.forEach((t) => {
    if (t) {
      transaction.add(t)
    }
  })
  return transaction
}

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
    throw new Error(`failed to simulate transaction: ${res.error.message}`)
  }
  return res.result
}
