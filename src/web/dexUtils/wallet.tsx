import { TokenInstructions } from '@project-serum/serum'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import { WalletAdapter } from '@sb/dexUtils/types'

import { WALLET_PROVIDERS, getMaxWithdrawAmount } from '@core/solana'

import {
  useAccountInfo,
  useConnection,
  useConnectionConfig,
} from './connection'
import { useAsyncData } from './fetch-loop'
import { _VERY_SLOW_REFRESH_INTERVAL } from './markets'
import { notify } from './notifications'
import {
  getTokenAccountInfo,
  MINT_LAYOUT,
  parseTokenAccountData,
} from './tokens'
import { signAndSendSingleTransaction } from './transactions'
import { RINProviderURL, useLocalStorageState, useRefEqual } from './utils'

export const WRAPPED_SOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112'
)

export const MAINNET_URL = 'https://api.mainnet-beta.solana.com'

export interface WalletContextType {
  wallet: WalletAdapter
  connected: boolean
  providerUrl: string
  setProviderUrl: (newState: string) => void
  setAutoConnect: (autoConnect: boolean) => void
  providerName: string
}

const WalletContext = React.createContext<WalletContextType | null>(null)

export const WalletProvider: React.FC = ({ children }) => {
  const { endpoint } = useConnectionConfig()

  const [connectedPersist, setConnectedPersist] = useLocalStorageState(
    'walletConnectedUpdatedFinally',
    false
  )
  const [connected, setConnected] = useState(false)
  const [autoConnect, setAutoConnect] = useState(connectedPersist)

  const [providerUrl, setProviderUrl] = useLocalStorageState(
    'walletProvider',
    RINProviderURL
  )

  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
    [providerUrl]
  )

  const wallet = useMemo(
    () => provider?.adapter(providerUrl, endpoint) as any as WalletAdapter,
    [provider, endpoint]
  )

  const connectWalletHash = useMemo(
    () => window.location.hash,
    [wallet?.connected]
  )

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', async () => {
        if (
          wallet?.publicKey &&
          !wallet?.publicKey?.equals(SystemProgram.programId)
        ) {
          console.log('Wallet connected')

          setConnectedPersist(true)
          setConnected(true)

          const walletPublicKey = wallet?.publicKey.toBase58()
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
            description: `Connected to wallet ${keyToDisplay}`,
          })
        }
      })

      wallet.on('disconnect', (...args) => {
        setTimeout(() => {
          // Prevent execution on tab close/reload
          setConnectedPersist(false)
          setConnected(false)
          notify({
            message: 'Wallet update',
            description: 'Disconnected from wallet',
          })
        }, 300)
      })
    }

    // Disable disconnect - it happens only on tab close/page reload, let's save last connection
    // return () => {
    //   setConnected(false)
    //   if (wallet?.disconnect) {
    //     wallet.disconnect()
    //   }
    // }
  }, [wallet])

  useEffect(() => {
    setTimeout(() => {
      // Allow app to start (initialize) properly
      if (wallet && autoConnect) {
        if (!wallet.connected) {
          wallet.connect()
        }
        setAutoConnect(false)
      }
    }, 300)
  }, [wallet, autoConnect])

  useEffect(() => {
    if (wallet && connectWalletHash === '#connect_wallet') {
      setProviderUrl(RINProviderURL)
      wallet?.connect()
    }
  }, [wallet])

  const w = WALLET_PROVIDERS.find(({ url }) => url === providerUrl)

  const context: WalletContextType = {
    wallet,
    connected,
    providerUrl,
    setProviderUrl,
    setAutoConnect,
    providerName: w?.name ?? providerUrl,
  }
  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
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
    'getTokenAccountInfo',
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
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
    `getMaxWithdrawAmount-${tokenSwapPublicKey.toString()}`
  )

  return [withdrawalAmounts, loaded]
}

export function parseMintData(data) {
  const { decimals } = MINT_LAYOUT.decode(data)
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
  const { data: accountInfo, isLoading: accountInfoLoading } =
    useAccountInfo(publicKey)

  const { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {}
  const { data: mintInfo, isLoading: mintInfoLoading } = useAccountInfo(mint)

  if (accountInfoLoading) {
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

  if (mint && !mintInfoLoading) {
    try {
      const { decimals } = parseMintData(mintInfo.data)
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
  const txSig = await signAndSendSingleTransaction({
    connection,
    transaction: tx,
    wallet,
    signers: [],
  })

  return [address, txSig]
}
export async function createAssociatedTokenAccountIx(
  fundingAddress: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
): Promise<[TransactionInstruction, PublicKey]> {
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

export { WALLET_PROVIDERS }
