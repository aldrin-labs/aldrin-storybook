import { BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'

export interface FarmingState {
  farmingState: string
  farmingTokenVault: string
  farmingTokenMint: string
  farmingTokenMintDecimals: number
  farmingSnapshots: string
  tokensUnlocked: number
  tokensTotal: number
  startTime: number
  currentTime: number | null
  tokensPerPeriod: number
  periodLength: number
  vestingPeriod: number
  feesDistributed?: boolean
}

export type RawPool = {
  pubkey: PublicKey
  programId: PublicKey
  providerId: string
  poolToken: PublicKey
  tokenAccountA: PublicKey
  tokenAccountB: PublicKey
  mintA: PublicKey
  mintB: PublicKey
  poolSigner: PublicKey
  fees: {
    tradeFeeNumerator: BN
    tradeFeeDenominator: BN
    ownerTradeFeeNumerator: BN
    ownerTradeFeeDenominator: BN
    ownerWithdrawFeeNumerator: BN
    ownerWithdrawFeeDenominator: BN
  }
  curveType?: any
  lpTokenFreezeVault: PublicKey
  initializerAccount: PublicKey
  feePoolTokenAccount?: PublicKey
  curve?: any
  extra: any
}

export type PoolsBasicInfoType = {
  programId: string

  name: string
  fees: {
    tradeFeeNumerator: number
    ownerTradeFeeNumerator: number
    tradeFeeDenominator: number
    ownerTradeFeeDenominator: number
  }
  tokenA: string
  tokenB: string
  tvl: {
    tokenA: string
    tokenB: string
  }
  supply: number
  farming: FarmingState[] | null
  poolTokenAccountA: string
  poolTokenAccountB: string
  lpTokenFreezeVaultBalance: string
  lpTokenFreezeVault: PublicKey

  parsedName: string
  tokenSwap: string
  swapToken: string

  apy24h?: number

  poolAddress: string
  poolToken: string

  providerId: string
  poolSigner: string
  poolTokenMint: string

  mintA: string
  mintB: string

  tokenAccountA: PublicKey
  tokenAccountB: PublicKey

  curveType: any | null
  initializerAccount: string
  feePoolTokenAccount?: PublicKey

  rawPoolData: RawPool
  updateTime: number
}

export type PoolsInfoBalancesType = {
  tokenADecimals: number
  tokenBDecimals: number
  tokenAmountA: BN
  tokenAmountB: BN
  tokenABalance: string
  tokenBBalance: string
  tokenABalanceExtended: {
    amount: string
    decimals: number
    uiAmountString: string
  }
  tokenBBalanceExtended: {
    amount: string
    decimals: number
    uiAmountString: string
  }
}

export type PoolsInfoType = PoolsBasicInfoType & PoolsInfoBalancesType

export type GetMultipleAccountsJsonResponse = {
  jsonrpc: string
  result: {
    context: {
      apiVersion: string
      slot: number
    }
    value: GetAccountInfoJsonResponse[]
  }
  id: string
}

export type GetAccountInfoJsonResponse = {
  data: {
    parsed: {
      info: ParsedAccountInfo
      type: string
    }
    program: string
    space: number
  }
  executable: boolean
  lampots: number
  owner: string
  rentEpoch: number
}

export type ParsedAccountInfo = {
  mintAuthority: string
  supply: number
  decimals: number

  isNative: boolean
  mint: string
  owner: string
  state: string
  tokenAmount: {
    amount: string
    decimals: number
    uiAmount: number
    uiAmountString: string
  }
}

export type PoolsBalancesMapType = {
  [owner: string]: {
    [mint: string]: ParsedAccountInfo
  }
}
