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
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { usePoolBalances } from '@sb/dexUtils/pools/usePoolBalances'
import { RefreshFunction } from '@sb/dexUtils/types'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import {
  costOfAddingToken,
  TRANSACTION_COMMON_SOL_FEE,
} from '@sb/components/TraidingTerminal/utils'

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
  refreshAllTokensData,
  setIsUnstakePopupOpen,
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
  refreshAllTokensData: RefreshFunction
  setIsUnstakePopupOpen: (isOpen: boolean) => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [poolBalances, refreshPoolBalances] = usePoolBalances({
    pool: selectedPool,
    connection,
  })

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

  // update entered value on every pool ratio change
  useEffect(() => {
    if (!selectedPool) return

    const newQuote = stripDigitPlaces(
      +baseAmount * (poolAmountTokenB / poolAmountTokenA),
      8
    )

    if (baseAmount && newQuote) {
      setQuoteAmount(newQuote)
    }
  }, [poolBalances])

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
  const stakedTokens = getStakedTokensFromOpenFarmingTickets(farmingTickets)

  const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals
  const [withdrawAmountTokenA, withdrawAmountTokenB] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount: poolTokenAmount + stakedTokens,
  })

  const [availableWithdrawAmountTokenA] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount,
  })

  const poolTokenAmountToWithdraw =
    (+baseAmount / availableWithdrawAmountTokenA) * poolTokenAmount

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
    !withdrawAmountTokenB ||
    +baseAmount > withdrawAmountTokenA ||
    +quoteAmount > withdrawAmountTokenB

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
            margin={'0 1.5rem 0 0'}
            callback={async () => {
              if (!operationLoading) {
                refreshPoolBalances()
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

      <RowContainer justify={'space-between'} margin={'2rem 0 0 0'}>
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: theme.palette.green.main,
          }}
        >
          {TRANSACTION_COMMON_SOL_FEE} SOL
        </WhiteText>
      </RowContainer>

      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident={true}
          showLoader={operationLoading}
          theme={theme}
          onClick={async () => {
            const [
              availableToWithdrawAmountTokenA,
              availableToWithdrawAmountTokenB,
            ] = calculateWithdrawAmount({
              selectedPool,
              poolTokenAmount,
            })

            if (poolTokenAmount === 0) {
              setIsUnstakePopupOpen(true)
              return
            }

            if (
              +baseAmount > availableToWithdrawAmountTokenA ||
              +quoteAmount > availableToWithdrawAmountTokenB
            ) {
              notify({
                message: `Unstake your pool tokens to withdraw liquidity.`,
                type: 'error',
              })

              return
            }

            if (!userPoolTokenAccount) {
              notify({
                message: `No pool token account`,
                type: 'error',
              })

              return
            }

            if (
              !poolTokenAmountToWithdraw
            ) {
              notify({
                message: `Something went wrong with your pool token amount to withdraw`,
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

            // loader in popup
            setOperationLoading(true)
            // loader in table button
            setPoolWaitingForUpdateAfterOperation({
              pool: selectedPool.swapToken,
              operation: 'withdraw',
            })

            const result = await redeemBasket({
              wallet,
              connection,
              poolPublicKey: new PublicKey(selectedPool.swapToken),
              userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
              userPoolTokenAmount: poolTokenAmountToWithdraw,
              userBaseTokenAccount: new PublicKey(userTokenAccountA),
              userQuoteTokenAccount: new PublicKey(userTokenAccountB),
            })

            setOperationLoading(false)

            notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Withdrawal successful'
                  : result === 'failed'
                  ? 'Withdrawal failed, please try again later or contact us in telegram.'
                  : 'Withdrawal cancelled',
            })

            refreshPoolBalances()

            const clearPoolWaitingForUpdate = () =>
              setPoolWaitingForUpdateAfterOperation({
                pool: '',
                operation: '',
              })

            if (result === 'success') {
              setTimeout(async () => {
                refreshAllTokensData()
                clearPoolWaitingForUpdate()
              }, 7500)

              setTimeout(() => refreshAllTokensData(), 15000)
            } else {
              clearPoolWaitingForUpdate()
            }

            close()
          }}
        >
          Withdraw
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}
