import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { isTransactionFailed } from '@sb/dexUtils/send'
import { TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { checkAccountForMint } from '@sb/dexUtils/twamm/checkAccountForMint'
import { initializeOrderArray } from '@sb/dexUtils/twamm/initializeOrderArray'

import { transferSOLToWrappedAccountAndClose } from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { signAndSendSingleTransaction } from '../transactions'
import { WalletAdapter } from '../types'
import { WRAPPED_SOL_MINT } from '../wallet'
import { PairSettings } from './types'
import { Program, Provider } from '@project-serum/anchor'
import TwammProgramIdl from '@core/idls/twamm.json'

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
}) => {
  const programId = new PublicKey(TWAMM_PROGRAM_ADDRESS)

  const program = new Program(
    TwammProgramIdl,
    programId,
    new Provider(connection, wallet, Provider.defaultOptions())
  )

  console.log(program)

  const Side = {
    Bid: { bid: {} },
    Ask: { ask: {} },
  }

  const isAsksSide = side === 'ask'
  const sideSelected = side === 'ask' ? Side.Ask : Side.Bid

  const orderArrayFiltered = []
  orderArray.forEach((order) => {
    console.log({
      order,
      pairSettings,
    })
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

  let userTokenAccount = await checkAccountForMint({
    wallet,
    connection,
    mint: mintFrom,
    create: false,
  })

  const transactionAfter = new Transaction()

  const commonTransaction = new Transaction()
  const commonSigners = []

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

  const addOrderInstruction = await program.instruction.addOrder(
    sideSelected,
    amount,
    timeLength,
    {
      accounts: {
        pairSettings: new PublicKey(pairSettings.publicKey),
        orders: orderArrayFiltered[0].pubkey || orderArrayFiltered[0].publicKey,
        userTokenAccount,
        userAuthority: wallet.publicKey,
        twammFromTokenVault:
          newTwammFromTokenVault || orderArrayFiltered[0].twammFromTokenVault,
        feeAccount:
          side === 'ask'
            ? new PublicKey(pairSettings.baseTokenFeeAccount)
            : side === 'bid'
            ? new PublicKey(pairSettings.quoteTokenFeeAccount)
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

    if (!isTransactionFailed(tx)) {
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
