import { BN, ProgramAccount, Provider } from "@project-serum/anchor";
import { createMintInstructions, createTokenAccountInstrs } from "@project-serum/common";
import { TokenInstructions } from "@project-serum/serum";
import { Connection, Keypair, PublicKey, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction, Account } from "@solana/web3.js";
import { ProgramsMultiton } from "../../ProgramsMultiton/ProgramsMultiton";
import { FEE_OWNER_ACCOUNT, POOLS_PROGRAM_ADDRESS, POOL_AUTHORITY, POOLS_V2_PROGRAM_ADDRESS } from "../../ProgramsMultiton/utils";
import { signTransactions } from "../../send";
import { WalletAdapter } from "../../types";
import { createBasketTransaction } from "./createBasket";

interface CreatePoolDeposit {
  baseTokenAmount: BN
  quoteTokenAmount: BN
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
}

interface CreatePoolParams {
  wallet: WalletAdapter
  connection: Connection
  baseTokenMint: string
  quoteTokenMint: string
  firstDeposit?: CreatePoolDeposit
  curveType?: CURVE
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

enum CURVE {
  PRODUCT = 0,
  // STABLE = 1,
}

interface CreatePoolTransactionsResponse {
  createAccounts: Transaction
  setAuthorities: Transaction
  createPool: Transaction
  firstDeposit?: Transaction
}

export const createPoolTransactions = async (params: CreatePoolParams): Promise<CreatePoolTransactionsResponse> => {
  const { wallet, connection, baseTokenMint, quoteTokenMint, firstDeposit, curveType = CURVE.PRODUCT } = params

  if (baseTokenMint === quoteTokenMint) {
    throw new Error('Base token mint should be differ than quote token mint')
  }

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const program2 = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_V2_PROGRAM_ADDRESS,
  })



  const mintBase = new PublicKey(baseTokenMint)
  const mintQuote = new PublicKey(quoteTokenMint)

  const allPools = await program.account.pool.all()
  const allPools2 = await program2.account.pool.all()

  const existingPool = [...allPools, ...allPools2].find((p: ProgramAccount<PoolLike>) =>
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
    program2.programId
  )

  const walletWithPk = walletAdapterToWallet(wallet)


  const creatorPk = walletWithPk.publicKey

  const mintAccounts = new Transaction()
  const setAuthorities = new Transaction()
  const createPoolTx = new Transaction()

  const poolMint = Keypair.generate()
  const baseTokenVault = Keypair.generate()
  const quoteTokenVault = Keypair.generate()
  const baseFeeVault = Keypair.generate()
  const quoteFeeVault = Keypair.generate()
  const poolFeeVault = Keypair.generate()
  const lpTokenFreezeAccount = Keypair.generate()

  const curve = Keypair.generate()
  
  const provider = new Provider(connection, walletWithPk, Provider.defaultOptions())

  mintAccounts.add(...(await createMintInstructions(provider, creatorPk, poolMint.publicKey)))

  mintAccounts.add(...(await createTokenAccountInstrs(provider, baseTokenVault.publicKey, mintBase, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, quoteTokenVault.publicKey, mintQuote, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, baseFeeVault.publicKey, mintBase, creatorPk)))
  mintAccounts.add(...(await createTokenAccountInstrs(provider, quoteFeeVault.publicKey, mintQuote, creatorPk)))
  setAuthorities.add(...(await createTokenAccountInstrs(provider, poolFeeVault.publicKey, poolMint.publicKey, creatorPk)))
  setAuthorities.add(...(await createTokenAccountInstrs(provider, lpTokenFreezeAccount.publicKey, poolMint.publicKey, creatorPk)))


  const feeOwner = new PublicKey(FEE_OWNER_ACCOUNT)

  setAuthorities.add(
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


  const createCurveInstr: TransactionInstruction = await program2.account.productCurve.createInstruction(
    curve
  )

  createPoolTx.add(createCurveInstr)

  const initializeCurveInstr: TransactionInstruction = await program2.instruction.initializeConstProductCurve({
    accounts: {
      curve: curve.publicKey,
      rent: SYSVAR_RENT_PUBKEY,
    },
  })

  createPoolTx.add(initializeCurveInstr)

  program2.rpc.initialize()
  const createPoolInstruction: TransactionInstruction = await program2.instruction.initialize(
    new BN(vaultSignerNonce),
    new BN(curveType),
    {
      accounts: {
        pool: pool.publicKey,
        poolMint: poolMint.publicKey,
        lpTokenFreezeVault: lpTokenFreezeAccount.publicKey,
        baseTokenVault: baseTokenVault.publicKey,
        quoteTokenVault: quoteTokenVault.publicKey,
        poolSigner: vaultSigner,
        initializer: poolInitializer.publicKey,
        // poolAuthority: new PublicKey(POOL_AUTHORITY),
        poolAuthority: wallet.publicKey,
        feeBaseAccount: baseFeeVault.publicKey,
        feeQuoteAccount: quoteFeeVault.publicKey,
        feePoolTokenAccount: poolFeeVault.publicKey,
        curve: curve.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      }
    })


  createPoolTx.add(createPoolInstruction)

  const transactionsAndSigners: { transaction: Transaction, signers: (Keypair | Account)[] }[] = [
    {
      transaction: mintAccounts,
      signers: [
        poolMint,
        baseTokenVault,
        quoteTokenVault,
        baseFeeVault,
        quoteFeeVault,
      ],
    },
    {
      transaction: setAuthorities,
      signers: [
        poolMint,
        poolFeeVault,
        lpTokenFreezeAccount,
      ],
    },
    {
      transaction: createPoolTx,
      signers: [
        poolInitializer,
        curve,
      ],
    }
  ]

  if (firstDeposit) {
    const [transaction, signers] = await createBasketTransaction({
      wallet,
      connection,
      baseTokenMint: mintBase,
      baseTokenVault: baseTokenVault.publicKey,
      quoteTokenMint: mintQuote,
      quoteTokenVault: quoteTokenVault.publicKey,
      poolMint: poolMint.publicKey,
      lpTokenFreezeVault: lpTokenFreezeAccount.publicKey,
      program,
      supply: new BN(0),
      poolTokenAmountA: new BN(0),
      poolPublicKey: pool.publicKey,
      userBaseTokenAccount: firstDeposit.userBaseTokenAccount,
      userQuoteTokenAccount: firstDeposit.userQuoteTokenAccount,
      userBaseTokenAmount: firstDeposit.baseTokenAmount.toNumber(),
      userQuoteTokenAmount: firstDeposit.quoteTokenAmount.toNumber(),
      transferSOLToWrapped: false,
    })

    transactionsAndSigners.push({ transaction, signers })
  }

  const [createAccounts, setAuthoritiesTx, createPool, ...rest] = await signTransactions({
    wallet,
    connection,
    transactionsAndSigners
  })

  return {
    createAccounts,
    setAuthorities: setAuthoritiesTx,
    createPool,
    firstDeposit: rest[0],
  }


}