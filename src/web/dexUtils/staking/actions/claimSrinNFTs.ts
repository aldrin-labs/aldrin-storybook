import { SYSTEM_PROGRAM_ID } from '@marinade.finance/marinade-ts-sdk/dist/src/util'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey, Transaction } from '@solana/web3.js'

import { getTokensForWallet } from '@core/magicEden'

import { toMap } from '../../../utils'
import { ProgramsMultiton } from '../../ProgramsMultiton'
import { signAndSendSingleTransaction } from '../../transactions'
import { ClaimNftParams } from './types'

export const claimSrinNFTs = async (params: ClaimNftParams) => {
  const {
    wallet,
    nftTier,
    connection,
    userNftReceipt,
    stakingPool,
    nftReward,
  } = params
  const { publicKey } = wallet
  if (!publicKey) {
    throw new Error('No public key for wallet!')
  }
  // const availableNfts = await getTokensForWallet(publicKey.toString())

  // if (!availableNfts) {
  //   throw new Error('No available NFTs for claim!')
  // }

  const rewardOwners = nftTier[0].account.nfts.map((nft) => nft.nftOwner)
  const availableNfts = await Promise.all(
    rewardOwners.map((ro) => getTokensForWallet(ro.toString()))
  )

  const nftsToClaim = availableNfts.map((nfts) => {
    if (!nfts) {
      throw new Error('No available NFTs for claim!')
    }
    const totalNftsSize = nfts.length

    const randomNftIndex = Math.floor(Math.random() * totalNftsSize)
    return nfts[randomNftIndex]
  })

  const nftsOwners = [...new Set(nftsToClaim.map((nft) => nft.owner))]

  const nftsOnOwnerAccounts = await Promise.all(
    nftsOwners.map(async (nftOwner) => {
      const parsedAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(nftOwner),
        {
          programId: TOKEN_PROGRAM_ID,
        }
      )
      return parsedAccounts.value.map((el) => ({
        mint: el.account.data.parsed.info.mint as string,
        address: el.pubkey.toString(),
        nftOwner,
      }))
    })
  )

  const nftsByMint = toMap(nftsOnOwnerAccounts.flat(), (n) => n.mint)

  const mintsWithTokenAccounts = await Promise.all(
    nftsToClaim.map(async (nft) => {
      const nftForMint = nftsByMint.get(nft.mintAddress)

      if (!nftForMint) {
        throw new Error('Failed')
      }

      const ata = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(nft.mintAddress),
        publicKey
      )

      return {
        mint: nftForMint.mint,
        sourceAddress: nftForMint.address,
        destinationAddress: ata.toString(),
      }
    })
  )

  const program = ProgramsMultiton.getPlutoniansStakingProgram({
    wallet,
    connection,
  })

  const remainingAccounts = mintsWithTokenAccounts
    .map((m) => [
      new PublicKey(m.sourceAddress),
      new PublicKey(m.destinationAddress),
    ])
    .flat()
    .map((pubkey) => ({ pubkey, isSigner: false, isWritable: true }))

  const claimInstruction = await program.methods
    .claimNftReward()
    .accounts({
      user: publicKey,
      userNftReceipt,
      stakingPool,
      nftReward,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SYSTEM_PROGRAM_ID,
    })
    .remainingAccounts(remainingAccounts)
    .instruction()

  const createMintAccountsInstructions = mintsWithTokenAccounts.map((m) =>
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(m.mint),
      new PublicKey(m.destinationAddress),
      publicKey,
      publicKey
    )
  )

  const transaction = new Transaction()
    .add(...createMintAccountsInstructions)
    .add(claimInstruction)

  return signAndSendSingleTransaction({
    transaction,
    wallet,
    connection,
  })
}
