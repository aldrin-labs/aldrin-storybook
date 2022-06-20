import { SYSTEM_PROGRAM_ID } from '@marinade.finance/marinade-ts-sdk/dist/src/util'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey, Transaction } from '@solana/web3.js'

import { toMap } from '../../../utils'
import { ProgramsMultiton } from '../../ProgramsMultiton'
import { signAndSendSingleTransaction } from '../../transactions'
import { ClaimNftParams } from './types'

const NFTS_WHITELIST_PATH = 'https://api.jsonbin.io/b/62a89098402a5b3802277142'

export type NftWhitelistResponse = {
  [k: string]: { mint: string; wallet: string }[]
}

export const claimSrinNFTsInstructions = async (params: ClaimNftParams) => {
  const { wallet, nftRewardGroup, connection, userNftReceipt, stakingPool } =
    params
  const { publicKey } = wallet
  if (!publicKey) {
    throw new Error('No public key for wallet!')
  }

  const { nfts } = nftRewardGroup.account

  const nftWhitelist = await fetch(NFTS_WHITELIST_PATH).then(
    (res) => res.json() as Promise<NftWhitelistResponse>
  )

  const availableNfts = nfts.map((ro) => ({
    publicKey: ro.nftOwner,
    nfts: nftWhitelist[ro.nftOwner.toBase58()] || [],
    quantity: ro.quantity,
  }))

  const nftsOwners = availableNfts.map((_) => _.publicKey.toBase58())

  const nftsOnOwnerAccounts = await Promise.all(
    nftsOwners.map(async (nftOwner) => {
      const parsedAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(nftOwner),
        {
          programId: TOKEN_PROGRAM_ID,
        }
      )
      return parsedAccounts.value
        .filter((el) => el.account.data.parsed.info.tokenAmount.uiAmount > 0)
        .map((el) => ({
          mint: el.account.data.parsed.info.mint as string,
          address: el.pubkey.toBase58(),
          nftOwner,
        }))
    })
  )

  const nftsByMint = toMap(nftsOnOwnerAccounts.flat(), (n) => n.mint)

  const mintAddresses = new Set([...nftsByMint.keys()])

  const nftsWithOwner = availableNfts.map((nftToClaim) => {
    if (!nftToClaim) {
      throw new Error('No available NFTs for claim!')
    }
    // console.log('nftToClaim', nftToClaim)
    const existingNfts = nftToClaim.nfts.filter((nft) =>
      mintAddresses.has(nft.mint)
    )

    const shuffledNfts = existingNfts.sort(() => 0.5 - Math.random())

    if (shuffledNfts.length < nftToClaim.quantity) {
      throw new Error('Not enough NFTs for claim!')
    }
    return {
      publicKey: nftToClaim.publicKey,
      nfts: shuffledNfts.slice(0, nftToClaim.quantity),
    }
  })

  const mintsWithTokenAccounts = await Promise.all(
    nftsWithOwner.map(async (nftWithOwner) => ({
      owner: nftWithOwner.publicKey,
      userWallets: await Promise.all(
        nftWithOwner.nfts.map(async (nft) => {
          const nftForMint = nftsByMint.get(nft.mint)

          if (!nftForMint) {
            throw new Error('Failed')
          }

          const ata = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            new PublicKey(nft.mint),
            publicKey
          )

          return {
            mint: nftForMint.mint,
            nftOwner: nftForMint.nftOwner,
            sourceAddress: nftForMint.address,
            destinationAddress: ata.toBase58(),
          }
        })
      ),
    }))
  )

  const program = ProgramsMultiton.getPlutoniansStakingProgram({
    wallet,
    connection,
  })

  const remainingAccounts = mintsWithTokenAccounts
    .map((mintWithTokenAccounts) => {
      return [
        {
          pubkey: mintWithTokenAccounts.owner,
          isSigner: false,
          isWritable: false,
        },
        ...mintWithTokenAccounts.userWallets
          .map((nft) => [
            {
              pubkey: new PublicKey(nft.sourceAddress),
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: new PublicKey(nft.destinationAddress),
              isSigner: false,
              isWritable: true,
            },
          ])
          .flat(),
      ]
    })
    .flat()

  const claimInstruction = await program.methods
    .claimNftReward()
    .accounts({
      user: publicKey,
      userNftReceipt,
      stakingPool,
      nftReward: nftRewardGroup.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SYSTEM_PROGRAM_ID,
    })
    .remainingAccounts(remainingAccounts)
    .instruction()

  const userTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  )

  const tokenAddresses = new Set(
    userTokenAccounts.value.map((el) => el.pubkey.toBase58())
  )

  const createMintAccountsInstructions = mintsWithTokenAccounts.map((m) =>
    m.userWallets
      .filter(
        (userWallet) => !tokenAddresses.has(userWallet.destinationAddress)
      )
      .map((userWallet) =>
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          new PublicKey(userWallet.mint),
          new PublicKey(userWallet.destinationAddress),
          publicKey,
          publicKey
        )
      )
  )

  return [...createMintAccountsInstructions.flat(), claimInstruction]
}

export const claimSrinNFTs = async (params: ClaimNftParams) => {
  const { wallet, connection } = params

  const transaction = new Transaction().add(
    ...(await claimSrinNFTsInstructions(params))
  )

  return signAndSendSingleTransaction({
    transaction,
    wallet,
    connection,
  })
}
