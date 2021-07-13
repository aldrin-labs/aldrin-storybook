const links = [
  {
    name: 'BTC',
    twitterLink: 'https://twitter.com/bitcoin',
    marketCapLink: 'https://coinmarketcap.com/ru/currencies/bitcoin/',
  },
  {
    name: 'ETH',
    twitterLink: 'https://twitter.com/ethereum',
    marketCapLink: 'https://coinmarketcap.com/ru/currencies/ethereum/',
  },
  {
    name: 'FTT',
    twitterLink: 'https://twitter.com/FTX_Official',
    marketCapLink: 'https://coinmarketcap.com/currencies/ftx-token/',
  },
  {
    name: 'YFI',
    twitterLink: 'https://twitter.com/iearnfinance',
    marketCapLink: 'https://coinmarketcap.com/currencies/yearn-finance/',
  },
  {
    name: 'LINK',
    twitterLink: 'https://twitter.com/chainlink',
    marketCapLink: 'https://coinmarketcap.com/currencies/chainlink/',
  },
  {
    name: 'XRP',
    twitterLink: 'https://twitter.com/Ripple',
    marketCapLink: 'https://coinmarketcap.com/currencies/xrp/',
  },
  {
    name: 'USDT',
    twitterLink: 'https://twitter.com/tether_to',
    marketCapLink: 'https://coinmarketcap.com/currencies/tether/',
  },
  {
    name: 'WUSDT',
    twitterLink: 'https://twitter.com/tether_to',
    marketCapLink: 'https://coinmarketcap.com/currencies/tether/',
  },
  {
    name: 'WUSDC',
    twitterLink: '',
    marketCapLink: 'https://coinmarketcap.com/currencies/usd-coin/',
  },
  {
    name: 'USDC',
    twitterLink: '',
    marketCapLink: 'https://coinmarketcap.com/currencies/usd-coin/',
  },
  {
    name: 'MSRM',
    twitterLink: 'https://twitter.com/projectserum',
    marketCapLink: 'https://coinmarketcap.com/currencies/serum-msrm/',
  },
  {
    name: 'SRM',
    twitterLink: 'https://twitter.com/projectserum',
    marketCapLink: 'https://coinmarketcap.com/currencies/serum/',
  },
  {
    name: 'SUSHI',
    twitterLink: 'https://twitter.com/sushiswap',
    marketCapLink: 'https://coinmarketcap.com/currencies/sushiswap/',
  },
  {
    name: 'SXP',
    twitterLink: 'https://twitter.com/SwipeWallet',
    marketCapLink: 'https://coinmarketcap.com/currencies/swipe/',
  },
  {
    name: 'ALEPH',
    twitterLink: 'https://twitter.com/aleph_im',
    marketCapLink: 'https://coinmarketcap.com/currencies/aleph-im/',
  },
  {
    name: 'HGET',
    twitterLink: 'https://twitter.com/team_hedget',
    marketCapLink: 'https://coinmarketcap.com/currencies/hedget/',
  },
  {
    name: 'CREAM',
    twitterLink: 'https://twitter.com/CreamdotFinance',
    marketCapLink: 'https://coinmarketcap.com/currencies/cream-finance/',
  },
  {
    name: 'UBXT',
    twitterLink: 'https://twitter.com/UpBotscom',
    marketCapLink: 'https://coinmarketcap.com/currencies/upbots/',
  },
  {
    name: 'HNT',
    twitterLink: 'https://twitter.com/helium',
    marketCapLink: 'https://coinmarketcap.com/currencies/helium/',
  },
  {
    name: 'FRONT',
    twitterLink: 'https://twitter.com/FrontierDotXYZ',
    marketCapLink: 'https://coinmarketcap.com/currencies/frontier/',
  },
  {
    name: 'AKRO',
    twitterLink: 'https://twitter.com/akropolisio',
    marketCapLink: 'https://coinmarketcap.com/currencies/akropolis/',
  },
  {
    name: 'HXRO',
    twitterLink: 'https://twitter.com/RealHxro',
    marketCapLink: 'https://coinmarketcap.com/currencies/hxro/',
  },
  {
    name: 'UNI',
    twitterLink: 'https://twitter.com/Uniswap',
    marketCapLink: 'https://coinmarketcap.com/currencies/uniswap/',
  },
  {
    name: 'KEEP',
    twitterLink: 'https://twitter.com/keep_project',
    marketCapLink: 'https://coinmarketcap.com/currencies/keep-network/',
  },
  {
    name: 'MATH',
    twitterLink: 'https://twitter.com/Mathwallet',
    marketCapLink: 'https://coinmarketcap.com/currencies/math/',
  },
  {
    name: 'SOL',
    twitterLink: 'https://twitter.com/solana',
    marketCapLink: 'https://coinmarketcap.com/currencies/solana/',
  },
  {
    name: 'TOMO',
    twitterLink: 'https://twitter.com/TomoChainANN',
    marketCapLink: 'https://coinmarketcap.com/currencies/tomochain/',
  },
  {
    name: 'LUA',
    twitterLink: 'https://twitter.com/LuaSwap',
    marketCapLink: 'https://coinmarketcap.com/currencies/lua-token/',
    undefined: 'Exchange',
  },
  {
    name: 'SWAG',
    twitterLink: 'https://twitter.com/swag_finance',
    marketCapLink: 'https://coinmarketcap.com/currencies/swag-finance/',
    undefined: 'Yield',
  },
  {
    name: 'FIDA',
    twitterLink: 'https://twitter.com/bonfida',
    marketCapLink: 'https://coinmarketcap.com/currencies/bonfida/',
  },
  {
    name: 'KIN',
    twitterLink: 'https://twitter.com/kin_ecosystem',
    marketCapLink: 'https://coinmarketcap.com/currencies/kin/',
  },
  {
    name: 'MAPS',
    twitterLink: 'https://twitter.com/MAPS_ME',
    marketCapLink: 'https://coinmarketcap.com/currencies/maps/',
  },
  {
    name: 'OXY',
    twitterLink: 'https://twitter.com/Oxygen_protocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/oxygen/',
  },
  {
    name: 'RAY',
    twitterLink: 'https://twitter.com/raydiumprotocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/raydium/',
  },
  {
    name: 'xCOPE',
    twitterLink: 'https://twitter.com/cyrii_MM',
    marketCapLink: 'https://coinmarketcap.com/currencies/cope/',
  },
  {
    name: 'AAVE',
    twitterLink: 'https://twitter.com/AaveAave',
    marketCapLink: 'https://coinmarketcap.com/currencies/aave/',
    undefined: 'Yield',
  },
  {
    name: 'CEL',
    twitterLink: 'https://twitter.com/celsiusnetwork',
    marketCapLink: 'https://coinmarketcap.com/currencies/celsius/',
  },
  {
    name: 'RSR',
    twitterLink: 'https://twitter.com/reserveprotocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/reserve-rights/',
    undefined: 'DeFi',
  },
  {
    name: 'TRYB',
    twitterLink: 'https://twitter.com/BiLira_Official',
    marketCapLink: 'https://coinmarketcap.com/currencies/bilira/',
  },
  {
    name: 'COPE',
    twitterLink: 'https://twitter.com/cyrii_MM',
    marketCapLink: 'https://coinmarketcap.com/currencies/cope/',
  },
  {
    name: 'MER',
    twitterLink: 'https://twitter.com/MercurialFi',
    marketCapLink: 'https://coinmarketcap.com/currencies/mercurial-finance/',
  },
  {
    name: 'CCAI',
    twitterLink: 'https://twitter.com/CCAI_Official',
    marketCapLink: 'https://www.coingecko.com/en/coins/cryptocurrencies-ai',
  },
  {
    name: 'EOSBEAR',
    twitterLink: 'https://twitter.com/block_one_',
    marketCapLink: 'https://coinmarketcap.com/currencies/x-short-eos-token/',
  },
  {
    name: 'EOSBULL',
    twitterLink: 'https://twitter.com/block_one_',
    marketCapLink: 'https://coinmarketcap.com/currencies/x-long-eos-token/',
  },
  {
    name: 'BNBBEAR',
    twitterLink: 'https://twitter.com/binance',
    marketCapLink: 'https://coinmarketcap.com/currencies/x-short-bnb-token/',
  },
  {
    name: 'BNBBULL',
    twitterLink: 'https://twitter.com/binance',
    marketCapLink: 'https://coinmarketcap.com/currencies/x-long-bnb-token/',
  },
  {
    name: 'BSVBULL',
    twitterLink: 'https://twitter.com/BitcoinAssn',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-bitcoin-sv-token/',
  },
  {
    name: 'BSVBEAR',
    twitterLink: 'https://twitter.com/BitcoinAssn',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-bitcoin-sv-token/',
  },
  {
    name: 'LTCBEAR',
    twitterLink: 'https://twitter.com/LitecoinProject',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-litecoin-token/',
  },
  {
    name: 'LTCBULL',
    twitterLink: 'https://twitter.com/LitecoinProject',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-litecoin-token/',
  },
  {
    name: 'BULL',
    twitterLink: 'https://twitter.com/bitcoin',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-bitcoin-token/',
  },
  {
    name: 'BEAR',
    twitterLink: 'https://twitter.com/bitcoin',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-bitcoin-token/',
  },
  {
    name: 'BCHBEAR',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-bitcoin-cash-token/',
  },
  {
    name: 'BCHBULL',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-Long-bitcoin-cash-token/',
  },
  {
    name: 'ETHBULL',
    twitterLink: 'https://twitter.com/ethereum',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-ethereum-token/',
  },
  {
    name: 'ETHBEAR',
    twitterLink: 'https://twitter.com/ethereum',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-ethereum-token/',
  },
  {
    name: 'ALTBULL',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-altcoin-index-token/',
  },
  {
    name: 'ALTBEAR',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-altcoin-index-token/',
  },
  {
    name: 'BULLSHIT',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-shitcoin-index-token/',
  },
  {
    name: 'BEARSHIT',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-shitcoin-index-token/',
  },
  {
    name: 'MIDBULL',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-midcap-index-token/',
  },
  {
    name: 'MIDBEAR',
    twitterLink: '',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-short-midcap-index-token/',
  },
  {
    name: 'LINKBEAR',
    twitterLink: 'https://twitter.com/chainlink',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-Short-chainlink-token/',
  },
  {
    name: 'LINKBULL',
    twitterLink: 'https://twitter.com/chainlink',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-chainlink-token/',
  },
  {
    name: 'XRPBULL',
    twitterLink: 'https://twitter.com/Ripple',
    marketCapLink: 'https://coinmarketcap.com/currencies/x-long-xrp-token/',
  },
  {
    name: 'XRPBEAR',
    twitterLink: 'https://twitter.com/Ripple',
    marketCapLink: 'https://coinmarketcap.com/currencies/x-short-xrp-token/',
  },
  {
    name: 'ODOP',
    twitterLink: '',
    marketCapLink: 'https://www.coingecko.com/en/coins/odop',
  },
  {
    name: 'BVOL',
    twitterLink: 'https://twitter.com/bitcoin',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-bitcoin-implied-volatility-token/',
  },
  {
    name: 'IBVOL',
    twitterLink: 'https://twitter.com/bitcoin',
    marketCapLink:
      'https://coinmarketcap.com/currencies/inverse-bitcoin-volatility-token/',
  },
  {
    name: 'AAVE',
    twitterLink: 'https://twitter.com/AaveAave',
    marketCapLink: 'https://coinmarketcap.com/currencies/aave/',
  },
  {
    name: 'LQID',
    twitterLink: 'https://twitter.com/liquid_global',
    marketCapLink: '',
  },
  {
    name: 'SECO',
    twitterLink: 'https://twitter.com/projectserum',
    marketCapLink:
      'https://coinmarketcap.com/currencies/serum-ecosystem-token/',
  },
  {
    name: 'HOLY',
    twitterLink: 'https://twitter.com/FTX_official',
    marketCapLink: 'https://coinmarketcap.com/currencies/holy-trinity/',
  },
  {
    name: 'CEL',
    twitterLink: 'https://twitter.com/celsiusnetwork',
    marketCapLink: 'https://coinmarketcap.com/currencies/celsius/',
  },
  {
    name: 'RSR',
    twitterLink: 'https://twitter.com/reserveprotocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/reserve-rights/',
  },
  {
    name: '1INCH',
    twitterLink: 'https://twitter.com/1inch',
    marketCapLink: 'https://coinmarketcap.com/currencies/1inch/',
  },
  {
    name: 'GRT',
    twitterLink: 'https://twitter.com/graphprotocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/the-graph/',
  },
  {
    name: 'COMP',
    twitterLink: 'https://twitter.com/compoundfinance',
    marketCapLink: 'https://coinmarketcap.com/currencies/compound/',
  },
  {
    name: 'PAXG',
    twitterLink: 'https://twitter.com/paxosglobal',
    marketCapLink: 'https://coinmarketcap.com/currencies/pax-gold/',
  },
  {
    name: 'TRYB',
    twitterLink: 'https://twitter.com/BiLira_Official',
    marketCapLink: 'https://coinmarketcap.com/currencies/bilira/',
  },
  {
    name: 'APESZN_HOODIE',
    twitterLink: '',
  },
  {
    name: 'APESZN_TEE_SHIRT',
    twitterLink: '',
  },
  {
    name: 'DOGEBULL',
    twitterLink: 'https://twitter.com/dogecoin',
    marketCapLink:
      'https://coinmarketcap.com/currencies/x-long-dogecoin-token/',
  },
  {
    name: 'MAPSPOOL',
    twitterLink: '',
    marketCapLink: '',
  },
  {
    name: 'MAPS',
    twitterLink: 'https://twitter.com/MAPS_ME',
    marketCapLink: 'https://coinmarketcap.com/currencies/maps/',
  },
  {
    name: 'OXYPOOL',
    twitterLink: '',
    marketCapLink: '',
  },
  {
    name: 'PERP',
    twitterLink: 'https://twitter.com/perpprotocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/perpetual-protocol/',
  },
  {
    name: 'RAYPOOL',
    twitterLink: '',
    marketCapLink: '',
  },
  {
    name: 'RAY',
    twitterLink: 'https://twitter.com/raydiumprotocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/raydium/',
  },
  {
    name: 'OXY',
    twitterLink: 'https://twitter.com/Oxygen_protocol',
    marketCapLink: 'https://coinmarketcap.com/currencies/oxygen/',
  },
  {
    name: 'LIEN',
    twitterLink: 'https://twitter.com/LienFinance',
    marketCapLink: 'https://coinmarketcap.com/currencies/lien/',
  },
  {
    name: 'ROPE',
    twitterLink: 'https://twitter.com/rope_official',
    marketCapLink: 'https://coinmarketcap.com/currencies/rope-token/',
  },
  {
    name: 'STEP',
    twitterLink: 'https://twitter.com/stepfinance_',
    marketCapLink: 'https://coinmarketcap.com/currencies/step-finance/',
  },
  {
    name: 'SAMO',
    twitterLink: 'https://twitter.com/samoyedcoin',
    marketCapLink: 'https://coinmarketcap.com/currencies/somoyedcoin/',
  },
  {
    name: 'MEDIA',
    twitterLink: 'https://twitter.com/Media_FDN',
    marketCapLink: 'https://coinmarketcap.com/currencies/media-network/',
  },
  {
    name: 'TULIP',
    twitterLink: 'https://twitter.com/Solfarmio',
    marketCapLink: 'https://coinmarketcap.com/currencies/solfarm/',
  },
  {
    name: 'MER',
    twitterLink: 'https://twitter.com/MercurialFi',
    marketCapLink: 'https://coinmarketcap.com/currencies/mercurial-finance/',
  },
  {
    name: 'MERPOOL',
    twitterLink: '',
    marketCapLink: '',
  },
  {
    name: 'SLIM',
    twitterLink: 'https://twitter.com/solanium_io',
    marketCapLink: 'https://coinmarketcap.com/currencies/solanium/',
  },
  {
    name: 'FTR',
    twitterLink: 'https://www.twitter.com/ftr_finance',
    marketCapLink: '',
  },
  {
    name: 'SNY',
    twitterLink: 'https://twitter.com/synthetify',
    marketCapLink: 'https://coinmarketcap.com/currencies/synthetify/',
  },
  {
    name: 'LIQ',
    twitterLink: 'https://twitter.com/liqprotocol',
    marketCapLink: 'https://www.coingecko.com/en/coins/liq-protocol',
  },
  {
    name: 'BOP',
    twitterLink: 'https://twitter.com/BoringProtocol',
    marketCapLink: 'https://www.coingecko.com/en/coins/boring-protocol',
  },
  {
    name: 'TGT',
    twitterLink: 'https://twitter.com/twirlfinance',
    marketCapLink: '',
  },
  {
    name: 'WOO',
    twitterLink: 'https://twitter.com/wootraderS',
    marketCapLink: 'https://coinmarketcap.com/currencies/wootrade/',
  },
  {
    name: 'CATO',
    twitterLink: 'https://twitter.com/SolanaCATO',
    marketCapLink: 'https://www.coingecko.com/en/coins/cato',
  },
  {
    name: 'FAB',
    twitterLink: 'https://twitter.com/official_fabric',
    marketCapLink: 'https://www.coingecko.com/en/coins/fabric',
  },
  {
    name: 'DGX',
    twitterLink: 'https://twitter.com/dgxsolana',
    marketCapLink: '',
  },
  {
    name: 'PARTI',
    twitterLink: 'https://twitter.com/ParticleFinance',
    marketCapLink: '',
  },
  {
    name: 'SAIL',
    twitterLink: 'https://twitter.com/SolanaSail',
    marketCapLink: 'https://coinmarketcap.com/currencies/solanasail/',
  },
  {
    name: 'BOLE',
    twitterLink: 'https://twitter.com/boletoken',
    marketCapLink: 'https://www.coingecko.com/en/coins/bole-token',
  },
  {
    name: 'SOLAPE',
    twitterLink: 'https://twitter.com/SolApeFinance',
    marketCapLink: 'https://coinmarketcap.com/currencies/solapefinance/',
  },
  {
    name: 'SLRS',
    twitterLink: 'https://twitter.com/SolriseFinance',
    marketCapLink: 'https://coinmarketcap.com/currencies/solrise-finance/',
  },
]

const tokensLinksMap = new Map()
links.forEach((el) => tokensLinksMap.set(el.name, el))

export default tokensLinksMap
