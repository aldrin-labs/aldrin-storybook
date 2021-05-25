import React, { useContext, useEffect, useMemo, useState } from 'react'
import Wallet from '@project-serum/sol-wallet-adapter'
import MathWallet from '@sb/dexUtils/MathWallet/MathWallet'
import SolongWallet from '@sb/dexUtils/SolongWallet/SolongWallet'
import CcaiWallet from '@sb/dexUtils/CcaiWallet/CcaiWallet'
import { notify } from './notifications'
import {
  useAccountInfo,
  useConnection,
  useConnectionConfig,
} from './connection'
import { CCAIProviderURL, useLocalStorageState, useRefEqual } from './utils'
import {
  Connection,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import {
  getTokenAccountInfo,
  MINT_LAYOUT,
  parseTokenAccountData,
} from './tokens'
import { clusterApiUrl } from '@solana/web3.js'
import { TokenListProvider } from '@solana/spl-token-registry'
import { TokenInstructions } from '@project-serum/serum'
import { useAsyncData } from './fetch-loop'
import { getMaxWithdrawAmount } from './pools'

export const WALLET_PROVIDERS = [
  // { name: 'solflare.com', url: 'https://solflare.com/access-wallet' },
  { name: 'cryptocurrencies.ai', url: CCAIProviderURL },
  { name: 'sollet.io', url: 'https://www.sollet.io' },
  { name: 'mathwallet.org', url: 'https://www.mathwallet.org' },
  { name: 'solongwallet.com', url: 'https://solongwallet.com' },
]

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)

export const WRAPPED_SOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112'
)

export const MAINNET_URL = 'https://solana-api.projectserum.com'

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

const getWalletByProviderUrl = (providerUrl: string) => {
  switch (providerUrl) {
    case 'https://solongwallet.com': {
      return SolongWallet
    }
    case 'https://www.mathwallet.org': {
      return MathWallet
    }
    case CCAIProviderURL: {
      return CcaiWallet
    }
    default: {
      return Wallet
    }
  }
}

const WalletContext = React.createContext(null)

export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false)
  const [autoConnect, setAutoConnect] = useState(false)

  const { endpoint } = useConnectionConfig()
  const [savedProviderUrl, setProviderUrl] = useLocalStorageState(
    'walletProvider',
    CCAIProviderURL
  )

  let providerUrl
  if (!savedProviderUrl) {
    providerUrl = CCAIProviderURL
  } else {
    providerUrl = savedProviderUrl
  }

  const wallet = useMemo(() => {
    const WalletClass = getWalletByProviderUrl(providerUrl)
    const wallet = new WalletClass(providerUrl, endpoint)

    return wallet
  }, [providerUrl, endpoint])

  const connectWalletHash = useMemo(() => window.location.hash, [
    wallet.connected,
  ])

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', async () => {
        if (wallet.publicKey) {
          console.log('connected')
          setConnected(true)
          const walletPublicKey = wallet.publicKey.toBase58()
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(
                  0,
                  7
                )}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length
                )}`
              : walletPublicKey

          notify({
            message: 'Wallet update',
            description: 'Connected to wallet ' + keyToDisplay,
          })
        }
      })

      wallet.on('disconnect', () => {
        setConnected(false)
        notify({
          message: 'Wallet update',
          description: 'Disconnected from wallet',
        })
      })
    }

    return () => {
      setConnected(false)
      if (wallet) {
        wallet.disconnect()
        setConnected(false)
      }
    }
  }, [wallet])

  useEffect(() => {
    if (wallet && autoConnect) {
      wallet.connect()
      setAutoConnect(false)
    }

    return () => {}
  }, [wallet, autoConnect])

  useEffect(() => {
    if (connectWalletHash === '#connect_wallet') {
      setProviderUrl(CCAIProviderURL)
      wallet.connect()
    }
  }, [wallet])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        providerUrl,
        setProviderUrl,
        setAutoConnect,
        providerName:
          WALLET_PROVIDERS.find(({ url }) => url === providerUrl)?.name ??
          providerUrl,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('Missing wallet context')
  }
  return {
    connected: context.connected,
    wallet: context.wallet,
    providerUrl: context.providerUrl,
    setProvider: context.setProviderUrl,
    providerName: context.providerName,
    setAutoConnect: context.setAutoConnect,
  }
}

export function useWalletPublicKeys() {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [tokenAccountInfo, loaded] = useAsyncData(
    () => getTokenAccountInfo(connection, wallet.publicKey),
    'getTokenAccountInfo'
  )

  let publicKeys = [
    // wallet.publicKey,
    ...(tokenAccountInfo
      ? tokenAccountInfo.map(({ pubkey }: { pubkey: PublicKey }) => pubkey)
      : []),
  ]
  // Prevent users from re-rendering unless the list of public keys actually changes
  publicKeys = useRefEqual(
    publicKeys,
    (oldKeys, newKeys) =>
      oldKeys.length === newKeys.length &&
      oldKeys.every((key, i) => key.equals(newKeys[i]))
  )
  return [publicKeys, loaded]
}

export function useMaxWithdrawalAmounts({
  poolTokenAmount,
  tokenSwapPublicKey,
}: {
  poolTokenAmount: number
  tokenSwapPublicKey: PublicKey
}) {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [withdrawalAmounts, loaded] = useAsyncData(
    () =>
      getMaxWithdrawAmount({
        connection,
        wallet,
        poolTokenAmount,
        tokenSwapPublicKey,
      }),
    `getMaxWithdrawAmount-${tokenSwapPublicKey}`
  )

  return [withdrawalAmounts, loaded]
}

export function parseMintData(data) {
  let { decimals } = MINT_LAYOUT.decode(data)
  return { decimals }
}

// const TokenListContext = React.createContext({});

// export const CLUSTERS = [
//   {
//     name: 'mainnet-beta',
//     apiUrl: MAINNET_URL,
//     label: 'Mainnet Beta'
//   },
//   {
//     name: 'devnet',
//     apiUrl: clusterApiUrl('devnet'),
//     label: 'Devnet'
//   },
//   {
//     name: 'testnet',
//     apiUrl: clusterApiUrl('testnet'),
//     label: 'Testnet'
//   },
//   {
//     name: 'localnet',
//     apiUrl: 'http://localhost:8899',
//     label: null
//   }
// ];

// export function clusterForEndpoint(endpoint) {
//   return CLUSTERS.find(({ apiUrl }) => apiUrl === endpoint);
// }

// export function useTokenInfos() {
//   const { tokenInfos } = useContext(TokenListContext);
//   return tokenInfos;
// }

// const nameUpdated = new EventEmitter();
// nameUpdated.setMaxListeners(100);

// export function useTokenInfo(mint) {
//   const { endpoint } = useConnectionConfig();
//   useListener(nameUpdated, 'update');
//   const tokenInfos = useTokenInfos();
//   return getTokenInfo(mint, endpoint, tokenInfos);
// }

// export function TokenRegistryProvider(props) {
//   const { endpoint } = useConnectionConfig();
//   const [tokenInfos, setTokenInfos] = useState(null);
//   useEffect(() => {
//     const tokenListProvider = new TokenListProvider();
//     tokenListProvider.resolve().then((tokenListContainer) => {
//       const cluster = clusterForEndpoint(endpoint);

//       const filteredTokenListContainer = tokenListContainer?.filterByClusterSlug(
//         cluster?.name,
//       );
//       const tokenInfos =
//         tokenListContainer !== filteredTokenListContainer
//           ? filteredTokenListContainer?.getList()
//           : null; // Workaround for filter return all on unknown slug
//       setTokenInfos(tokenInfos);
//     });
//   }, [endpoint]);

//   return (
//     <TokenListContext.Provider value={{ tokenInfos }}>
//       {props.children}
//     </TokenListContext.Provider>
//   );
// }

// const customTokenNamesByNetwork = JSON.parse(
//   localStorage.getItem('tokenNames') ?? '{}',
// );

// export function getTokenInfo(mint, endpoint, tokenInfos) {
//   if (!mint) {
//     return { name: null, symbol: null };
//   }

//   let info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
//   let match = tokenInfos?.find(
//     (tokenInfo) => tokenInfo.address === mint.toBase58(),
//   );
//   if (match) {
//     if (!info) {
//       info = { ...match, logoUri: match.logoURI };
//     }
//     // The user has overridden a name locally.
//     else {
//       info = { ...info, logoUri: match.logoURI };
//     }
//   }
//   return { ...info };
// }

export function useBalanceInfo(publicKey) {
  let [accountInfo, accountInfoLoaded] = useAccountInfo(publicKey)
  let { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {}
  let [mintInfo, mintInfoLoaded] = useAccountInfo(mint)

  if (!accountInfoLoaded) {
    return null
  }

  if (mint && mint.equals(WRAPPED_SOL_MINT)) {
    return {
      amount,
      decimals: 9,
      mint,
      owner,
      tokenName: 'Wrapped SOL',
      tokenSymbol: 'SOL',
      valid: true,
    }
  }

  if (mint && mintInfoLoaded) {
    try {
      let { decimals } = parseMintData(mintInfo.data)
      return {
        amount,
        decimals,
        mint,
        owner,
        // tokenName: name.replace(' (Sollet)', ''),
        // tokenSymbol: symbol,
        valid: true,
      }
    } catch (e) {
      return {
        amount,
        decimals: 0,
        mint,
        owner,
        tokenName: 'Invalid',
        tokenSymbol: 'INVALID',
        valid: false,
      }
    }
  }

  if (!mint) {
    return {
      amount: accountInfo?.lamports ?? 0,
      decimals: 9,
      mint: null,
      owner: publicKey,
      tokenName: 'SOL',
      tokenSymbol: 'SOL',
      valid: true,
    }
  }

  return null
}

export async function signAndSendTransaction(
  connection,
  transaction,
  wallet,
  signers,
  skipPreflight = false
) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash
  transaction.setSigners(
    // fee payed by the wallet owner
    wallet.publicKey,
    ...signers.map((s) => s.publicKey)
  )

  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }

  transaction = await wallet.signTransaction(transaction)
  const rawTransaction = transaction.serialize()
  return await connection.sendRawTransaction(rawTransaction, {
    skipPreflight,
    preflightCommitment: 'single',
  })
}

export async function createAssociatedTokenAccount({
  connection,
  wallet,
  splTokenMintAddress,
}) {
  const [ix, address] = await createAssociatedTokenAccountIx(
    wallet.publicKey,
    wallet.publicKey,
    splTokenMintAddress
  )
  const tx = new Transaction()
  tx.add(ix)
  tx.feePayer = wallet.publicKey
  const txSig = await signAndSendTransaction(connection, tx, wallet, [])

  return [address, txSig]
}
async function createAssociatedTokenAccountIx(
  fundingAddress,
  walletAddress,
  splTokenMintAddress
) {
  const associatedTokenAddress = await findAssociatedTokenAddress(
    walletAddress,
    splTokenMintAddress
  )
  const systemProgramId = new PublicKey('11111111111111111111111111111111')
  const keys = [
    {
      pubkey: fundingAddress,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: systemProgramId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TokenInstructions.TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ]
  const ix = new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  })
  return [ix, associatedTokenAddress]
}

export async function findAssociatedTokenAddress(
  walletAddress,
  tokenMintAddress
) {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TokenInstructions.TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0]
}
