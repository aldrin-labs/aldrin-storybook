import { SolidoSDK } from '@lidofinance/solido-sdk'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'

import { Page } from '@sb/components/Layout'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { useConnection } from '@sb/dexUtils/connection'
import { useFarmInfo } from '@sb/dexUtils/farming'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useMarinadeStakingInfo } from '@sb/dexUtils/staking/hooks'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import { useWallet } from '@sb/dexUtils/wallet'
import { withPublicKey } from '@sb/hoc'
import { toMap } from '@sb/utils'

import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getStakingInfo as getStakingInfoQuery } from '@core/graphql/queries/staking/getStakingInfo'
import { RIN_MINT, ProgramsMultiton } from '@core/solana'
import { removeDecimals } from '@core/utils/helpers'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'

import CoinsBg from './components/Icons/coins.webp'
import { TableRow } from './components/TableRow'
import {
  ImageContainer,
  StyledWideContent,
  ThinHeading,
  TotalStaked,
  TotalStakedCard,
  TotalStakedRow,
} from './index.styles'
import { StakingPageProps } from './types'
import { getStakingsData } from './utils'

const Block: React.FC<StakingPageProps> = (props) => {
  const {
    getStakingInfoQuery: { getStakingInfo },
    getDexTokensPricesQuery: { getDexTokensPrices = [] },
  } = props

  const [PU238StakeVault, setPU238StakeVault] = useState('')
  const [PLDStakeVault, setPLDStakeVault] = useState('')
  const [RPCStakeVault, setRPCStakeVault] = useState('')
  const [lidoApy, setLidoApy] = useState(0)
  const [lidoMarketcap, setLidoMarketcap] = useState(0)
  const [lidoTotalStaked, setLidoTotalStaked] = useState(0)

  const { wallet } = useWallet()
  const connection = useConnection()

  const { data: mSolInfo, mutate: refreshStakingInfo } =
    useMarinadeStakingInfo()

  const stakingDataMap = toMap(getStakingInfo?.farming || [], (farming) =>
    farming?.stakeMint.toString()
  )

  const { data: farms } = useFarmInfo(stakingDataMap)

  const dexTokensPricesMap = toMap(getDexTokensPrices, (price) => price.symbol)

  const farm = farms?.get(RIN_MINT)

  const RINHarvest = farm?.harvests.find((harvest) => harvest.mint === RIN_MINT)

  const totalStakedWithDecimals = removeDecimals(
    farm?.stakeVaultTokenAmount,
    farm?.stakeVaultDecimals
  )

  const totalStakedWithDecimalsInUSD =
    totalStakedWithDecimals * (dexTokensPricesMap.get('RIN')?.price || 0)

  const stakedPercentage =
    (totalStakedWithDecimalsInUSD /
      (getStakingInfo?.supply || totalStakedWithDecimalsInUSD)) *
    100

  useEffect(() => {
    const getPlutoniansPoolData = async () => {
      const program = ProgramsMultiton.getPlutoniansProgram({
        wallet,
        connection,
      })

      const pools = await program.account.stakingPool.all()
      const stakingVaults = pools.map((pool) => {
        const tokenName = getTokenNameByMintAddress(
          pool.account.stakeTokenMint.toString()
        )
        const stakeVault = pool.account.stakeVault.toString()

        if (tokenName === 'PLD') {
          setPLDStakeVault(stakeVault)
        }

        if (tokenName === 'PU238') {
          setPU238StakeVault(stakeVault)
        }

        if (tokenName === 'RPC') {
          setRPCStakeVault(stakeVault)
        }
      })

      return stakingVaults
    }
    getPlutoniansPoolData()
  }, [])

  const [RPCTotalStaked] = useAccountBalance({
    publicKey: RPCStakeVault ? new PublicKey(RPCStakeVault) : undefined,
  })
  const [PU238TotalStaked] = useAccountBalance({
    publicKey: PU238StakeVault ? new PublicKey(PU238StakeVault) : undefined,
  })
  const [PLDTotalStaked] = useAccountBalance({
    publicKey: PLDStakeVault ? new PublicKey(PLDStakeVault) : undefined,
  })

  const solidoSDK = new SolidoSDK(
    'mainnet-beta',
    connection,
    'LidMA9AeE8ahsUT5QAcv3VtkDWaCapue8bL6prEyBtU'
  )

  useEffect(() => {
    const getStakingData = async () => {
      const { apy, totalStaked, marketCap } =
        await solidoSDK.getLidoStatistics()

      setLidoMarketcap(marketCap)
      setLidoTotalStaked(totalStaked.value)
      setLidoApy(apy)
    }
    getStakingData()
  }, [])

  const stakingsData = getStakingsData({
    farm,
    stakedPercentage,
    RINHarvest,
    mSolInfo,
    PLDTotalStaked,
    RPCTotalStaked,
    PU238TotalStaked,
    dexTokensPricesMap,
    lidoApy,
    lidoMarketcap,
    lidoTotalStaked,
  })

  const totalStaked = stakingsData.reduce((acc, current) => {
    return acc + +current.totalStaked
  }, 0)

  return (
    <Page>
      <StyledWideContent>
        <TotalStakedRow>
          <TotalStakedCard>
            <ThinHeading>Total Staked</ThinHeading>
            <TotalStaked>$ {stripByAmountAndFormat(totalStaked)}</TotalStaked>
          </TotalStakedCard>
          <ImageContainer>
            <img alt="rin" src={CoinsBg} width="100%" height="100%" />
          </ImageContainer>
        </TotalStakedRow>
        {stakingsData.map((staking) => (
          <TableRow
            dexTokensPricesMap={dexTokensPricesMap}
            staking={staking}
            farms={farms}
            mSolInfo={mSolInfo}
            refreshStakingInfo={refreshStakingInfo}
            solidoSDK={solidoSDK}
            lidoTotalStaked={lidoTotalStaked}
            lidoApy={lidoApy}
            lidoMarketcap={lidoMarketcap}
          />
        ))}
      </StyledWideContent>
    </Page>
  )
}

export const StakingPage: any = compose(
  withPublicKey,
  queryRendererHoc({
    query: getDexTokensPricesQuery,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  }),
  queryRendererHoc({
    query: getStakingInfoQuery,
    name: 'getStakingInfoQuery',
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      farmerPubkey: props.publicKey,
    }),
    withoutLoading: true,
    pollInterval: 60000,
  })
)(Block)
