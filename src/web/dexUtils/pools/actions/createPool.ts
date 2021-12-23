import { BN, ProgramAccount, Provider } from '@project-serum/anchor'
import {
  createMintInstructions,
  createTokenAccountInstrs,
} from '@project-serum/common'
import { TokenInstructions } from '@project-serum/serum'
import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  Signer,
} from '@solana/web3.js'

import { walletAdapterToWallet } from '../../common'
import { ProgramsMultiton } from '../../ProgramsMultiton/ProgramsMultiton'
import {
  FEE_OWNER_ACCOUNT,
  POOLS_PROGRAM_ADDRESS,
  POOL_AUTHORITY,
  POOLS_V2_PROGRAM_ADDRESS,
} from '../../ProgramsMultiton/utils'
import { signTransactions, createTokenAccountTransaction } from '../../send'
import { createVestingTransaction } from '../../vesting'
import {
  AUTHORITY_TYPE,
  CreatePoolParams,
  CreatePoolTransactionsResponse,
  CURVE,
  PoolLike,
} from '../types'
import { createBasketTransaction } from './createBasket'
import { initializeFarmingInstructions } from './initializeFarming'

export const createPoolTransactions = async (
  params: CreatePoolParams
): Promise<CreatePoolTransactionsResponse> => {
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

  const existingPool = [...allPools, ...allPools2].find(
    (p: ProgramAccount<PoolLike>) =>
      (p.account.baseTokenMint.equals(baseTokenMint) &&
        p.account.quoteTokenMint.equals(quoteTokenMint)) ||
      (p.account.baseTokenMint.equals(quoteTokenMint) &&
        p.account.quoteTokenMint.equals(baseTokenMint))
  )

  if (existingPool) {
    throw new Error('Pool already exists')
  }

  const poolMint = Keypair.generate() // Pool mint
  const baseTokenVault = Keypair.generate() // Pool base tokens vault
  const quoteTokenVault = Keypair.generate() // Pool quote tokens vault
  const baseFeeVault = Keypair.generate() // Pool fees (base token) vault
  const quoteFeeVault = Keypair.generate() // Pool fees (quote token) vaule
  const poolFeeVault = Keypair.generate() // Pool fees (lp token) vault
  const lpTokenFreezeAccount = Keypair.generate() // LP tokens farming vault

  const curve = Keypair.generate() // Curve (product/stable) account

  const pool = Keypair.generate() // Pool account

  const [vaultSigner, vaultSignerNonce] = await PublicKey.findProgramAddress(
    [pool.publicKey.toBuffer()],
    program2.programId
  )

  const walletWithPk = walletAdapterToWallet(wallet)

  const feeOwner = new PublicKey(FEE_OWNER_ACCOUNT)

  const creatorPk = walletWithPk.publicKey

  const provider = new Provider(
    connection.getConnection(),
    walletWithPk,
    Provider.defaultOptions()
  )

  const tokenAccountLamports = await connection
    .getConnection()
    .getMinimumBalanceForRentExemption(165)

  const mintAccounts = new Transaction()
    .add(
      ...(await createMintInstructions(provider, creatorPk, poolMint.publicKey))
    )
    .add(
      ...(await createTokenAccountInstrs(
        provider,
        baseTokenVault.publicKey,
        baseTokenMint,
        vaultSigner,
        tokenAccountLamports
      ))
    )
    .add(
      ...(await createTokenAccountInstrs(
        provider,
        quoteTokenVault.publicKey,
        quoteTokenMint,
        vaultSigner,
        tokenAccountLamports
      ))
    )
    .add(
      ...(await createTokenAccountInstrs(
        provider,
        baseFeeVault.publicKey,
        baseTokenMint,
        feeOwner,
        tokenAccountLamports
      ))
    )
    .add(
      ...(await createTokenAccountInstrs(
        provider,
        quoteFeeVault.publicKey,
        quoteTokenMint,
        feeOwner,
        tokenAccountLamports
      ))
    )

  const setAuthorities = new Transaction()
    .add(await program2.account.pool.createInstruction(pool))
    .add(
      ...(await createTokenAccountInstrs(
        provider,
        poolFeeVault.publicKey,
        poolMint.publicKey,
        creatorPk,
        tokenAccountLamports
      ))
    )
    .add(
      ...(await createTokenAccountInstrs(
        provider,
        lpTokenFreezeAccount.publicKey,
        poolMint.publicKey,
        vaultSigner,
        tokenAccountLamports
      ))
    )
    .add(
      TokenInstructions.setAuthority({
        target: poolMint.publicKey,
        currentAuthority: creatorPk,
        newAuthority: vaultSigner,
        authorityType: AUTHORITY_TYPE.MINT,
      })
    )
    .add(
      TokenInstructions.setAuthority({
        target: poolFeeVault.publicKey,
        authorityType: AUTHORITY_TYPE.CLOSE,
        currentAuthority: creatorPk,
        newAuthority: vaultSigner,
      })
    )
    .add(
      TokenInstructions.setAuthority({
        target: poolFeeVault.publicKey,
        authorityType: AUTHORITY_TYPE.OWNER,
        currentAuthority: creatorPk,
        newAuthority: feeOwner,
      })
    )

  const createPoolTx = new Transaction()

  if (curveType === CURVE.PRODUCT) {
    createPoolTx
      .add(await program2.account.productCurve.createInstruction(curve))
      .add(
        await program2.instruction.initializeConstProductCurve({
          accounts: {
            curve: curve.publicKey,
            rent: SYSVAR_RENT_PUBKEY,
          },
        })
      )
  } else if (curveType === CURVE.STABLE) {
    createPoolTx
      .add(await program2.account.stableCurve.createInstruction(curve))
      .add(
        await program2.instruction.initializeStableCurve(
          new BN(85), // Don't ask why
          {
            accounts: {
              curve: curve.publicKey,
              rent: SYSVAR_RENT_PUBKEY,
            },
          }
        )
      )
  }

  const createPoolInstruction: TransactionInstruction =
    await program2.instruction.initialize(
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
        },
      }
    )

  createPoolTx.add(createPoolInstruction)

  const transactionsAndSigners: {
    transaction: Transaction
    signers?: Signer[]
  }[] = [
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
      signers: [poolMint, poolFeeVault, lpTokenFreezeAccount, pool],
    },
    {
      transaction: createPoolTx,
      signers: [curve],
    },
  ]

  const { transaction: depositTx, newAccountPubkey: poolTokenAccount } =
    await createTokenAccountTransaction({
      wallet,
      mintPublicKey: poolMint.publicKey,
    })

  const depositSigniers: Signer[] = []

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
    userPoolTokenAccount: poolTokenAccount,
    transferSOLToWrapped: true,
  })

  depositTx.add(transaction)

  depositSigniers.push(...signers)

  if (firstDeposit.vestingPeriod) {
    const [vestingTx, vestingSigners] = await createVestingTransaction({
      vestingPeriod: firstDeposit.vestingPeriod,
      wallet,
      connection,
      depositAmount: new BN(1 * 10 ** 8), // Alway 10**8 for first deposit - lock all
      depositorAccount: poolTokenAccount,
      tokenMint: poolMint.publicKey,
    })

    depositTx.add(vestingTx)

    depositSigniers.push(...vestingSigners)
  }

  transactionsAndSigners.push({
    transaction: depositTx,
    signers: depositSigniers,
  })

  if (farming) {
    const [farmingTx, farmingSigners] = await initializeFarmingInstructions({
      ...farming,
      connection: connection.getConnection(),
      wallet,
      pool: pool.publicKey,
      accountLamports: tokenAccountLamports,
    })
    transactionsAndSigners.push({
      transaction: farmingTx,
      signers: farmingSigners,
    })
  }

  const [
    createAccounts,
    setAuthoritiesTx,
    createPool,
    firstDepositTx,
    farmingTx,
  ] = await signTransactions({
    transactionsAndSigners,
    wallet,
    connection: connection.getConnection(),
  })

  return {
    transactions: {
      createAccounts,
      setAuthorities: setAuthoritiesTx,
      createPool,
      firstDeposit: firstDepositTx,
      farming: farmingTx,
    },
    pool: pool.publicKey,
  }
}
