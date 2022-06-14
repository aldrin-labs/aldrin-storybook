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

const NFTS_WHITELIST: { [k: string]: { mint: string; wallet: string }[] } = {
  // CrFb4YuhmbD4f2Z865sVoQq76VdGf3gPxXziszmPLqQp: [
  //   {
  //     mint: '75X7WdVZH2Vvr3taFkYUahqptHJ31XzwYpWhH3FKV7US',
  //     wallet: 'D7mWuc6cetbJT2mxJZxRenJjUFnEtnsZ3RTrFukLPuqG',
  //   },
  //   {
  //     mint: 'J4EsBoMX2nxa96vruaZcMvWLBRif9zPeS5Ev4rj7THzM',
  //     wallet: 'GGLA9sscArfPVsATJh8qXANfK6qHgzJ5HG1gZAev33g7',
  //   },
  //   {
  //     mint: 'C5bZQXXXeoP5Y5sXsLBAXK2dNuWCxavt19fLuzRvkdcY',
  //     wallet: 'AHh59rz7j1AuCdeR7geu7kxD2tfz2KzpxPmgz9XPhe9G',
  //   },
  //   {
  //     mint: '9MspRCfJwgFJ7zpSH8GNx8pbZK8mSkQLptw2AVNaDY4S',
  //     wallet: 'Etgaks1PNP9dt86fX9oXmFaJWSLR6jDcE9S4mUPaZUx2',
  //   },
  //   {
  //     mint: '9GdhcZ4WJFRVfKpJq9Vk7oUH5csj7j6g5yMnc8ecbtBi',
  //     wallet: 'Af4SJMxz11xNvYWeRZujR6D3Hk4kRq831xyEdsARD3R',
  //   },
  //   {
  //     mint: '2A3tcmfZ49yiKww1XSqGzPG5ppBbcRatqbvdsRupaQq5',
  //     wallet: 'DkT9PhoukdqqaC3BD6aiTrzBVNQJdLfGSB4JtAU2Rdvc',
  //   },
  //   {
  //     mint: '5STcSNej9FN1LNem3coxJhAVJwZkEP3WNXDBd1xkQCZ3',
  //     wallet: 'BgnYjDU932SsP6xrHTq1EHkYDY6ZyLvQPwDPdnSMjB3u',
  //   },
  //   {
  //     mint: 'BPSfmgFenTULqbZ9TYd3tZcVKPkhi88Er5XFyoCErcLR',
  //     wallet: 'Dxyt7rBqoDsHhHtNJFNob6KvvL3kMd18eRUr4VQtb8DK',
  //   },
  //   {
  //     mint: 'AVt5LqCjabC1PprhQoV2BMqM5wx3jFEQZpD7wz9iF5CB',
  //     wallet: '7NqfgNW1y4onDQMBoQdEAW8TAECaJZBged7hH3few6kj',
  //   },
  //   {
  //     mint: '8CxKtwz6a73rxZR3PaUcna3FnteQPUQr7ytqorFzMUzB',
  //     wallet: 'AdWJjZ5JuYXRJpjLDq7Rks5nzyg2h27veM6UMBmmyYmn',
  //   },
  //   {
  //     mint: 'E64ToNhw2J24gKTJxkuPfY8KgA7NbSrQZsASN4kGDTSY',
  //     wallet: '3FbApRauza9h1yRZRWk8s5uk8CKtwvTTZwmPDpmjznCy',
  //   },
  //   {
  //     mint: 'EfKefw6gGbrB3dRhi3r2zaoaJtckGN4JzzfbqP8imwMn',
  //     wallet: 'HVUfuBqsvyDfnbPyAmnZZrNmrcUVN1fkhPVGSYHZifhV',
  //   },
  //   {
  //     mint: '75g9oYRRah92WBYWu6DA2N7sc8Yx5kMYgeer4T91JyTB',
  //     wallet: '4b4aT9ULd9D6To3xxmJNx21SnRyjhdEiDpeArE53xsSn',
  //   },
  //   {
  //     mint: 'FGWN1d9WzRGaukoKYs5CuX94KHAj9G7guHR1zZMaSA4F',
  //     wallet: 'DsCoeDVAFv63Apt35fPokqKvAztPLQRGsvJe2HmvUG5N',
  //   },
  //   {
  //     mint: '7Ur8EZMLuHACTnLFV4PnyBhy8hgHwiH4i63Z5eNRfWU3',
  //     wallet: 'E2XJAs7c8Ks5L5qVNPQS3t6F5hmyqUyXctHs43eMraP6',
  //   },
  //   {
  //     mint: 'FbJU2Dxx3sV4u6jLe5ovFDmRgDtFWzi2Et4Ldq4XR1cQ',
  //     wallet: 'Ci6XK1xrLSEGhPzPSuisqFHfPVKVSkAqCmH4xcPfHeJU',
  //   },
  //   {
  //     mint: 'FwZBsVojEBXJYtDrvrsnzvXyGmBbsN1p3oeoDyPWCq2E',
  //     wallet: 'AzraRVtF2WDZxuktWs9rWL3z58HRigCog19vG47rAVQU',
  //   },
  //   {
  //     mint: 'ABzeKHMowuNeZqKCTuXMnFYMoSzaKX9UZw8bwL9hUoxb',
  //     wallet: 'F5coWaCdvdAKKESzRGnuNweA3YY5ipDDRkBN2GFfMXxX',
  //   },
  //   {
  //     mint: 'EjzCkA2h8tA9AEeakgdd6nvmFmnqfUL9DCBMmp2cmWG8',
  //     wallet: '3ik8U6xKDVDzUndPFBrNS4VhCZh9Qn7BubqszAaTHgSb',
  //   },
  //   {
  //     mint: 'ERk5FYd1wgMer29wZJ3tMVbiipDeFdpE5YW9ccQ1MeKr',
  //     wallet: 'DAYvFtJGxsdRkS7GfFNrRC8vrSbjKvDQAKoFvzhgUtFk',
  //   },
  //   {
  //     mint: 'C46wusV38HXsdZabxYFaNdhZfNyGeaKQNSnep4ZzKU73',
  //     wallet: 'tWkgbnnCsg7TqEW1VxbT2ZRCqVNwEAciX2GoE1z7Xt4',
  //   },
  //   {
  //     mint: '5Y822N9Cd3KMoL4UvyzEA3oKbN361UxckBHoT92obFcW',
  //     wallet: 'GJLemG6F2rJocaRhGvw9xKGqaJpp6CePY1p61t8NzrgC',
  //   },
  //   {
  //     mint: 'EhHoFZ6MABh91xikczqyWnBGz2Vf4WTS963pQ6Mq1NL',
  //     wallet: 'BoP49au1iJdfE4iKCdDVLUzXPLAC5FJND4UdEZqQBZ8q',
  //   },
  //   {
  //     mint: 'AtHvu15KVdMVzEVXgaRpUs9yipTxiJZR4Hzez3TtXEHT',
  //     wallet: 'CTrwwq8mYk5EpgCfw8gcp6RAQJM7Mwpuu7AxJWUDvSHK',
  //   },
  //   {
  //     mint: 'EUc7hkJ4RGCgTrNHU1DsQTmtdhFwfNQaeHeFayvMQCwZ',
  //     wallet: '4P5CaGi11dp2xdsxzbwSy4SouxK468Egio2MeewkeG2k',
  //   },
  //   {
  //     mint: '13qthAhAqRBr4qk8WEwHnsEuyy48KhTyimak1hbLtpq8',
  //     wallet: 'EGvt7iATMRmsG9pRzdMNuq3wvbzuZPHMTNo7F2yyvepe',
  //   },
  //   {
  //     mint: '9EhVpnt5jBvHy4rzHXS2AzGKKUNGM9VJs3g44dixTUjK',
  //     wallet: 'TdwtiivZv5EPruZUNXP3TKBNDZcPoPPjAKWyUuCRDXJ',
  //   },
  //   {
  //     mint: 'wnH7XUEfYyAmHpXQk7aqM6515c2ymwibsDGTEfEeuz8',
  //     wallet: '6L3pLuKYART8Ah1ghwaoTGpnreBxv3KR8AhsmsGzBK4K',
  //   },
  //   {
  //     mint: '9u4QnXw4pgvoU65KgPDAfo5o2UFoL4VzEs7n9Bs9uzob',
  //     wallet: 'cMh7KE2iZtgZRfZzpzSaKMomVji2WFSJMVwBtviewr9',
  //   },
  //   {
  //     mint: 'GKcBrz9jzinax63BAeCYjLJaWA2zrZAynBPNQfpVXWNo',
  //     wallet: '7XaFQ376a8VF6sYbPAcUmQxfqZFcgooircuTnuBUYeMU',
  //   },
  //   {
  //     mint: 'Bxzf3H2PTDjWPX7nrPB8SyNRbYZuB82cD7znZSV4JNmQ',
  //     wallet: 'YsUdHZJqRm8jy7gW8hHTQVft2aHUdivKMTbirwfemnk',
  //   },
  //   {
  //     mint: '3fiFaLRsh7oDjpveEUcbDikCokosoJ5vAiFcAhT39fZs',
  //     wallet: '2UvnKuo3QKm1sYyT9TmB6shETwCDTHdfv5vBkkz1A4Rw',
  //   },
  //   {
  //     mint: 'HuTCea9bksCgZXnZiTiP8UfjrtUWz1BD16RfFXFGwrR3',
  //     wallet: 'EvRUp3QCgJRVdMGEwnD8GAfPUrwNNJBY4fhCqayTVskE',
  //   },
  //   {
  //     mint: '58u9LBjachc24iaqpeqt9XzhS1yfwr6q83FxeuB8ryUN',
  //     wallet: 'Ci6daG9Dakcviqc5fXztKBVKiaXs74xbqkQfkSw2AGNj',
  //   },
  //   {
  //     mint: '74DKTB61neSRbcut31nhiBRVnDAqSuVKtZXjbcRGmk5Z',
  //     wallet: 'EXNEBYrUJjWWtYfurpnmJKxhArpwVr6nZzH63BWboVBL',
  //   },
  //   {
  //     mint: 'Bbzr4xPmXEokbwiTxSAGx2cVaSQXNdxNBYmP9e7MhszX',
  //     wallet: 'XihKmXGcudNj3Wu6dgNhgKdJb1uEbgNa81vcqZJy2WS',
  //   },
  //   {
  //     mint: '5VsavLbNHj2D6HBh5sBNMbu7psJNu6ELGAwn41qoDb11',
  //     wallet: '44p5omQjwGtRmtLCLcYaxK8zCRTv8yb2LoibFm5Y8Jos',
  //   },
  //   {
  //     mint: '8y8wZhRxdhkPQJAWnyKnAiMxszAFZox6zRNK8dWccj3V',
  //     wallet: 'GpNabtRLCSYYni9aBochPb7SirDVNMEorH9aKLdhHWJ4',
  //   },
  //   {
  //     mint: 'EJHY6XC6W5cUKZwXRzW8vB774PLuNfot15PEWPcWJbPb',
  //     wallet: 'EwVtB96NRSFjEtWFh3Y1Zerw1ek9v3MuSzNwGzqqSKT6',
  //   },
  //   {
  //     mint: '675HYHwtRTGUi3FAHZiC4jMt6Yg2kkv7kqShxfmFtVXs',
  //     wallet: '4kWySZ4ULuX4hpM7qE5qQZszCqvcP327ccSf7Pqz67sf',
  //   },
  //   {
  //     mint: 'EEvLB4WWy121xdpxae7VF1C9oDiLaHwFWC4TtwHvyhaL',
  //     wallet: '8YKpGr5MyvpMtmkxzjXTxHUseWYPy7WXhSXW8BQHkjdc',
  //   },
  //   {
  //     mint: '6Z9Lkr34LANgYoBpDQGEL4bsSd5ueKWi28qgRAb23rXi',
  //     wallet: 'EzvSQwWapyCFKR1o8edZs5a6MSXbJhov5uNAay9xqC1B',
  //   },
  //   {
  //     mint: 'BuFv29LJB3kidPBPyRUKrr26J1LEgV2hz4CyGyz68gYH',
  //     wallet: 'CGU72yAiiWmsf5HSdnQ2CrWz26r9nwLj6tHLUmUkGthx',
  //   },
  //   {
  //     mint: '32tCS5caAG3AHtDTEnfFVHhVjbtz43k8eSqPvDYWoG67',
  //     wallet: 'APJGADLCpN5U87ukwJ4kjcPHtmkEvTGGtPDcdpp6epeR',
  //   },
  //   {
  //     mint: '4E5pzfxN6Cmrr3sPcDLWbVj5dAMu9B8zHAhMWsG1J6F3',
  //     wallet: 'BGzpjuBDQKuUWdaqgUqqjJsxQSoBjYAF1M51qPA7sj3s',
  //   },
  // ],
  // '9qqqKi2nMBM2PJeFAacCtgQdfYVBnNLz7cfV2RPeCFn4': [
  //   {
  //     mint: 'BRRR9qeU8QVfTKxuQgcXKPUWrV3PGfqs5cBKvcVEFDgd',
  //     wallet: '49ArX3uRbknCPLWQGAF4Ng3VEWEnZuca9NhuFQ8Xtnza',
  //   },
  //   {
  //     mint: 'BH69D6NpzdKdFj3CHMNj4SvyCiXKMKjwAN8ae5KfXZbH',
  //     wallet: 'E9Yaj428ZBd3VBkFc9XhuZXiro9tVfgK8jj8dL91L1Dh',
  //   },
  //   {
  //     mint: 'FXMNP4vTS6juaPiqh73yRWuAcSnoJoDKEemwgkhqSK43',
  //     wallet: 'CiTSCLrHVBebx8XbtKrB1qkUJRmVd5XtJjGbgUwsi6uL',
  //   },
  //   {
  //     mint: '8WqQbSTPXwiovntMn8zqU8bmv7EECACFYf2SaXXavUnF',
  //     wallet: '8CwS2FvxGoi7bGhwELpmXoGbgMBtBiuB6AeAMhj6chW5',
  //   },
  //   {
  //     mint: '973dGBipDwAUfBzG45xkFaCtZVL2oH1694txbEoNGEPn',
  //     wallet: 'mnprZYbwBcbKpGCoCjf7VPBRLwWqRfKjgEx12mYo9i6',
  //   },
  //   {
  //     mint: 'DcZDp13KJhTbkhS5w6eGhG2RLABTzAPe7APhqfvLVNKx',
  //     wallet: '2bx9j2idedZY9jZc5qJXbz8oDjudssRMgosx9yGvKrWq',
  //   },
  //   {
  //     mint: '3YjyNSCinZSS4egBVpFgY94Qti68G6rn9ZA3Q4M9PMda',
  //     wallet: 'DAw9ffWwoo5bq4haWSSMDZ4USNtnUYkMUqpZzYQhkjsZ',
  //   },
  //   {
  //     mint: 'EHmAYF8dW9bYgNh3hHwGC9HE6cp7BigZyFs1rjQjE6G2',
  //     wallet: '7xeatvw1xnN3fCmk5AnuUvEmdaBHmenNtYyHVSHLR1qJ',
  //   },
  // ],
}

export const claimSrinNFTsInstructions = async (params: ClaimNftParams) => {
  const { wallet, nftRewardGroup, connection, userNftReceipt, stakingPool } =
    params
  const { publicKey } = wallet
  if (!publicKey) {
    throw new Error('No public key for wallet!')
  }

  const { nfts } = nftRewardGroup.account

  const availableNfts = nfts.map((ro) => ({
    publicKey: ro.nftOwner,
    nfts: NFTS_WHITELIST[ro.nftOwner.toBase58()] || [],
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
    console.log('nftToClaim', nftToClaim)
    const existingNfts = nftToClaim.nfts.filter((nft) =>
      mintAddresses.has(nft.mint)
    )

    const shuffledNfts = existingNfts.sort(() => 0.5 - Math.random())

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
