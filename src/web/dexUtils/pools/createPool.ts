import { BN, ProgramAccount, Provider } from "@project-serum/anchor";
import { createMintInstructions, createTokenAccountInstrs } from "@project-serum/common";
import { TokenInstructions } from "@project-serum/serum";
import { Connection, Keypair, PublicKey, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import { isCancelledTransactionError } from "../common/isCancelledTransactionError";
import { ProgramsMultiton } from "../ProgramsMultiton/ProgramsMultiton";
import { FEE_OWNER_ACCOUNT, POOLS_PROGRAM_ADDRESS, POOL_AUTHORITY } from "../ProgramsMultiton/utils";
import { signTransactions } from "../send";
import { WalletAdapter } from "../types";

interface CreatePoolParams {
  wallet: WalletAdapter
  connection: Connection
  baseTokenMint: string
  quoteTokenMint: string
}

interface PoolLike {
  baseTokenMint: PublicKey
  quoteTokenMint: PublicKey
}

interface WalletLike {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}


const AuthorityType = {
  Mint: 0,
  Freeze: 1,
  Owner: 2,
  Close: 3,
}


const walletAdapterToWallet = (w: WalletAdapter): WalletLike => {
  const { publicKey } = w
  if (!publicKey) {
    throw new Error('Could not create Wallet from adapter: PublicKey is not defined')
  }
  return { ...w, publicKey }
}

export const createPool = async (params: CreatePoolParams) => {
  const { wallet, connection, baseTokenMint, quoteTokenMint } = params

  if (baseTokenMint === quoteTokenMint) {
    throw new Error('Base token mint should be differ than quote token mint')
  }

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })


  const mintBase = new PublicKey(baseTokenMint)
  const mintQuote = new PublicKey(quoteTokenMint)

  const allPools = await program.account.pool.all()

  const existingPool = allPools.find((p: ProgramAccount<PoolLike>) =>
    (p.account.baseTokenMint.equals(mintBase) && p.account.quoteTokenMint.equals(mintQuote)) ||
    (p.account.baseTokenMint.equals(mintQuote) && p.account.quoteTokenMint.equals(mintBase))
  )

  if (existingPool) {
    throw new Error('Pool already exists')
  }
  const pool = Keypair.generate()
  const poolInitializer = Keypair.generate()


  const [vaultSigner, vaultSignerNonce] = await PublicKey.findProgramAddress(
    [pool.publicKey.toBuffer()],
    program.programId
  )

  const walletWithPk = walletAdapterToWallet(wallet)


  const creatorPk = walletWithPk.publicKey


  const mintAccounts = new Transaction()

  // const poolMint = Keypair.generate()
  const poolMint = Keypair.generate()
  const baseTokenVault = Keypair.generate()
  const quoteTokenVault = Keypair.generate()
  const baseFeeVault = Keypair.generate()
  const quoteFeeVault = Keypair.generate()
  const poolFeeVault = Keypair.generate()
  const lpTokenFreezeAccount = Keypair.generate()

  const provider = new Provider(connection, walletWithPk, Provider.defaultOptions())

  mintAccounts.add(...(await createMintInstructions(provider, creatorPk, poolMint.publicKey)))

  mintAccounts.add(...(await createTokenAccountInstrs(provider, baseTokenVault.publicKey, mintBase, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, quoteTokenVault.publicKey, mintQuote, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, baseFeeVault.publicKey, mintBase, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, quoteFeeVault.publicKey, mintQuote, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, poolFeeVault.publicKey, poolMint.publicKey, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, lpTokenFreezeAccount.publicKey, poolMint.publicKey, creatorPk)))


  const feeOwner = new PublicKey(FEE_OWNER_ACCOUNT)

  const setAuthorities = new Transaction().add(
    TokenInstructions.setAuthority({
      target: poolMint.publicKey,
      currentAuthority: creatorPk,
      newAuthority: vaultSigner,
      authorityType: AuthorityType.Mint,
    }),
    TokenInstructions.setAuthority({
      target: baseFeeVault.publicKey,
      authorityType: AuthorityType.Close,
      currentAuthority: creatorPk,
      newAuthority: vaultSigner,
    }),
    TokenInstructions.setAuthority({
      target: quoteFeeVault.publicKey,
      authorityType: AuthorityType.Close,
      currentAuthority: creatorPk,
      newAuthority: vaultSigner,
    }),
    TokenInstructions.setAuthority({
      target: poolFeeVault.publicKey,
      authorityType: AuthorityType.Close,
      currentAuthority: creatorPk,
      newAuthority: vaultSigner,
    }),
    TokenInstructions.setAuthority({
      target: baseFeeVault.publicKey,
      authorityType: AuthorityType.Owner,
      currentAuthority: creatorPk,
      newAuthority: feeOwner,
    }),
    TokenInstructions.setAuthority({
      target: quoteFeeVault.publicKey,
      authorityType: AuthorityType.Owner,
      currentAuthority: creatorPk,
      newAuthority: feeOwner,
    }),
    TokenInstructions.setAuthority({
      target: poolFeeVault.publicKey,
      authorityType: AuthorityType.Owner,
      currentAuthority: creatorPk,
      newAuthority: feeOwner,
    })
  )

  const createPoolTx: TransactionInstruction = await program.instruction.initialize(
    new BN(vaultSignerNonce), {
    accounts: {
      pool: pool.publicKey,
      poolMint: poolMint.publicKey,
      lpTokenFreezeVault: lpTokenFreezeAccount.publicKey,
      baseTokenVault: baseTokenVault.publicKey,
      baseTokenMint: mintBase,
      quoteTokenVault: quoteTokenVault.publicKey,
      quoteTokenMint: mintQuote,
      poolSigner: vaultSigner,
      initializer: poolInitializer.publicKey,
      poolAuthority: new PublicKey(POOL_AUTHORITY),
      feeBaseAccount: baseFeeVault.publicKey,
      feeQuoteAccount: quoteFeeVault.publicKey,
      feePoolTokenAccount: poolFeeVault.publicKey,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    },
  })

  setAuthorities.add(createPoolTx)

  // console.log('createPoolTx: ', createPoolTx)

  try {
    const signedTransactions = await signTransactions({
      wallet,
      connection,
      transactionsAndSigners: [
        {
          transaction: mintAccounts, signers: [
            poolMint,
            baseTokenVault,
            quoteTokenVault,
            baseFeeVault,
            quoteFeeVault,
            poolFeeVault,
            lpTokenFreezeAccount,
          ]
        },
        { transaction: setAuthorities, signers: [poolInitializer] },
      ]
    })

    console.log('signedTransactions: ', signedTransactions)

  } catch (e) {
    console.log('Pool creation error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
  }
}