import Close from '@icons/closeIcon.svg'
import { Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  DexTokensPrices,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { notify } from '@sb/dexUtils/notifications'
import { startFarming } from '@sb/dexUtils/pools/startFarming'
import { RefreshFunction, TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import React, { useState } from 'react'
import { Button } from '../../Tables/index.styles'
import { InputWithCoins } from '../components'
import { BoldHeader, StyledPaper } from '../index.styles'

export const RemindToStakePopup = ({
  theme,
  open,
  wallet,
  connection,
  close,
  selectedPool,
  allTokensData,
  dexTokensPricesMap,
  setPoolWaitingForUpdateAfterOperation,
}: {
  theme: Theme
  open: boolean
  wallet: WalletAdapter
  connection: Connection
  close: () => void
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}) => {
  const {
    amount: maxPoolTokenAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.poolTokenMint)

  const [operationLoading, setOperationLoading] = useState(false)
  const [poolTokenAmount, setPoolTokenAmount] = useState<number | string>('')

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
        farmingTokenPrice = 0.72759
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
      onEnter={() => {}}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'} width={'100%'}>
        <BoldHeader>Don’t forget to stake LP tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Stake your LP tokens to start framing RIN & MNDE.
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
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{
            width: '100%',
            fontFamily: 'Avenir Next Medium',
            backgroundColor: COLORS.primary,
          }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={() => {
            ;async () => {
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
            }
          }}
        >
          Stake
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}
