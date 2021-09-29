import * as anchor from '@project-serum/anchor'
import BN from 'bn.js'
import { TokenInstructions, OpenOrders, Market } from '@project-serum/serum'
import {
  NodeWallet,
  createTokenAccount,
  simulateTransaction,
  createMint,
  sleep,
  getTokenAccount,
  parseTokenAccount,
} from '@project-serum/common'
import { i64, Layout, struct, vec } from '@project-serum/borsh'
import {
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  PublicKey,
  Keypair,
  Transaction,
  Connection,
  Account,
} from '@solana/web3.js'
import { getMintDecimals } from '@project-serum/serum/lib/market'
import * as assert from 'assert'
import { WalletAdapter } from './types'
import { sendTransaction } from './send'
import { loadPoolsProgram } from './pools/loadProgram'
import { Token } from './token/token'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { ProgramsMultiton } from './ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from './ProgramsMultiton/utils'

// Configure the client to use the local cluster.
const pool = Keypair.generate()
const farmingState = Keypair.generate()
const farmingTicket = Keypair.generate()
const snapshotQueue = Keypair.generate()

const adminLPTicket = Keypair.generate()
const lpTicket = Keypair.generate()

let vaultSigner: PublicKey, vaultSignerNonce: number

let DEBUG_OUTPUT: boolean = process.env.DEBUG_OUTPUT
  ? toBool(process.env.DEBUG_OUTPUT)
  : false
let TX_SIGNATURE_LOGGING: boolean = process.env.TX_SIGNATURE_LOGGING
  ? toBool(process.env.TX_SIGNATURE_LOGGING)
  : false

const retbufAccount = Keypair.generate()
// const retbufProgram = new PublicKey(process.env.RETBUF_PROGRAM)

// const marketProgram = new PublicKey(process.env.MARKET_PROGRAM)
// const marketAddress = new PublicKey(process.env.MARKET_ADDRESS)
// const mint1 = new PublicKey(process.env.MINT1)
// const mint2 = new PublicKey(process.env.MINT2)
// const farmingMint = new PublicKey(process.env.FARMING_MINT)
// const tokenAccount1 = new PublicKey(process.env.TOKEN_ACCOUNT1)
// const tokenAccount2 = new PublicKey(process.env.TOKEN_ACCOUNT2)
// const FEE_OWNER_ACCOUNT = new PublicKey(process.env.FEE_OWNER_ACCOUNT)
// const poolAuthority = new Account(JSON.parse(process.env.POOL_AUTHORITY))
const poolInitializer = Keypair.generate()

const CREATION_SIZE = 100
const RATIO = 4500

let mint1Digits
let mint2Digits
let mint1Diff
let mint2Diff
let mint1DigitsMul
let mint2DigitsMul

let creatorPoolTokenAddress
let adminLPTokenAddress
let initializerPoolTokenAddress

let lpTokenFreezeAccount
let pda
let adminBaseTokenAccount
let adminQuoteTokenAccount
let initializerFarmingAccount

const Side = {
  Bid: { bid: {} },
  Ask: { ask: {} },
}

const AuthorityType = {
  Mint: 0,
  Freeze: 1,
  Owner: 2,
  Close: 3,
}

const OrderType = {
  ImmediateOrCancel: { immediateOrCancel: {} },
  Limit: { limit: {} },
  PostOnly: { postOnly: {} },
}

const SelfTradeBehavior = {
  DecrementTake: { decrementTake: {} },
  AbortTransaction: { abortTransaction: {} },
  CancelProvide: { cancelProvide: {} },
}

function toBool(str: string): boolean {
  return str.toLowerCase() === 'true'
}

const tests = () => {
  describe('so-pool', () => {
    it('gets initialized', async () => {
      ;[vaultSigner, vaultSignerNonce] = await PublicKey.findProgramAddress(
        [pool.publicKey.toBuffer()],
        program.programId
      )
      pda = vaultSigner
      mint1Digits = await getMintDecimals(provider.connection, mint1)
      mint2Digits = await getMintDecimals(provider.connection, mint2)
      mint1DigitsMul = Math.pow(10, mint1Digits)
      mint2DigitsMul = Math.pow(10, mint2Digits)
      mint1Diff = 1
      mint2Diff = 1
      if (mint2Digits > mint1Digits) {
        mint1Diff = Math.pow(10, Math.max(1, mint2Digits - mint1Digits))
      }
      if (mint1Digits > mint2Digits) {
        mint2Diff = Math.pow(10, Math.max(1, mint1Digits - mint2Digits))
      }
      const creator = NodeWallet.local().payer

      const poolMint = await createMint(provider, creator.publicKey)

      const vault1 = await createTokenAccount(provider, mint1, vaultSigner)
      const vault2 = await createTokenAccount(provider, mint2, vaultSigner)
      const feeVault1 = await createTokenAccount(
        provider,
        mint1,
        creator.publicKey
      )
      const feeVault2 = await createTokenAccount(
        provider,
        mint2,
        creator.publicKey
      )
      const feeVaultPool = await createTokenAccount(
        provider,
        poolMint,
        creator.publicKey
      )
      adminBaseTokenAccount = await createTokenAccount(
        provider,
        mint1,
        poolInitializer.publicKey
      )
      adminQuoteTokenAccount = await createTokenAccount(
        provider,
        mint2,
        poolInitializer.publicKey
      )

      // AuthorityType::MintTokens => 0,
      // AuthorityType::FreezeAccount => 1,
      // AuthorityType::AccountOwner => 2,
      // AuthorityType::CloseAccount => 3,
      creatorPoolTokenAddress = await createTokenAccount(
        provider,
        poolMint,
        creator.publicKey
      )
      adminLPTokenAddress = await createTokenAccount(
        provider,
        poolMint,
        poolInitializer.publicKey
      )
      initializerPoolTokenAddress = await createTokenAccount(
        provider,
        poolMint,
        poolInitializer.publicKey
      )
      lpTokenFreezeAccount = await createTokenAccount(
        provider,
        poolMint,
        vaultSigner
      )
      const mintTx = new Transaction().add(
        TokenInstructions.setAuthority({
          target: poolMint,
          currentAuthority: creator.publicKey,
          newAuthority: vaultSigner,
          authorityType: AuthorityType.Mint,
        }),
        TokenInstructions.setAuthority({
          target: feeVault1,
          authorityType: AuthorityType.Close,
          currentAuthority: creator.publicKey,
          newAuthority: vaultSigner,
        }),
        TokenInstructions.setAuthority({
          target: feeVault2,
          authorityType: AuthorityType.Close,
          currentAuthority: creator.publicKey,
          newAuthority: vaultSigner,
        }),
        TokenInstructions.setAuthority({
          target: feeVaultPool,
          authorityType: AuthorityType.Close,
          currentAuthority: creator.publicKey,
          newAuthority: vaultSigner,
        }),
        TokenInstructions.setAuthority({
          target: feeVault1,
          authorityType: AuthorityType.Owner,
          currentAuthority: creator.publicKey,
          newAuthority: FEE_OWNER_ACCOUNT,
        }),
        TokenInstructions.setAuthority({
          target: feeVault2,
          authorityType: AuthorityType.Owner,
          currentAuthority: creator.publicKey,
          newAuthority: FEE_OWNER_ACCOUNT,
        }),
        TokenInstructions.setAuthority({
          target: feeVault2,
          authorityType: AuthorityType.Owner,
          currentAuthority: creator.publicKey,
          newAuthority: FEE_OWNER_ACCOUNT,
        }),
        TokenInstructions.setAuthority({
          target: feeVaultPool,
          authorityType: AuthorityType.Owner,
          currentAuthority: creator.publicKey,
          newAuthority: FEE_OWNER_ACCOUNT,
        })
      )
      const mintTxid = await provider.send(mintTx, [creator])
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('mint tx ', mintTxid)
      }

      console.log('Initializing')
      const tx = await program.rpc.initialize(new BN(vaultSignerNonce), {
        accounts: {
          pool: pool.publicKey,
          poolMint: poolMint,
          lpTokenFreezeVault: lpTokenFreezeAccount,
          baseTokenVault: vault1,
          baseTokenMint: mint1,
          quoteTokenVault: vault2,
          quoteTokenMint: mint2,
          poolSigner: vaultSigner,
          initializer: poolInitializer.publicKey,
          poolAuthority: poolAuthority.publicKey,
          feeBaseAccount: feeVault1,
          feeQuoteAccount: feeVault2,
          feePoolTokenAccount: feeVaultPool,
          dexMarketAddress: marketAddress,
          dexMarketProgram: marketProgram,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [await program.account.pool.createInstruction(pool)],
        signers: [pool, poolInitializer],
      })
      if (DEBUG_OUTPUT) {
        console.log(poolInitializer.secretKey)
        console.log(pool.publicKey.toBase58(), vaultSigner.toBase58())
      }
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('gets initial deposit', async () => {
      const firstLpTicket = Keypair.generate()
      await createBasket(
        CREATION_SIZE * mint1DigitsMul * 10,
        poolInitializer,
        firstLpTicket,
        initializerPoolTokenAddress,
        adminBaseTokenAccount,
        adminQuoteTokenAccount
      )
      printBasket(
        await getBasket(1000000, program.transaction.getCreationBasket)
      )
    })

    it('gets admin deposit', async () => {
      await createBasket(
        CREATION_SIZE * mint1DigitsMul,
        poolInitializer,
        adminLPTicket,
        adminLPTokenAddress,
        adminBaseTokenAccount,
        adminQuoteTokenAccount
      )
      printBasket(
        await getBasket(1000000, program.transaction.getCreationBasket)
      )
    })

    it('returns admin deposit', async () => {
      await redeemBasket(
        CREATION_SIZE * mint1DigitsMul,
        poolInitializer,
        adminLPTicket.publicKey,
        adminLPTokenAddress,
        adminBaseTokenAccount,
        adminQuoteTokenAccount
      )
      printBasket(
        await getBasket(1000000, program.transaction.getCreationBasket)
      )
    })

    it('gets user deposit', async () => {
      const creator = Keypair.fromSecretKey(NodeWallet.local().payer.secretKey)
      const creSize = CREATION_SIZE * mint1DigitsMul
      await createBasket(
        creSize,
        creator,
        lpTicket,
        creatorPoolTokenAddress,
        tokenAccount1,
        tokenAccount2
      )
      printBasket(
        await getBasket(1000000, program.transaction.getCreationBasket)
      )
    })

    it('returns user deposit', async () => {
      const creator = Keypair.fromSecretKey(NodeWallet.local().payer.secretKey)
      const redemptionSize = 1 * mint1DigitsMul
      await redeemBasket(
        redemptionSize,
        creator,
        lpTicket.publicKey,
        creatorPoolTokenAddress,
        tokenAccount1,
        tokenAccount2
      )
      printBasket(
        await getBasket(1000000, program.transaction.getCreationBasket)
      )
    })

    it('returns a creation bucket', async () => {
      await getBasket(1000, program.transaction.getCreationBasket)
    })

    it('returns a redemption bucket', async () => {
      await getBasket(1000, program.transaction.getRedemptionBasket)
    })

    it('performs a swap', async () => {
      const SWAP_SIZE = 1
      const size = SWAP_SIZE * mint1DigitsMul
      const minSize = RATIO * SWAP_SIZE * mint2DigitsMul * 0.95

      const account = await program.account.pool.fetch(pool.publicKey)
      const vault1 = account.baseTokenVault
      const vault2 = account.quoteTokenVault
      const feePoolTokenAccount = account.feePoolTokenAccount
      const poolMint = account.poolMint

      const creator = Keypair.fromSecretKey(NodeWallet.local().payer.secretKey)

      let prev1 = (await getTokenAccount(provider, tokenAccount1)).amount
      let prev2 = (await getTokenAccount(provider, tokenAccount2)).amount
      if (DEBUG_OUTPUT) {
        console.log('size', size, 'minsize', minSize)
        console.log('amount before')
        console.log(prev1.toString())
        console.log(prev2.toString())
      }

      let tx = await program.rpc.swap(new BN(size), new BN(minSize), Side.Ask, {
        accounts: {
          pool: pool.publicKey,
          poolSigner: vaultSigner,
          poolMint: poolMint,
          baseTokenVault: vault1,
          quoteTokenVault: vault2,
          feePoolTokenAccount: feePoolTokenAccount,
          walletAuthority: creator.publicKey,
          userBaseTokenAccount: tokenAccount1,
          userQuoteTokenAccount: tokenAccount2,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        },
        signers: [creator],
      })

      let new1 = (await getTokenAccount(provider, tokenAccount1)).amount
      let new2 = (await getTokenAccount(provider, tokenAccount2)).amount
      if (DEBUG_OUTPUT) {
        console.log('amount after')
        console.log(new1.toString())
        console.log(new2.toString())
        console.log('diff')
        console.log(prev1.sub(new1).toString())
        console.log(prev2.sub(new2).toString())
      }
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }

      const size2 = RATIO * SWAP_SIZE * mint2DigitsMul
      const minSize2 = SWAP_SIZE * mint1DigitsMul * 0.95

      prev1 = (await getTokenAccount(provider, tokenAccount1)).amount
      prev2 = (await getTokenAccount(provider, tokenAccount2)).amount
      if (DEBUG_OUTPUT) {
        console.log('size', size2, 'minsize', minSize2)
        console.log('amount before')
        console.log(prev1.toString())
        console.log(prev2.toString())
      }

      tx = await program.rpc.swap(new BN(size2), new BN(minSize2), Side.Bid, {
        accounts: {
          pool: pool.publicKey,
          poolSigner: vaultSigner,
          poolMint: poolMint,
          baseTokenVault: vault1,
          quoteTokenVault: vault2,
          feePoolTokenAccount: feePoolTokenAccount,
          walletAuthority: creator.publicKey,
          userBaseTokenAccount: tokenAccount1,
          userQuoteTokenAccount: tokenAccount2,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        },
        signers: [creator],
      })

      new1 = (await getTokenAccount(provider, tokenAccount1)).amount
      new2 = (await getTokenAccount(provider, tokenAccount2)).amount
      if (DEBUG_OUTPUT) {
        console.log('amount after')
        console.log(new1.toString())
        console.log(new2.toString())
        console.log('diff')
        console.log(prev1.sub(new1).toString())
        console.log(prev2.sub(new2).toString())
      }
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('checks lp token price changes', async () => {
      const size = CREATION_SIZE * mint1DigitsMul
      const sizeMint2 = RATIO * CREATION_SIZE * mint1DigitsMul
      printBasket(await getBasket(size, program.transaction.getCreationBasket))
      const creator = Keypair.fromSecretKey(NodeWallet.local().payer.secretKey)
      const nlpTicket = Keypair.generate()
      await createBasket(
        size,
        creator,
        nlpTicket,
        creatorPoolTokenAddress,
        tokenAccount1,
        tokenAccount2,
        1.02
      )
      printBasket(await getBasket(size, program.transaction.getCreationBasket))
      await redeemBasket(
        size,
        creator,
        nlpTicket.publicKey,
        creatorPoolTokenAddress,
        tokenAccount1,
        tokenAccount2,
        1
      )
      printBasket(await getBasket(size, program.transaction.getCreationBasket))
      let quantities = (
        await getBasket(size, program.transaction.getCreationBasket)
      ).quantities
      assert.ok(quantities[0].toNumber() >= size)
      assert.ok(quantities[1].toNumber() >= sizeMint2)
      quantities = (
        await getBasket(size, program.transaction.getCreationBasket)
      ).quantities
      assert.ok(quantities[0].toNumber() >= size)
      assert.ok(quantities[1].toNumber() >= sizeMint2 * 0.9999)
      printBasket(await getBasket(size, program.transaction.getCreationBasket))
    })

    it('initializes farming', async () => {
      await sleep(2000)
      const creator = NodeWallet.local().payer

      const tokenAmount = new BN(1000000000000)
      const tokensPerPeriod = new BN(1000000000)
      const periodLength = new BN(1)
      const noWithdrawFarming = new BN(1)

      const farmingVault = await createTokenAccount(
        provider,
        farmingMint,
        vaultSigner
      )
      initializerFarmingAccount = await createTokenAccount(
        provider,
        farmingMint,
        poolInitializer.publicKey
      )
      const mintTx = new Transaction().add(
        TokenInstructions.mintTo({
          mint: farmingMint,
          destination: initializerFarmingAccount,
          amount: tokenAmount,
          mintAuthority: creator.publicKey,
        })
      )

      await provider.send(mintTx, [creator])

      const account = await program.account.pool.fetch(pool.publicKey)

      const tx = await program.rpc.initializeFarming(
        tokenAmount,
        tokensPerPeriod,
        periodLength,
        noWithdrawFarming,
        {
          accounts: {
            pool: pool.publicKey,
            farmingState: farmingState.publicKey,
            snapshots: snapshotQueue.publicKey,
            farmingTokenVault: farmingVault,
            farmingTokenAccount: initializerFarmingAccount,
            farmingAuthority: poolInitializer.publicKey,
            walletAuthority: poolInitializer.publicKey,
            tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
          },
          instructions: [
            await program.account.snapshotQueue.createInstruction(
              snapshotQueue
            ),
            await program.account.farmingState.createInstruction(farmingState),
          ],
          signers: [poolInitializer, snapshotQueue, farmingState],
        }
      )
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('initializes additional farming', async () => {
      await sleep(2000)
      const creator = NodeWallet.local().payer

      const tokenAmount = new BN(1000000000000)
      const tokensPerPeriod = new BN(1000000000)
      const periodLength = new BN(1)
      const noWithdrawFarming = new BN(1)

      const farmingVault = await createTokenAccount(
        provider,
        farmingMint,
        vaultSigner
      )
      initializerFarmingAccount = await createTokenAccount(
        provider,
        farmingMint,
        poolInitializer.publicKey
      )
      const mintTx = new Transaction().add(
        TokenInstructions.mintTo({
          mint: farmingMint,
          destination: initializerFarmingAccount,
          amount: tokenAmount,
          mintAuthority: creator.publicKey,
        })
      )

      await provider.send(mintTx, [creator])

      const account = await program.account.pool.fetch(pool.publicKey)
      const snapshotQueue = Keypair.generate()
      const farmingState = Keypair.generate()

      const tx = await program.rpc.initializeFarming(
        tokenAmount,
        tokensPerPeriod,
        periodLength,
        noWithdrawFarming,
        {
          accounts: {
            pool: pool.publicKey,
            farmingState: farmingState.publicKey,
            snapshots: snapshotQueue.publicKey,
            farmingTokenVault: farmingVault,
            farmingTokenAccount: initializerFarmingAccount,
            farmingAuthority: poolAuthority.publicKey,
            walletAuthority: poolInitializer.publicKey,
            tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
          },
          instructions: [
            await program.account.snapshotQueue.createInstruction(
              snapshotQueue
            ),
            await program.account.farmingState.createInstruction(farmingState),
          ],
          signers: [
            poolInitializer,
            poolAuthority,
            snapshotQueue,
            farmingState,
          ],
        }
      )
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('starts farming', async () => {
      const creator = NodeWallet.local().payer

      const poolTokenAmount = new BN(1000)

      const poolAccount = await program.account.pool.fetch(pool.publicKey)
      const lpTokenFreezeVault = poolAccount.lpTokenFreezeVault
      const tx = await program.rpc.startFarming(poolTokenAmount, {
        accounts: {
          pool: pool.publicKey,
          farmingState: farmingState.publicKey,
          farmingTicket: farmingTicket.publicKey,
          lpTokenFreezeVault: lpTokenFreezeVault,
          userLpTokenAccount: creatorPoolTokenAddress,
          walletAuthority: creator.publicKey,
          userKey: creator.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [
          await program.account.farmingTicket.createInstruction(farmingTicket),
        ],
        signers: [creator, farmingTicket],
      })
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('takes a snapshot', async () => {
      await sleep(5000)
      const creator = NodeWallet.local().payer

      const poolAccount = await program.account.pool.fetch(pool.publicKey)
      const lpTokenFreezeVault = poolAccount.lpTokenFreezeVault

      const tx = await program.rpc.takeFarmingSnapshot({
        accounts: {
          pool: pool.publicKey,
          farmingState: farmingState.publicKey,
          farmingSnapshots: snapshotQueue.publicKey,
          lpTokenFreezeVault: lpTokenFreezeVault,
          authority: poolAuthority.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [poolAuthority],
      })
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('ends farming', async () => {
      await sleep(3000)
      const creator = NodeWallet.local().payer

      const poolAccount = await program.account.pool.fetch(pool.publicKey)
      const lpTokenFreezeVault = poolAccount.lpTokenFreezeVault

      const tx = await program.rpc.endFarming({
        accounts: {
          pool: pool.publicKey,
          farmingState: farmingState.publicKey,
          farmingSnapshots: snapshotQueue.publicKey,
          farmingTicket: farmingTicket.publicKey,
          lpTokenFreezeVault: lpTokenFreezeVault,
          poolSigner: pda,
          userPoolTokenAccount: creatorPoolTokenAddress,
          userKey: creator.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [creator],
      })
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('ends farming again and fails', async () => {
      const creator = NodeWallet.local().payer

      const poolAccount = await program.account.pool.fetch(pool.publicKey)
      const lpTokenFreezeVault = poolAccount.lpTokenFreezeVault
      try {
        const tx = await program.rpc.endFarming({
          accounts: {
            pool: pool.publicKey,
            farmingState: farmingState.publicKey,
            farmingSnapshots: snapshotQueue.publicKey,
            farmingTicket: farmingTicket.publicKey,
            lpTokenFreezeVault: lpTokenFreezeVault,
            poolSigner: pda,
            userPoolTokenAccount: creatorPoolTokenAddress,
            userKey: creator.publicKey,
            tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
          },
          signers: [creator],
        })
      } catch (e) {
        if (DEBUG_OUTPUT) {
          console.log(e)
        }
        assert.ok(e.msg === 'TokensAlreadyUnfrozen')
      }
    })

    it('withdraws farmied', async () => {
      await sleep(2000)
      const creator = NodeWallet.local().payer
      const farmingAccount = await createTokenAccount(
        provider,
        farmingMint,
        vaultSigner
      )

      const farmingStateAccount = await program.account.farmingState.fetch(
        farmingState.publicKey
      )

      const tx = await program.rpc.withdrawFarmed({
        accounts: {
          pool: pool.publicKey,
          farmingState: farmingState.publicKey,
          farmingSnapshots: snapshotQueue.publicKey,
          farmingTicket: farmingTicket.publicKey,
          farmingTokenVault: farmingStateAccount.farmingTokenVault,
          poolSigner: pda,
          userFarmingTokenAccount: farmingAccount,
          userKey: creator.publicKey,
          userSolAccount: creator.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [creator],
      })
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })

    it('increases farming supply', async () => {
      await sleep(2000)
      const creator = NodeWallet.local().payer
      const tokenAmount = new BN(1000000000000)
      const mintTx = new Transaction().add(
        TokenInstructions.mintTo({
          mint: farmingMint,
          destination: initializerFarmingAccount,
          amount: tokenAmount,
          mintAuthority: creator.publicKey,
        })
      )

      await provider.send(mintTx, [creator])
      const farmingStateAccount = await program.account.farmingState.fetch(
        farmingState.publicKey
      )

      const tx = await program.rpc.increaseFarmingTotal(tokenAmount, {
        accounts: {
          pool: pool.publicKey,
          farmingState: farmingState.publicKey,
          farmingTokenVault: farmingStateAccount.farmingTokenVault,
          farmingTokenAccount: initializerFarmingAccount,
          walletAuthority: poolInitializer.publicKey,
          initializerAccount: poolInitializer.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        },
        signers: [poolInitializer],
      })
      if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
        console.log('transaction signature', tx)
      }
    })
  })
}

async function createBasket(
  creSize: number,
  walletAuthority: Keypair,
  lpTicket: Keypair,
  lpTokenAddress: PublicKey,
  baseTokenAddress: PublicKey,
  quoteTokenAddress: PublicKey,
  sizeMod: number = 1
) {
  const mintAuthority = NodeWallet.local().payer
  const creationSize = new BN(creSize)
  const tokenAmountA = new BN(creSize * sizeMod)
  const tokenAmountB = new BN(creSize * sizeMod)
    .mul(new BN(RATIO))
    .mul(new BN(mint1Diff))
  const account = await program.account.pool.fetch(pool.publicKey)
  const mint1 = account.baseTokenMint
  const mint2 = account.quoteTokenMint
  const vault1 = account.baseTokenVault
  const vault2 = account.quoteTokenVault
  const poolMint = account.poolMint

  const createMintAssociatedAccountTx = new Transaction().add(
    TokenInstructions.mintTo({
      mint: mint1,
      amount: tokenAmountA,
      destination: baseTokenAddress,
      mintAuthority: mintAuthority.publicKey,
    }),
    TokenInstructions.mintTo({
      mint: mint2,
      amount: tokenAmountB,
      destination: quoteTokenAddress,
      mintAuthority: mintAuthority.publicKey,
    })
  )

  await provider.send(createMintAssociatedAccountTx, [mintAuthority])

  const tx = await program.rpc.createBasket(
    creationSize,
    tokenAmountA,
    tokenAmountB,
    {
      accounts: {
        pool: pool.publicKey,
        poolMint: poolMint,
        lpTicket: lpTicket.publicKey,
        poolSigner: vaultSigner,
        userBaseTokenAccount: baseTokenAddress,
        userQuoteTokenAccount: quoteTokenAddress,
        baseTokenVault: vault1,
        quoteTokenVault: vault2,
        userPoolTokenAccount: lpTokenAddress,
        walletAuthority: walletAuthority.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
      instructions: [
        await program.account.lpTicket.createInstruction(lpTicket),
      ],
      signers: [walletAuthority, lpTicket],
    }
  )
  if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
    console.log('transaction signature', tx)
  }
}

async function redeemBasket(
  redemptionSize: number,
  walletAuthority: Keypair,
  lpTicketAddress: PublicKey,
  lpTokenAddress: PublicKey,
  baseTokenAddress: PublicKey,
  quoteTokenAddress: PublicKey,
  sizeMod: number = 0.999
) {
  // find lp ticket via gPA
  const tokenAmountA = new BN(redemptionSize * sizeMod)
  const tokenAmountB = new BN(redemptionSize * sizeMod)
    .mul(new BN(RATIO))
    .mul(new BN(mint1Diff))

  const account = await program.account.pool.fetch(pool.publicKey)
  const vault1 = account.baseTokenVault
  const vault2 = account.quoteTokenVault
  const feeVault1 = account.feeBaseAccount
  const feeVault2 = account.feeQuoteAccount

  const poolMint = account.poolMint

  const tx = await program.rpc.redeemBasket(
    new BN(redemptionSize),
    tokenAmountA,
    tokenAmountB,
    {
      accounts: {
        pool: pool.publicKey,
        poolMint: poolMint,
        baseTokenVault: vault1,
        quoteTokenVault: vault2,
        poolSigner: vaultSigner,
        userPoolTokenAccount: lpTokenAddress,
        userBaseTokenAccount: baseTokenAddress,
        userQuoteTokenAccount: quoteTokenAddress,
        walletAuthority: walletAuthority.publicKey,
        userSolAccount: walletAuthority.publicKey,
        lpTicket: lpTicketAddress,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        feeBaseAccount: feeVault1,
        feeQuoteAccount: feeVault2,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
      signers: [walletAuthority],
    }
  )
  if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
    console.log('transaction signature', tx)
  }
}

async function getBasket(size: number, txFn: (size: BN, {}) => Transaction) {
  const creator = NodeWallet.local().payer

  const bucketSize = new BN(size)

  const account = await program.account.pool.fetch(pool.publicKey)
  const vault1 = account.baseTokenVault
  const vault2 = account.quoteTokenVault
  const poolMint = account.poolMint

  const getBasketTx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: creator.publicKey,
      newAccountPubkey: retbufAccount.publicKey,
      lamports: 0,
      space: 1024,
      programId: retbufProgram,
    })
  )

  getBasketTx.add(
    txFn(bucketSize, {
      accounts: {
        pool: pool.publicKey,
        baseTokenVault: vault1,
        quoteTokenVault: vault2,
        poolMint: poolMint,
        retbufAccount: retbufAccount.publicKey,
        retbufProgram: retbufProgram,
      },
    })
  )
  return getPoolBasket(provider.connection, getBasketTx, creator.publicKey)
}

function printBasket(basket: Basket) {
  if (DEBUG_OUTPUT) {
    console.log(
      basket.quantities.map((quantity) => quantity.toString()).join(', ')
    )
  }
}

interface Basket {
  quantities: BN[]
}
const Basket: Layout<Basket> = struct([vec(i64(), 'quantities')])

async function getPoolBasket(
  connection: Connection,
  tx: Transaction,
  payer: PublicKey
): Promise<Basket> {
  tx.feePayer = payer
  const { value } = await simulateTransaction(
    connection,
    tx,
    connection.commitment ?? 'single'
  )
  if (value.err) {
    console.warn('Program logs:', value.logs)
    throw new Error('Failed to get pool basket: ' + JSON.stringify(value.err))
  }
  if (value.logs) {
    for (let i = value.logs.length - 1; i >= 0; --i) {
      if (value.logs[i].startsWith('Program log: ')) {
        const data = Buffer.from(
          value.logs[i].slice('Program log: '.length),
          'base64'
        )
        return Basket.decode(data)
      }
    }
  }
  throw new Error('Failed to find pool basket in logs')
}

export async function createBasketViaWallet({
  wallet,
  connection,
  poolPublicKey,
  userPoolTokenAccount,
  baseTokenAddress,
  quoteTokenAddress,
  userAmountTokenA,
  userAmountTokenB,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey | null
  baseTokenAddress: PublicKey
  quoteTokenAddress: PublicKey
  userAmountTokenA: number
  userAmountTokenB: number
}) {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const account = await program.account.pool.fetch(poolPublicKey)
  console.log('account', account)
  const { baseTokenMint, baseTokenVault, quoteTokenMint, quoteTokenVault, poolMint } = account
  console.log({
    poolMint: poolMint.toString(),
    baseTokenMint: baseTokenMint.toString(),
    baseTokenVault: baseTokenVault.toString(),
    quoteTokenMint: quoteTokenMint.toString(),
    quoteTokenVault: quoteTokenVault.toString()
  })

  const poolToken = new Token(wallet, connection, poolMint, TOKEN_PROGRAM_ID)

  const poolMintInfo = await poolToken.getMintInfo()
  const supply = poolMintInfo.supply.toNumber()

  console.log('supply', supply)

  const tokenMintA = new Token(
    wallet,
    connection,
    baseTokenMint,
    TOKEN_PROGRAM_ID
  )
  const poolTokenA = await tokenMintA.getAccountInfo(baseTokenVault)
  const poolTokenAmountA = poolTokenA.amount.toNumber()

  const poolTokenAmount = Math.floor(
    (supply * userAmountTokenA) / poolTokenAmountA
  )

  const commonTransaction = new Transaction()
  const commonSigners = []

  // open liq. provider ticket, will close on redeem
  const lpTicket = new Keypair()
  const lpTicketTransaction = await program.account.lpTicket.createInstruction(
    lpTicket
  )

  commonTransaction.add(lpTicketTransaction)
  commonSigners.push(lpTicket)

  // create pool token account for user if not exist
  if (!userPoolTokenAccount) {
    const [
      newUserPoolTokenAccount,
      userPoolTokenAccountSignature,
      userPoolTokenAccountTransaction,
    ] = await poolToken.createAccount(wallet.publicKey)

    userPoolTokenAccount = newUserPoolTokenAccount
    commonTransaction.add(userPoolTokenAccountTransaction)
    commonSigners.push(userPoolTokenAccountSignature)
  }

  const createBasketTransaction = await program.instruction.createBasket(
    poolTokenAmount,
    userAmountTokenA,
    userAmountTokenB,
    {
      accounts: {
        pool: poolPublicKey,
        poolMint,
        lpTicket: lpTicket.publicKey,
        poolSigner: vaultSigner,
        userBaseTokenAccount: baseTokenAddress,
        userQuoteTokenAccount: quoteTokenAddress,
        baseTokenVault,
        quoteTokenVault,
        userPoolTokenAccount,
        walletAuthority: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  )
  commonTransaction.add(createBasketTransaction)

  const tx = sendTransaction({
    wallet,
    connection,
    transaction: commonTransaction,
    signers: commonSigners,
  })

  if (DEBUG_OUTPUT && TX_SIGNATURE_LOGGING) {
    console.log('transaction signature', tx)
  }
}
