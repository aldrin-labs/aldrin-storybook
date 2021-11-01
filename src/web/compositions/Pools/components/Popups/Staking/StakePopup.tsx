import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'

import { Button } from '../../Tables/index.styles'
import { InputWithCoins } from '../components'
import { HintContainer } from './styles'
import { ExclamationMark } from '@sb/compositions/Chart/components/MarketBlock/MarketBlock.styles'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import AttentionComponent from '@sb/components/AttentionBlock'
import { startFarming } from '@sb/dexUtils/pools/startFarming'
import { PublicKey } from '@solana/web3.js'
import {
  DexTokensPrices,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { notify } from '@sb/dexUtils/notifications'
import dayjs from 'dayjs'
import { dayDuration, estimatedTime } from '@core/utils/dateUtils'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { RefreshFunction } from '@sb/dexUtils/types'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { getFarmingStateDailyFarmingValue } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValue'

export const StakePopup = ({
  theme,
  open,
  close,
  selectedPool,
  allTokensData,
  farmingTicketsMap,
  dexTokensPricesMap,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
}: {
  theme: Theme
  open: boolean
  close: () => void
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  dexTokensPricesMap: Map<string, DexTokensPrices>
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}) => {
  const {
    amount: maxPoolTokenAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.poolTokenMint)
  console.log('selectedPool:', allTokensData, selectedPool)
  const [poolTokenAmount, setPoolTokenAmount] = useState<number | string>(
    maxPoolTokenAmount
  )
  const [operationLoading, setOperationLoading] = useState(false)

  const { wallet } = useWallet()
  const connection = useConnection()

  const isNotEnoughPoolTokens = +poolTokenAmount > maxPoolTokenAmount
  const farmingState = selectedPool.farming && selectedPool.farming[0]

  const farmingTickets = farmingTicketsMap.get(selectedPool.swapToken) || []
  const stakedTokens = getStakedTokensFromOpenFarmingTickets(farmingTickets)

  const poolTokenPrice = calculatePoolTokenPrice({
    pool: selectedPool,
    dexTokensPricesMap,
  })

  const totalStakedLpTokensUSD =
    selectedPool.lpTokenFreezeVaultBalance * poolTokenPrice

  const baseSymbol = getTokenNameByMintAddress(selectedPool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(selectedPool.tokenB)

  const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 0
  const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 0

  const tvlUSD =
    baseTokenPrice * selectedPool.tvl.tokenA +
    quoteTokenPrice * selectedPool.tvl.tokenB

  const isPoolWithFarming =
    selectedPool.farming && selectedPool.farming.length > 0
  const openFarmings = isPoolWithFarming
    ? filterOpenFarmingStates(selectedPool.farming)
    : []

  const stakedWithEnteredPoolTokensUSD =
    (stakedTokens + +poolTokenAmount) * poolTokenPrice

  if (!farmingState) return null

  const totalFarmingDailyRewardsUSD = openFarmings.reduce(
    (acc, farmingState) => {
      const farmingStateDailyFarmingValuePerThousandDollarsLiquidity = getFarmingStateDailyFarmingValue(
        { farmingState, totalStakedLpTokensUSD }
      )

      const farmingTokenSymbol = getTokenNameByMintAddress(
        farmingState.farmingTokenMint
      )

      let farmingTokenPrice =
        dexTokensPricesMap.get(farmingTokenSymbol)?.price || 0

      if (farmingTokenSymbol === 'MNDE') {
        farmingTokenPrice = 0.727590
      }

      const farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD =
        farmingStateDailyFarmingValuePerThousandDollarsLiquidity *
        farmingTokenPrice

      return acc + farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD
    },
    0
  )

  const farmingAPR =
    ((totalFarmingDailyRewardsUSD * 365) / totalStakedLpTokensUSD) * 100

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {
        setOperationLoading(false)
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'} width={'100%'}>
        <BoldHeader>Stake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Stake your Pool Tokens to start farming RIN.
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder={'0'}
          theme={theme}
          onChange={setPoolTokenAmount}
          value={poolTokenAmount}
          symbol={'Pool Tokens'}
          // alreadyInPool={0}
          maxBalance={maxPoolTokenAmount}
          needAlreadyInPool={false}
        />
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <Text>Est. rewards:</Text>
        <Text>
          <Row align="flex-start">
            <span style={{ color: '#53DF11', fontFamily: 'Avenir Next Demi' }}>
              {formatNumberToUSFormat(stripDigitPlaces(farmingAPR, 2))}% APR
            </span>
          </Row>
        </Text>
      </RowContainer>
      <HintContainer justify={'flex-start'} margin="5rem 0 2rem 0">
        <Row justify="flex-start" width="20%">
          <ExclamationMark
            theme={theme}
            margin={'0 0 0 2rem'}
            fontSize="5rem"
            color={'#fbf2f2'}
          />
        </Row>
        <Row width="80%" align="flex-start" direction="column">
          <Text style={{ margin: '0 0 1.5rem 0' }}>
            Pool tokens will be locked for{' '}
            <span style={{ color: '#53DF11' }}>
              {estimatedTime(farmingState.periodLength)}.
            </span>{' '}
          </Text>
          <Text>
            Withdrawal will not be available until{' '}
            <span style={{ color: '#53DF11' }}>
              {dayjs
                .unix(Date.now() / 1000 + farmingState.periodLength)
                .format('MMM DD, YYYY')}
            </span>
          </Text>
        </Row>
      </HintContainer>
      {isNotEnoughPoolTokens && (
        <RowContainer margin={'2rem 0 0 0'}>
          <AttentionComponent
            text={`You entered more Pool tokens than you have.`}
            blockHeight={'8rem'}
          />
        </RowContainer>
      )}
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={isNotEnoughPoolTokens || !poolTokenAmount}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={async () => {
            // loader in popup button
            setOperationLoading(true)
            // loader in table button
            setPoolWaitingForUpdateAfterOperation({
              pool: selectedPool.swapToken,
              operation: 'stake',
            })

            const poolTokenAmountWithDecimals =
              +poolTokenAmount * 10 ** poolTokenDecimals

            const result = await startFarming({
              wallet,
              connection,
              poolTokenAmount: poolTokenAmountWithDecimals,
              userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
              poolPublicKey: new PublicKey(selectedPool.swapToken),
              farmingState: new PublicKey(farmingState.farmingState),
            })

            setOperationLoading(false)

            notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Successfully staked.'
                  : result === 'failed'
                  ? 'Staking failed, please try again later or contact us in telegram.'
                  : 'Staking cancelled.',
            })

            const clearPoolWaitingForUpdate = () =>
              setPoolWaitingForUpdateAfterOperation({
                pool: '',
                operation: '',
              })

            if (result === 'success') {
              setTimeout(async () => {
                refreshTokensWithFarmingTickets()
                clearPoolWaitingForUpdate()
              }, 7500)

              // if not updated value returned after first refresh
              setTimeout(() => refreshTokensWithFarmingTickets(), 15000)
            } else {
              clearPoolWaitingForUpdate()
            }

            close()
          }}
        >
          Stake
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}
