import { TokenInstructions } from '@project-serum/serum'
import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import {
  CommonWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SolletExtensionAdapter,
  SolongWalletAdapter,
  SlopeWalletAdapter,
} from '@sb/dexUtils/adapters'

import Mathwallet from '@icons/mathwallet.svg'
import WalletAldrin from '@icons/RINLogo.svg'
import Slope from '@icons/slope.svg'
import Sollet from '@icons/sollet.svg'
import Solong from '@icons/solong.svg'

import { Coin98WalletAdapter } from './adapters/Coin98WalletAdapter'
import { SolflareExtensionWalletAdapter } from './adapters/SolflareWallet'
import { useAccountInfo } from './connection'
import { MINT_LAYOUT, parseTokenAccountData } from './tokens'
import { signAndSendSingleTransaction } from './transactions'
import { RINProviderURL } from './utils'

export const WALLET_PROVIDERS = [
  // { name: 'solflare.com', url: 'https://solflare.com/access-wallet' },
  {
    name: 'Wallet™',
    fullName: 'Wallet™ by Aldrin.com',
    url: RINProviderURL,
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
    fullName: 'Wallet™ by Aldrin.com',
    url: 'https://www.sollet.io',
    adapter: CommonWalletAdapter,
    icon: Sollet,
    isExtension: false,
    showOnMobile: true,
  },
  {
    name: 'Sollet Extension',
    fullName: 'Sollet Extension Wallet',
    url: 'https://www.sollet.io/extension',
    adapter: SolletExtensionAdapter,
    icon: Sollet,
    isExtension: true,
    showOnMobile: false,
  },
  {
    name: 'Ledger',
    fullName: 'Ledger Wallet',
    url: 'https://www.ledger.com',
    icon: `https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets/ledger.svg`,
    adapter: LedgerWalletAdapter,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'Phantom',
    fullName: 'Phantom Wallet',
    url: 'https://www.phantom.app',
    icon: `https://www.phantom.app/img/logo.png`,
    adapter: PhantomWalletAdapter,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'MathWallet',
    fullName: 'MathWallet',
    url: 'https://www.mathwallet.org',
    adapter: MathWalletAdapter,
    icon: Mathwallet,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'Solong',
    fullName: 'Solong Wallet',
    url: 'https://solongwallet.com',
    adapter: SolongWalletAdapter,
    icon: Solong,
    isExtension: false,
    showOnMobile: false,
  },
  {
    name: 'Coin98',
    fullName: 'Coin98 Wallet',
    url: 'https://wallet.coin98.com/',
    adapter: Coin98WalletAdapter,
    icon: `https://gblobscdn.gitbook.com/spaces%2F-MLfdRENhXE4S22AEr9Q%2Favatar-1616412978424.png`,
    isExtension: true,
    showOnMobile: true,
  },
  {
    name: 'Solflare',
    fullName: 'Solflare Wallet',
    url: 'https://solflare.com/',
    adapter: SolflareExtensionWalletAdapter,
    icon: `https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets/solflare.svg`,
    isExtension: true,
    showOnMobile: true,
  },
  {
    name: 'Slope',
    fullName: 'Slope Wallet',
    url: 'https://slope.finance/',
    adapter: SlopeWalletAdapter,
    icon: Slope,
    isExtension: true,
    showOnMobile: false,
  },
]

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)

export const WRAPPED_SOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112'
)

export const MAINNET_URL = 'https://api.mainnet-beta.solana.com'

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

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
  const [accountInfo, accountInfoLoaded] = useAccountInfo(publicKey)
  const { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {}
  const [mintInfo, mintInfoLoaded] = useAccountInfo(mint)

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
