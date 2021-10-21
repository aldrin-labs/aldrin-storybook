import React, { useState, useEffect } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { SimpleInput, InputWithTotal } from '../components'
import { Button } from '../../Tables/index.styles'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import {
  PoolInfo,
  DexTokensPrices,
  PoolWithOperation,
  FeesEarned,
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { redeemBasket } from '@sb/dexUtils/pools/redeemBasket'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { getStakedTokensForPool } from '@sb/dexUtils/pools/getStakedTokensForPool'
import { FarmingTicket } from '@sb/dexUtils/pools/types'

export const WithdrawalPopup = ({
  theme,
  open,
  poolsInfo,
  dexTokensPricesMap,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectedPool,
  allTokensData,
  close,
  selectPool,
  refreshAllTokensData,
  getPoolsInfoQueryRefetch,
  setPoolWaitingForUpdateAfterOperation,
}: {
  theme: Theme
  open: boolean
  poolsInfo: PoolInfo[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
  selectPool: (pool: PoolInfo) => void
  refreshAllTokensData: () => void
  getPoolsInfoQueryRefetch: () => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const setBaseAmountWithQuote = (baseAmount: string | number) => {
    const quoteAmount = stripDigitPlaces(
      +baseAmount * (poolAmountTokenB / poolAmountTokenA),
      8
    )
    setBaseAmount(baseAmount)
    setQuoteAmount(quoteAmount)
  }

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const setQuoteAmountWithBase = (quoteAmount: string | number) => {
    const baseAmount = stripDigitPlaces(
      +quoteAmount * (poolAmountTokenA / poolAmountTokenB),
      8
    )
    setBaseAmount(baseAmount)
    setQuoteAmount(quoteAmount)
  }

  const [operationLoading, setOperationLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!selectedPool) return
    const updatedSelectedPool = poolsInfo.find(
      (pool) => pool.swapToken === selectedPool.swapToken
    )

    if (updatedSelectedPool) {
      selectPool(updatedSelectedPool)

      const newQuote = stripDigitPlaces(
        +baseAmount *
          (updatedSelectedPool.tvl.tokenB / updatedSelectedPool.tvl.tokenA),
        8
      )

      if (baseAmount && newQuote) {
        setQuoteAmount(newQuote)
      }
    }
  }, [poolsInfo])

  const { address: userTokenAccountA } = getTokenDataByMint(
    allTokensData,
    selectedPool.tokenA
  )

  const { address: userTokenAccountB } = getTokenDataByMint(
    allTokensData,
    selectedPool.tokenB
  )

  const {
    amount: poolTokenRawAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.poolTokenMint)

  const baseSymbol = getTokenNameByMintAddress(selectedPool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(selectedPool.tokenB)

  const baseTokenPrice =
    (
      dexTokensPricesMap.get(selectedPool.tokenA) ||
      dexTokensPricesMap.get(baseSymbol)
    )?.price || 0

  const quoteTokenPrice =
    (
      dexTokensPricesMap.get(selectedPool.tokenB) ||
      dexTokensPricesMap.get(quoteSymbol)
    )?.price || 0

  const farmingTickets = farmingTicketsMap.get(selectedPool.swapToken) || []
  const stakedTokens = getStakedTokensForPool(farmingTickets)

  const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals
  const [poolAmountTokenA, poolAmountTokenB] = [
    selectedPool.tvl.tokenA,
    selectedPool.tvl.tokenB,
  ]

  const [withdrawAmountTokenA, withdrawAmountTokenB] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount: poolTokenAmount + stakedTokens,
  })

  const poolTokenAmountToWithdraw =
    (+baseAmount / withdrawAmountTokenA) * poolTokenAmount

  // need to show in popup
  const {
    totalBaseTokenFee,
    totalQuoteTokenFee,
  } = earnedFeesInPoolForUserMap.get(selectedPool.swapToken) || {
    totalBaseTokenFee: 0,
    totalQuoteTokenFee: 0,
  }

  const feesUsd =
    totalBaseTokenFee * baseTokenPrice + totalQuoteTokenFee * quoteTokenPrice

  const isDisabled =
    +baseAmount <= 0 ||
    +quoteAmount <= 0 ||
    operationLoading ||
    !withdrawAmountTokenA ||
    !withdrawAmountTokenB

  const total = +baseAmount * baseTokenPrice + +quoteAmount * quoteTokenPrice

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {
        setBaseAmount('')
        setQuoteAmount('')
        setOperationLoading(false)
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Withdraw Liquidity</BoldHeader>
        <Row>
          <ReloadTimer
            marginRight={'1.5rem'}
            callback={async () => {
              if (!operationLoading) {
                getPoolsInfoQueryRefetch()
              }
            }}
          />
          <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
        </Row>
      </Row>
      <RowContainer>
        <SimpleInput
          placeholder={'0'}
          theme={theme}
          symbol={baseSymbol}
          value={baseAmount}
          onChange={setBaseAmountWithQuote}
          maxBalance={withdrawAmountTokenA}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <SimpleInput
          placeholder={'0'}
          theme={theme}
          symbol={quoteSymbol}
          value={quoteAmount}
          onChange={setQuoteAmountWithBase}
          maxBalance={withdrawAmountTokenB}
        />
        <Line />
        <InputWithTotal theme={theme} value={total} />
      </RowContainer>

      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident={true}
          showLoader={operationLoading}
          theme={theme}
          onClick={async () => {
            if (
              !userTokenAccountA ||
              !userTokenAccountB ||
              !userPoolTokenAccount ||
              !poolTokenAmountToWithdraw
            ) {
              notify({
                message: `Sorry, something went wrong with your amount of pool token amount to withdraw`,
                type: 'error',
              })

              console.log('base data', {
                userTokenAccountA,
                userTokenAccountB,
                userPoolTokenAccount,
                poolTokenAmountToWithdraw,
              })

              return
            }

            await setOperationLoading(true)

            const result = await redeemBasket({
              wallet,
              connection,
              poolPublicKey: new PublicKey(selectedPool.swapToken),
              userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
              userPoolTokenAmount: poolTokenAmountToWithdraw,
              userBaseTokenAccount: new PublicKey(userTokenAccountA),
              userQuoteTokenAccount: new PublicKey(userTokenAccountB),
            })

            await setOperationLoading(false)
            await setPoolWaitingForUpdateAfterOperation({
              pool: selectedPool.swapToken,
              operation: 'withdraw',
            })

            await notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Withdrawal successful'
                  : result === 'failed'
                  ? 'Withdrawal failed, please try again later or contact us in telegram.'
                  : 'Withdrawal cancelled',
            })

            await setTimeout(async () => {
              await refreshAllTokensData()
              await setPoolWaitingForUpdateAfterOperation({
                pool: '',
                operation: '',
              })
            }, 7500)
            await setTimeout(() => refreshAllTokensData(), 15000)

            await close()
          }}
        >
          Withdraw
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}
