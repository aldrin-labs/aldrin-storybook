import { Theme, withTheme } from '@material-ui/core'
import { PublicKey } from '@solana/web3.js'
import dayjs from 'dayjs'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import AttentionComponent from '@sb/components/AttentionBlock'
import SvgIcon from '@sb/components/SvgIcon'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { ExclamationMark } from '@sb/compositions/Chart/components/MarketBlock/MarketBlock.styles'
import {
  DexTokensPrices,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { startStaking } from '@sb/dexUtils/common/actions'
import {
  CREATE_FARMING_TICKET_SOL_FEE,
  MIN_POOL_TOKEN_AMOUNT_TO_STAKE,
} from '@sb/dexUtils/common/config'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { RefreshFunction } from '@sb/dexUtils/types'
import { useWallet } from '@sb/dexUtils/wallet'

import { estimatedTime } from '@core/utils/dateUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import Close from '@icons/closeIcon.svg'

import { getPoolsProgramAddress } from '../../../../../dexUtils/ProgramsMultiton'
import { Button } from '../../Tables/index.styles'
import { getFarmingStateDailyFarmingValue } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { InputWithCoins } from '../components'
import { BoldHeader, StyledPaper } from '../index.styles'
import { HintContainer } from './styles'

interface StakePopupProps {
  theme: Theme
  close: () => void
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  dexTokensPricesMap: Map<string, DexTokensPrices>
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  isReminderPopup: boolean
}

const Popup = (props: StakePopupProps) => {
  const {
    theme,
    close,
    selectedPool,
    allTokensData,
    farmingTicketsMap,
    dexTokensPricesMap,
    refreshTokensWithFarmingTickets,
    setPoolWaitingForUpdateAfterOperation,
    isReminderPopup,
  } = props
  const {
    amount: maxPoolTokenAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.poolTokenMint)
  const [poolTokenAmount, setPoolTokenAmount] = useState<number | string>(
    maxPoolTokenAmount
  )
  const [operationLoading, setOperationLoading] = useState(false)

  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

  const isNotEnoughPoolTokens = +poolTokenAmount > maxPoolTokenAmount
  const farmingState = selectedPool.farming && selectedPool.farming[0]

  const farmingTickets = farmingTicketsMap.get(selectedPool.swapToken) || []

  const poolTokenPrice = calculatePoolTokenPrice({
    pool: selectedPool,
    dexTokensPricesMap,
  })

  const totalStakedLpTokensUSD = Math.max(
    selectedPool.lpTokenFreezeVaultBalance * poolTokenPrice,
    1000
  )

  const baseSymbol = getTokenNameByMintAddress(selectedPool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(selectedPool.tokenB)

  const isPoolWithFarming =
    selectedPool.farming && selectedPool.farming.length > 0
  const openFarmings = isPoolWithFarming
    ? filterOpenFarmingStates(selectedPool.farming)
    : []

  if (!farmingState) return null

  const totalFarmingDailyRewardsUSD = openFarmings.reduce(
    (acc, farmingState) => {
      const farmingStateDailyFarmingValuePerThousandDollarsLiquidity =
        getFarmingStateDailyFarmingValue({
          farmingState,
          totalStakedLpTokensUSD,
        })

      const farmingTokenSymbol = getTokenNameByMintAddress(
        farmingState.farmingTokenMint
      )

      const farmingTokenPrice =
        dexTokensPricesMap.get(farmingTokenSymbol)?.price || 0

      const farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD =
        farmingStateDailyFarmingValuePerThousandDollarsLiquidity *
        farmingTokenPrice

      return acc + farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD
    },
    0
  )

  const farmingAPR =
    ((totalFarmingDailyRewardsUSD * 365) / totalStakedLpTokensUSD) * 100

  const farmingTokens = [
    ...new Set(
      (selectedPool.farming || []).map(
        ({ farmingTokenMint }) => farmingTokenMint
      )
    ),
  ]
    .map((farmingTokenMint, i, arr) => {
      return `${getTokenNameByMintAddress(farmingTokenMint)} ${
        i !== arr.length - 1 ? 'X ' : ''
      }`
    })
    .join('')
    .replace(',', '')

  const isLessThanMinPoolTokenAmountToStake =
    poolTokenAmount < MIN_POOL_TOKEN_AMOUNT_TO_STAKE
  const isDisabled =
    isNotEnoughPoolTokens ||
    !poolTokenAmount ||
    isLessThanMinPoolTokenAmountToStake

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      open
      onEnter={() => {
        setOperationLoading(false)
      }}
      maxWidth="md"
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between" width="100%">
        <BoldHeader>
          {!isReminderPopup
            ? 'Stake Pool Tokens'
            : 'Don’t forget to stake LP tokens'}
        </BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize="1.4rem">
          {!isReminderPopup
            ? 'Stake your Pool Tokens to start farming RIN.'
            : `Stake your LP tokens to start farming ${farmingTokens}.`}
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder="0"
          theme={theme}
          onChange={setPoolTokenAmount}
          value={poolTokenAmount}
          symbol="Pool Tokens"
          // alreadyInPool={0}
          maxBalance={maxPoolTokenAmount}
          needAlreadyInPool={false}
        />
      </RowContainer>
      {isReminderPopup ? null : (
        <RowContainer justify="space-between">
          <Text>Est. rewards:</Text>
          <Text>
            <Row align="flex-start">
              <span
                style={{ color: '#53DF11', fontFamily: 'Avenir Next Demi' }}
              >
                {formatNumberToUSFormat(stripDigitPlaces(farmingAPR, 2))}% APR
              </span>
            </Row>
          </Text>
        </RowContainer>
      )}
      <RowContainer justify="space-between" margin="2rem 0 0 0">
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: theme.palette.green.main,
          }}
        >
          {CREATE_FARMING_TICKET_SOL_FEE} SOL
        </WhiteText>
      </RowContainer>
      {isReminderPopup ? null : (
        <HintContainer justify="flex-start" margin="5rem 0 2rem 0">
          <Row justify="flex-start" width="20%">
            <ExclamationMark
              theme={theme}
              margin="0 0 0 2rem"
              fontSize="5rem"
              color="#fbf2f2"
            />
          </Row>
          <Row width="80%" align="flex-start" direction="column">
            <Text style={{ margin: '0 0 1.5rem 0' }}>
              Pool tokens will be locked for{' '}
              <span style={{ color: '#53DF11' }}>
                {estimatedTime(farmingState.periodLength + 20 * 60)}.
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
      )}

      {isLessThanMinPoolTokenAmountToStake && (
        <RowContainer margin="2rem 0 0 0">
          <AttentionComponent
            text={`You need to stake at least ${MIN_POOL_TOKEN_AMOUNT_TO_STAKE} Pool tokens.`}
            blockHeight="8rem"
          />
        </RowContainer>
      )}

      {isNotEnoughPoolTokens && (
        <RowContainer margin="2rem 0 0 0">
          <AttentionComponent
            text="You entered more Pool tokens than you have."
            blockHeight="8rem"
          />
        </RowContainer>
      )}
      <RowContainer justify="space-between" margin="3rem 0 2rem 0">
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident
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

            const result = await startStaking({
              wallet,
              connection,
              amount: poolTokenAmountWithDecimals,
              stakingPool: selectedPool,
              userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
              programAddress: getPoolsProgramAddress({
                curveType: selectedPool.curveType,
              }),
              farmingTickets,
              decimals: 0,
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
              refreshTokensWithFarmingTickets()
              clearPoolWaitingForUpdate()
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

export const StakePopup = withTheme()(Popup)
