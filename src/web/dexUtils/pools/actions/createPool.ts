import { BN, ProgramAccount, Provider } from "@project-serum/anchor";
import { createMintInstructions, createTokenAccountInstrs } from "@project-serum/common";
import { TokenInstructions } from "@project-serum/serum";
import { Connection, Keypair, PublicKey, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction, Account } from "@solana/web3.js";
import { ProgramsMultiton } from "../../ProgramsMultiton/ProgramsMultiton";
import { FEE_OWNER_ACCOUNT, POOLS_PROGRAM_ADDRESS, POOL_AUTHORITY, POOLS_V2_PROGRAM_ADDRESS } from "../../ProgramsMultiton/utils";
import { signTransactions } from "../../send";
import { WalletAdapter } from "../../types";
import { createBasketTransaction } from "./createBasket";
import { InitializeFarmingBase, initializeFarmingInstructions } from "./initializeFarming";
import MultiEndpointsConnection from "../../MultiEndpointsConnection";
import { WRAPPED_SOL_MINT } from "@project-serum/serum/lib/token-instructions";
import { createSOLAccountAndClose } from "../../pools";

interface CreatePoolDeposit {
  baseTokenAmount: BN
  quoteTokenAmount: BN
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
}

interface CreatePoolParams {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  baseTokenMint: PublicKey
  quoteTokenMint: PublicKey
  firstDeposit: CreatePoolDeposit
  curveType?: CURVE
  farming?: InitializeFarmingBase
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


export const walletAdapterToWallet = (w: WalletAdapter): WalletLike => {
  const { publicKey } = w
  if (!publicKey) {
    throw new Error('Could not create Wallet from adapter: PublicKey is not defined')
  }
  return { ...w, publicKey }
}

export enum CURVE {
  PRODUCT = 0,
  STABLE = 1,
}

interface CreatePoolTransactionsResponse {
  createAccounts: Transaction
  setAuthorities: Transaction
  createPool: Transaction
  firstDeposit: Transaction
  farming?: Transaction
}

interface TransactionAndSign {
  transaction: Transaction
  signers: (Keypair | Account)[]
}


const mintSpace = 82
const accountSpace = 165

export const createPoolTransactions = async (params: CreatePoolParams): Promise<CreatePoolTransactionsResponse> => {
  const {
    wallet,
    connection,
    baseTokenMint,
    quoteTokenMint,
    firstDeposit,
    curveType = CURVE.PRODUCT,
    farming,
  } = params

  if (baseTokenMint.equals(quoteTokenMint)) {
    throw new Error('Base token mint should be differ than quote token mint')
  }

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection: connection.getConnection(),
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const program2 = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection: connection.getConnection(),
    programAddress: POOLS_V2_PROGRAM_ADDRESS,
  })

  const allPools = await program.account.pool.all()
  const allPools2 = await program2.account.pool.all()

  const existingPool = [...allPools, ...allPools2].find((p: ProgramAccount<PoolLike>) =>
    (p.account.baseTokenMint.equals(baseTokenMint) && p.account.quoteTokenMint.equals(quoteTokenMint)) ||
    (p.account.baseTokenMint.equals(quoteTokenMint) && p.account.quoteTokenMint.equals(baseTokenMint))
  )

  if (existingPool) {
    throw new Error('Pool already exists')
  }
  const pool = Keypair.generate()

  const [vaultSigner, vaultSignerNonce] = await PublicKey.findProgramAddress(
    [pool.publicKey.toBuffer()],
    program2.programId
  )

  const walletWithPk = walletAdapterToWallet(wallet)

  const feeOwner = new PublicKey(FEE_OWNER_ACCOUNT)


  const creatorPk = walletWithPk.publicKey

  const poolMint = Keypair.generate()
  const baseTokenVault = Keypair.generate()
  const quoteTokenVault = Keypair.generate()
  const baseFeeVault = Keypair.generate()
  const quoteFeeVault = Keypair.generate()
  const poolFeeVault = Keypair.generate()
  const lpTokenFreezeAccount = Keypair.generate()

  const curve = Keypair.generate()

  const provider = new Provider(connection.getConnection(), walletWithPk, Provider.defaultOptions())


  const mintAccounts = new Transaction()
    .add(...(await createMintInstructions(provider, creatorPk, poolMint.publicKey)))
    .add(...(await createTokenAccountInstrs(provider, baseTokenVault.publicKey, baseTokenMint, vaultSigner)))
    .add(...(await createTokenAccountInstrs(provider, quoteTokenVault.publicKey, quoteTokenMint, vaultSigner)))
    .add(...(await createTokenAccountInstrs(provider, baseFeeVault.publicKey, baseTokenMint, feeOwner)))
    .add(...(await createTokenAccountInstrs(provider, quoteFeeVault.publicKey, quoteTokenMint, feeOwner)))

  const setAuthorities = new Transaction()
    .add(await program2.account.pool.createInstruction(pool))
    .add(...(await createTokenAccountInstrs(provider, poolFeeVault.publicKey, poolMint.publicKey, creatorPk)))
    .add(...(await createTokenAccountInstrs(provider, lpTokenFreezeAccount.publicKey, poolMint.publicKey, vaultSigner)))
    .add(
      TokenInstructions.setAuthority({
        target: poolMint.publicKey,
        currentAuthority: creatorPk,
        newAuthority: vaultSigner,
        authorityType: AuthorityType.Mint,
      })
    )
    .add(
      TokenInstructions.setAuthority({
        target: poolFeeVault.publicKey,
        authorityType: AuthorityType.Close,
        currentAuthority: creatorPk,
        newAuthority: vaultSigner,
      })
    )
    .add(
      TokenInstructions.setAuthority({
        target: poolFeeVault.publicKey,
        authorityType: AuthorityType.Owner,
        currentAuthority: creatorPk,
        newAuthority: feeOwner,
      })
    )


  const createPoolTx = new Transaction()


  if (curveType === CURVE.PRODUCT) {
    createPoolTx.add(await program2.account.productCurve.createInstruction(curve))
  }
  if (curveType === CURVE.STABLE) {
    createPoolTx.add(await program2.account.stableCurve.createInstruction(curve))
  }

  const initializeCurveInstr: TransactionInstruction = curveType === CURVE.PRODUCT ?
    await program2.instruction.initializeConstProductCurve({
      accounts: {
        curve: curve.publicKey,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }) :
    await program2.instruction.initializeStableCurve(
      new BN(85), // Don't ask why
      {
        accounts: {
          curve: curve.publicKey,
          rent: SYSVAR_RENT_PUBKEY,
        },
      }
    )

  createPoolTx.add(initializeCurveInstr)

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
        initializer: wallet.publicKey,
        poolAuthority: new PublicKey(POOL_AUTHORITY),
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
        pool,
      ],
    },
    {
      transaction: createPoolTx,
      signers: [
        curve,
      ],
    }
  ]

  const [transaction, signers] = await createBasketTransaction({
    wallet,
    connection: connection.getConnection(),
    baseTokenMint,
    baseTokenVault: baseTokenVault.publicKey,
    quoteTokenMint,
    quoteTokenVault: quoteTokenVault.publicKey,
    poolMint: poolMint.publicKey,
    lpTokenFreezeVault: lpTokenFreezeAccount.publicKey,
    program: program2,
    supply: new BN(0),
    poolTokenAmountA: new BN(0),
    poolPublicKey: pool.publicKey,
    userBaseTokenAccount: firstDeposit.userBaseTokenAccount,
    userQuoteTokenAccount: firstDeposit.userQuoteTokenAccount,
    userBaseTokenAmount: firstDeposit.baseTokenAmount,
    userQuoteTokenAmount: firstDeposit.quoteTokenAmount,
    transferSOLToWrapped: true,
  })

  transactionsAndSigners.push({
    transaction, signers,
  })

  if (farming) {
    const [farmingTx, farmingSigners] = await initializeFarmingInstructions({
      ...farming,
      connection: connection.getConnection(),
      wallet,
      pool: pool.publicKey,
    })
    transactionsAndSigners.push({ transaction: farmingTx, signers: farmingSigners })
  }



  const [createAccounts, setAuthoritiesTx, createPool, firstDepositTx, farmingTx] = await signTransactions({
    transactionsAndSigners,
    wallet,
    connection: connection.getConnection(),
  })

  return {
    createAccounts,
    setAuthorities: setAuthoritiesTx,
    createPool,
    firstDeposit: firstDepositTx,
    farming: farmingTx,
  }

}