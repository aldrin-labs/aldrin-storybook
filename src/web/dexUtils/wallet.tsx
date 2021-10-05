import Mathwallet from '@icons/mathwallet.svg'
import WalletAldrin from '@icons/RINLogo.svg'
import Sollet from '@icons/sollet.svg'
import Solong from '@icons/solong.svg'
import { TokenInstructions } from '@project-serum/serum'
import Wallet from '@project-serum/sol-wallet-adapter'
import {
  CommonWalletAdapter,
  LedgerWalletAdapter, MathWalletAdapter,
  PhantomWalletAdapter, SolletExtensionAdapter, SolongWalletAdapter
} from '@sb/dexUtils/adapters'
import { WalletAdapter } from '@sb/dexUtils/types'
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { log } from '../utils/logger'
import { Coin98WalletAdapter } from './adapters/Coin98WalletAdapter'
import { SolflareExtensionWalletAdapter } from './adapters/SolflareWallet'
import {
  useAccountInfo,
  useConnection,
  useConnectionConfig
} from './connection'
import { useAsyncData } from './fetch-loop'
import { _VERY_SLOW_REFRESH_INTERVAL } from './markets'
import { notify } from './notifications'
import { getMaxWithdrawAmount } from './pools'
import {
  getTokenAccountInfo,
  MINT_LAYOUT,
  parseTokenAccountData
} from './tokens'
import { CCAIProviderURL, useLocalStorageState, useRefEqual } from './utils'


export const WALLET_PROVIDERS = [
  // { name: 'solflare.com', url: 'https://solflare.com/access-wallet' },
  {
    name: 'Wallet™',
    url: CCAIProviderURL,
    adapter: CommonWalletAdapter,
    isExtension: false,
    showOnMobile: true,
    icon: WalletAldrin,
  },
  // {
  //   name: 'Wallet™ Extension',
  //   url: `${CCAIProviderURL}/extension`,
  //   adapter: CcaiExtensionAdapter,
  //   isExtension: true,
  //   showOnMobile: false,
  //   icon: WalletAldrin,
  // },
  {
    name: 'Sollet.io',
    url: 'https://www.sollet.io',
    adapter: CommonWalletAdapter,
    icon: Sollet,
    isExtension: false,
    showOnMobile: true,
  },
  {
    name: 'Sollet Extension',
    url: 'https://www.sollet.io/extension',
    adapter: SolletExtensionAdapter,
    icon: Sollet,
    isExtension: true,
    showOnMobile: false,
  },
  {
    name: 'Ledger',
    url: 'https://www.ledger.com',
    icon: `https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets/ledger.svg`,
    adapter: LedgerWalletAdapter,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'Phantom',
    url: 'https://www.phantom.app',
    icon: `https://www.phantom.app/img/logo.png`,
    adapter: PhantomWalletAdapter,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'MathWallet',
    url: 'https://www.mathwallet.org',
    adapter: MathWalletAdapter,
    icon: Mathwallet,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'Solong',
    url: 'https://solongwallet.com',
    adapter: SolongWalletAdapter,
    icon: Solong,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'Coin98',
    url: 'https://wallet.coin98.com/',
    adapter: Coin98WalletAdapter,
    icon: `https://gblobscdn.gitbook.com/spaces%2F-MLfdRENhXE4S22AEr9Q%2Favatar-1616412978424.png`,
    isExtension: true,
    showOnMobile: true,
  },
  {
    name: 'Solflare',
    url: 'https://solflare.com/',
    adapter: SolflareExtensionWalletAdapter,
    icon: `https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets/solflare.svg`,
    isExtension: true,
    showOnMobile: true,
  },
]

export const MAINNET_URL = 'https://api.mainnet-beta.solana.com'

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)

export const WRAPPED_SOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112'
)


export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

export interface WalletContextType {
  wallet: WalletAdapter
  connected: boolean
  providerUrl: string
  setProviderUrl: (newState: string) => void
  setAutoConnect: (autoConnect: boolean) => void
  providerName: string
}

const WalletContext = React.createContext<WalletContextType | null>(null)

interface WalletProviderType {
  children?: JSX.Element
}

export function WalletProvider({ children }: WalletProviderType) {
  const { endpoint } = useConnectionConfig()

  const [connected, setConnected] = useLocalStorageState('walletConnected', false)
  const [autoConnect, setAutoConnect] = useState(connected)

  const [providerUrl, setProviderUrl] = useLocalStorageState(
    'walletProvider',
    CCAIProviderURL
  )

  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
    [providerUrl]
  )


  const wallet = useMemo(() => {
    const wallet = new (provider?.adapter || Wallet)(
      providerUrl,
      endpoint
    ) as WalletAdapter

    return wallet
  }, [provider, endpoint])

  const connectWalletHash = useMemo(() => window.location.hash, [
    wallet?.connected,
  ])

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', async () => {
        if (wallet?.publicKey && !wallet?.publicKey?.equals(SystemProgram.programId)) {
          log('Wallet connected')

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
      if (wallet?.disconnect) {
        wallet.disconnect()
      }
    }
  }, [wallet])

  useEffect(() => {
    if (wallet && autoConnect) {
      if (!wallet.connected) {
        wallet.connect()
      }
      setAutoConnect(false)
    }
  }, [wallet, autoConnect])

  useEffect(() => {
    if (wallet && connectWalletHash === '#connect_wallet') {
      setProviderUrl(CCAIProviderURL)
      wallet?.connect()
    }
  }, [wallet])

  const context: WalletContextType = {
    wallet,
    connected,
    providerUrl,
    setProviderUrl,
    setAutoConnect,
    providerName:
      WALLET_PROVIDERS.find(({ url }) => url === providerUrl)?.name ??
      providerUrl,
  }
  return (
    <WalletContext.Provider
      value={context}
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
  return context
}

export function useWalletPublicKeys(): [PublicKey[], boolean] {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [tokenAccountInfo, loaded] = useAsyncData(
    () => getTokenAccountInfo(connection, wallet.publicKey),
    'getTokenAccountInfo',
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
  )

  let publicKeys = (tokenAccountInfo || []).map(({ pubkey }: { pubkey: PublicKey }) => pubkey)

  // Prevent users from re-rendering unless the list of public keys actually changes
  publicKeys = useRefEqual(
    publicKeys,
    (oldKeys, newKeys) =>
      oldKeys.length === newKeys.length &&
      oldKeys.every((key, i) => key.equals(newKeys[i]))
  )
  return [publicKeys, loaded]
}

interface MaxWithdrawalAmountType {
  poolTokenAmount: number
  tokenSwapPublicKey: PublicKey
}

export function useMaxWithdrawalAmounts({
  poolTokenAmount,
  tokenSwapPublicKey,
}: MaxWithdrawalAmountType) {
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

export function parseMintData(data: Buffer) {
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
  skipPreflight = false,
  focusPopup = false
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

  transaction = await wallet.signTransaction(transaction, focusPopup)
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
  const txSig = await signAndSendTransaction(
    connection,
    tx,
    wallet,
    [],
    false,
    true
  )

  return [address, txSig]
}
export async function createAssociatedTokenAccountIx(
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
