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
import {initializeOrderArray} from "@sb/dexUtils/twamm/initializeOrderArray";

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
  programAddress?: string,
  amount: BN,
  timeLength: BN,
  pairSettings: any,
  mintFrom: PublicKey,
  mintTo: PublicKey,
  orders: PublicKey[],
  orderArray: any,
  side: string | null
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

  const sideSelected = side === 'ask' ? Side.Ask : side === 'bid' ? Side.Bid : null;

  let orderArrayFiltered = [];
  orderArray.forEach(order => {
    if(order.side[side] && order.pairSettings.toString() === pairSettings.pubkey.toString()) {
      const notFullOrders = order.orders.filter(order => !order.isInitialized);
      if(notFullOrders.length > 0) {
        orderArrayFiltered.push(order);
      }
    }
  })

  const transaction = new Transaction();
  console.log('before initialize order array', orderArrayFiltered)
  let newTwammFromTokenVault = null;
  if(orderArrayFiltered.length === 0) {
    const newOrderArray = await initializeOrderArray({
      wallet,
      connection,
      pairSettings,
      mintFrom,
      mintTo,
      side: sideSelected,
    });
    orderArrayFiltered.push(newOrderArray?.orderArray);
    newTwammFromTokenVault = newOrderArray?.tokenAccountFrom;
  }

  console.log('after initialize order array', orderArrayFiltered, sideSelected)

  const userTokenAccount = await checkAccountForMint({wallet, connection, mint: mintFrom, create: false});

  const addOrderInstruction = program.instruction.addOrder(sideSelected, amount, timeLength, {
    accounts: {
      pairSettings: pairSettings.pubkey,
      orders: orderArrayFiltered[0].pubkey || orderArrayFiltered[0].publicKey,
      userTokenAccount,
      userAuthority: wallet.publicKey,
      twammFromTokenVault: newTwammFromTokenVault || orderArrayFiltered[0].twammFromTokenVault,
      feeAccount: side === 'ask' ? pairSettings.baseTokenFeeAccount : side === 'bid' ? pairSettings.quoteTokenFeeAccount : null,
      pyth: pairSettings.pyth,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY,
    },
  });

  try {
    const tx = await signAndSendSingleTransaction({
      transaction: transaction.add(addOrderInstruction),
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
