import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { isTransactionFailed } from '@sb/dexUtils/send'
import { TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { initializeOrderArray } from '@sb/dexUtils/twamm/initializeOrderArray'

import {
  ProgramsMultiton,
  TWAMM_PROGRAM_ADDRESS,
  transferSOLToWrappedAccountAndClose,
} from '@core/solana'

import { signAndSendSingleTransaction } from '../transactions'
import { TokenInfo, WalletAdapter } from '../types'
import { WRAPPED_SOL_MINT } from '../wallet'
import { PairSettings } from './types'

export const addOrder = async ({
  wallet,
  connection,
  programAddress = TWAMM_PROGRAM_ADDRESS,
  amount,
  timeLength,
  pairSettings,
  mintFrom,
  mintTo,
  orderArray,
  side,
  allTokensData,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string
  amount: BN
  timeLength: BN
  pairSettings: PairSettings
  mintFrom: PublicKey
  mintTo: PublicKey
  orders: PublicKey[]
  orderArray: any
  side: string | null
  allTokensData: TokenInfo[]
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  })

  const Side = {
    Bid: { bid: {} },
    Ask: { ask: {} },
  }

  const isAsksSide = side === 'ask'
  const sideSelected = side === 'ask' ? Side.Ask : Side.Bid

  const orderArrayFiltered = []
  orderArray.forEach((order) => {
    if (
      order.side[side] &&
      order.pairSettings.toString() === pairSettings.publicKey
    ) {
      const notFullOrders = order.orders.filter((order) => !order.isInitialized)
      if (notFullOrders.length > 0) {
        orderArrayFiltered.push(order)
      }
    }
  })

  const transaction = new Transaction()

  let newTwammFromTokenVault = null
  if (orderArrayFiltered.length === 0) {
    try {
      const newOrderArray = await initializeOrderArray({
        wallet,
        connection,
        pairSettings,
        mintFrom,
        mintTo,
        side: sideSelected,
        sideText: side,
      })

      orderArrayFiltered.push(newOrderArray?.orderArray)
      newTwammFromTokenVault = newOrderArray?.tokenAccountFrom
    } catch (e) {
      return 'failed'
    }
  }

  const transactionAfter = new Transaction()

  const commonTransaction = new Transaction()
  const commonSigners = []

  const userToken = allTokensData.find(
    (v) => v.mint === mintFrom.toString()
  )?.address
  let userTokenAccount: string | undefined

  if (userToken) {
    userTokenAccount = userToken
  }
  // if SOL - create new token address
  if (
    new PublicKey(pairSettings.baseTokenMint).equals(WRAPPED_SOL_MINT) &&
    isAsksSide
  ) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: amount.toNumber(),
    })

    const [
      wrappedAccount,
      createWrappedAccountTransaction,
      closeAccountTransaction,
    ] = result

    // change account to use from native to wrapped
    userTokenAccount = wrappedAccount.publicKey
    commonTransaction.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfter.add(closeAccountTransaction)
  } else if (
    new PublicKey(pairSettings.quoteTokenMint).equals(WRAPPED_SOL_MINT) &&
    !isAsksSide
  ) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: amount.toNumber(),
    })

    const [
      wrappedAccount,
      createWrappedAccountTransaction,
      closeAccountTransaction,
    ] = result

    // change account to use from native to wrapped
    userTokenAccount = wrappedAccount.publicKey
    commonTransaction.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfter.add(closeAccountTransaction)
  }

  if (!userTokenAccount) {
    throw new Error('No user token account!')
  }

  console.log('userAuthority: ', wallet.publicKey?.toString())
  const addOrderInstruction = await program.instruction.addOrder(
    sideSelected,
    amount,
    timeLength,
    {
      accounts: {
        pairSettings: pairSettings.publicKey,
        orders: orderArrayFiltered[0].pubkey || orderArrayFiltered[0].publicKey,
        userTokenAccount,
        userAuthority: wallet.publicKey,
        twammFromTokenVault:
          newTwammFromTokenVault || orderArrayFiltered[0].twammFromTokenVault,
        feeAccount:
          side === 'ask'
            ? pairSettings.baseTokenFeeAccount
            : side === 'bid'
            ? pairSettings.quoteTokenFeeAccount
            : null,
        pyth: pairSettings.pyth,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    }
  )

  commonTransaction.add(addOrderInstruction)

  try {
    const tx = await signAndSendSingleTransaction({
      transaction: transaction.add(commonTransaction, transactionAfter),
      wallet,
      signers: commonSigners,
      connection,
      focusPopup: true,
    })

    if (!isTransactionFailed(tx) && tx !== 'rejected') {
      return 'success'
    }
  } catch (e) {
    console.log('add order catch error', e)
    if (e.message.includes('cancelled')) {
      return 'cancelled'
    }
  }

  return 'failed'
}
