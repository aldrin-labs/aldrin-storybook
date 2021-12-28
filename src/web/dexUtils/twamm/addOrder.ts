import {
  Connection, PublicKey, SYSVAR_CLOCK_PUBKEY, Transaction,
} from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import {TWAMM_PROGRAM_ADDRESS} from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import {isTransactionFailed, sendTransaction} from '@sb/dexUtils/send';
import BN from "bn.js";
import {checkAccountForMint} from "@sb/dexUtils/twamm/checkAccountForMint";

export const addOrder = async ({
  wallet,
  connection,
  programAddress = TWAMM_PROGRAM_ADDRESS,
  amount,
  timeLength,
  pairSettings,
  mint,
  orders,
  orderArray,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string,
  amount: BN,
  timeLength: BN,
  pairSettings: any,
  mint: PublicKey,
  orders: PublicKey[],
  orderArray: any
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })
  console.log(program)

  const Side = {
    Bid: { bid: {} },
    Ask: { ask: {} },
  };

  let orderArrayFiltered = [];
  orderArray.forEach(order => {
    if(order.side.ask && order.pairSettings.toString() === pairSettings.pubkey.toString()) {
      const notFullOrders = order.orders.filter(order => !order.isInitialized);
      if(notFullOrders.length > 0) {
        orderArrayFiltered.push(order);
      }
    }
  })

  const userTokenAccount = await checkAccountForMint({wallet, connection, mint, create: false});

  const addOrderInstruction = program.instruction.addOrder(Side.Ask, amount, timeLength, {
    accounts: {
      pairSettings: pairSettings.pubkey,
      orders: orderArrayFiltered[0].pubkey,
      userTokenAccount,
      userAuthority: wallet.publicKey,
      twammFromTokenVault: orderArrayFiltered[0].twammFromTokenVault,
      feeAccount: pairSettings.baseTokenFeeAccount,
      pyth: pairSettings.pyth,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY,
    },
  });

  try {
    const tx = await sendTransaction({
      transaction: new Transaction().add(addOrderInstruction),
      wallet,
      signers: [],
      connection,
      focusPopup: true,
    });

    if (!isTransactionFailed(tx)) {
      return 'success'
    }
  } catch (e) {
    console.log('add order catch error', e)
    if (e.message.includes('cancelled')) {
      return 'cancelled'
    }
  }

  return 'failed';
}
