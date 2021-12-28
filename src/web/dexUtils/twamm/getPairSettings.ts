import {Connection, PublicKey} from '@solana/web3.js';
import {TokenInfo, WalletAdapter} from '@sb/dexUtils/types';
import {loadAccountsFromProgram} from "@sb/dexUtils/common/loadAccountsFromProgram";
import {TWAMM_PROGRAM_ADDRESS} from "@sb/dexUtils/ProgramsMultiton/utils";
import {ProgramsMultiton} from "@sb/dexUtils/ProgramsMultiton/ProgramsMultiton";
import {Program, Provider} from "@project-serum/anchor";
import {walletAdapterToWallet} from "@sb/dexUtils/common";
import TwammProgramIdl from '@core/idls/twamm.json'

export const getPairSettings = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}) => {
  const programId = new PublicKey(TWAMM_PROGRAM_ADDRESS);

  const program = new Program(
    TwammProgramIdl,
    programId,
    new Provider(
      connection,
      wallet,
      Provider.defaultOptions()
    )
  );

  const config = {
    filters: [
      {dataSize: program.account.pairSettings.size},
    ],
  };

  const pairSettingsAccount = loadAccountsFromProgram({
    connection,
    filters: config.filters,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  });

  let allData = [];

  await pairSettingsAccount.then(resPairSettings => {
    allData = resPairSettings.map((item) => {
      const data = Buffer.from(item.account.data)
      const dataDecoded = program.coder.accounts.decode(
        'PairSettings',
        data
      )
      return {...dataDecoded, pubkey: item.pubkey};
    })
  })

  return await allData;
}
