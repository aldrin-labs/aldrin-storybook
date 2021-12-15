import {TOKEN_PROGRAM_ID} from '@sb/dexUtils/token/token';
import {Connection, PublicKey} from '@solana/web3.js';
import {TokenInstructions} from '@project-serum/serum';
import {WalletAdapter} from '@sb/dexUtils/types';

export const getMintFromWallet = async ({
    wallet,
    connection,
    mint,
}: {
    wallet: WalletAdapter
    connection: Connection
    mint: PublicKey,
}) => {
    let tokenWallet = null;
    const tokenAccounts = connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        programId: TokenInstructions.TOKEN_PROGRAM_ID,
    }).then(resAccounts => {
        tokenWallet = resAccounts.value.find(account => {
            if(account.account.data.parsed.info.mint === mint.toString()) {
                return account.pubkey;
            }
        })
        return tokenWallet;
    }).catch(error => {
        console.log('error')
    });

    return await tokenAccounts;
}
