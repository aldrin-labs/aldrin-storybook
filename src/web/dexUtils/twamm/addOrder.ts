import {
  Connection, PublicKey, SYSVAR_CLOCK_PUBKEY, Transaction,
} from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import {TWAMM_PROGRAM_ADDRESS} from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import {sendTransaction} from '@sb/dexUtils/send';
import BN from "bn.js";
import {checkAccountForMint} from "@sb/dexUtils/twamm/checkAccountForMint";

export const addOrder = async ({
  wallet,
  connection,
  programAddress = TWAMM_PROGRAM_ADDRESS,
  amount
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string,
  amount: BN,
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  console.log(program)

  const userTokenAccount = await checkAccountForMint({wallet, connection, mint: '', create: false});

  const addOrderInstruction = program.instruction.addOrder('', amount, '', {
    accounts: {
      pairSettings: '',
      orders: '',
      userTokenAccount,
      userAuthority: '',
      twammFromTokenVault: '',
      feeAccount: '',
      pyth: '',
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY,
    },
  });

  return await sendTransaction({
    transaction: new Transaction().add(addOrderInstruction),
    wallet,
    signers: [],
    connection,
    focusPopup: true,
  });
}
