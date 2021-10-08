const categoriesOfMarkets = [
  'DeFi',
  'Currency',
  'Oracle',
  'Farm & Agregator',
  'Trade & Liquidity',
  'Meme & Social',
  'dApp',
  'Lending & Yield',
  'Infrastructure',
  'Exchange & Derivatives',
  'Leveraged Tokens',
  'NFT, Games & Gambling',
]

const defaultRequestDataState = {
  baseTokenName: '',
  quoteTokenName: '',
  marketID: '',
  twitterLink: '',
  coinMarketCapLink: '',
  category: [],
  defiShow: 'No',
  contact: '',
}

export { categoriesOfMarkets, defaultRequestDataState }
