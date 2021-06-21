import { sendTransaction } from '../../send'
import type {
  Account,
  Connection,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import { WalletAdapter } from '@sb/dexUtils/types';

export function sendAndConfirmTransactionViaWallet(
  wallet: WalletAdapter,
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<Account>
): Promise<TransactionSignature> {
  return sendTransaction({ connection, transaction, signers, wallet });
}