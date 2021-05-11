import React, { useContext, useEffect, useMemo, useState } from 'react'
import Wallet from '@project-serum/sol-wallet-adapter'
import {
  SolongWalletAdapter,
  SolletExtensionAdapter,
  MathWalletAdapter,
  CcaiWalletAdapter,
  CcaiExtensionAdapter,
} from '@sb/dexUtils/adapters'
import { notify } from './notifications'
import { useAccountInfo, useConnectionConfig } from './connection'
import { CCAIProviderURL, useLocalStorageState } from './utils'
import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import { MINT_LAYOUT, parseTokenAccountData } from './tokens'
import Sollet from '@icons/sollet.svg'
import Mathwallet from '@icons/mathwallet.svg'
import Solong from '@icons/solong.svg'
import CCAI from '@icons/ccai.svg'
import { TokenInstructions } from '@project-serum/serum'
import { WalletAdapter } from './adapters'

export const WALLET_PROVIDERS = [
  // { name: 'solflare.com', url: 'https://solflare.com/access-wallet' },
  {
    name: 'Wallet™',
    url: CCAIProviderURL,
    adapter: Wallet,
    icon: CCAI,
  },
  {
    name: 'Wallet™ Extension',
    url: `${CCAIProviderURL}/extension`,
    adapter: CcaiExtensionAdapter,
    icon: CCAI,
  },
  {
    name: 'Sollet.io',
    url: 'https://www.sollet.io',
    adapter: Wallet,
    icon: Sollet,
  },
  {
    name: 'Sollet Extension',
    url: 'https://www.sollet.io/extension',
    adapter: SolletExtensionAdapter,
    icon: Sollet,
  },
  // {
  //   name: 'MathWallet',
  //   url: 'https://www.mathwallet.org',
  //   adapter: MathWalletAdapter,
  //   icon: Mathwallet,
  // },
  {
    name: 'Solong',
    url: 'https://solongwallet.com',
    adapter: SolongWalletAdapter,
    icon: Solong,
  },
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

const WalletContext = React.createContext(null)

export function WalletProvider({ children }) {
  const { endpoint } = useConnectionConfig()

  const [autoConnect, setAutoConnect] = useState(false)
  const [providerUrl, setProviderUrl] = useLocalStorageState(
    'walletProvider',
    CCAIProviderURL
  )

  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
    [providerUrl]
  )

  // let [wallet, setWallet] = useState<WalletAdapter | undefined>(
  //   new Wallet(providerUrl, endpoint)
  // )

  // useEffect(() => {
  //   if (provider) {
  //     const updateWallet = () => {
  //       // hack to also update wallet synchronously in case it disconnects
  //       // eslint-disable-next-line react-hooks/exhaustive-deps
  //       wallet = new (provider.adapter || Wallet)(
  //         providerUrl,
  //         endpoint
  //       ) as WalletAdapter
  //       setWallet(wallet)
  //     }

  //     if (document.readyState !== 'complete') {
  //       // wait to ensure that browser extensions are loaded
  //       const listener = () => {
  //         updateWallet()
  //         window.removeEventListener('load', listener)
  //       }
  //       window.addEventListener('load', listener)
  //       return () => window.removeEventListener('load', listener)
  //     } else {
  //       updateWallet()
  //     }
  //   }

  //   return () => {}
  // }, [provider, providerUrl, endpoint])

  const [connected, setConnected] = useState(false)

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
        if (wallet?.publicKey) {
          console.log('connected')
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
    if (wallet && connectWalletHash === '#connect_wallet') {
      setProviderUrl(CCAIProviderURL)
      wallet?.connect()
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
