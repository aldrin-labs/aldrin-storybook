import { Theme, withTheme } from '@material-ui/core'
import { PublicKey } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import React, { useEffect, useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  DexTokensPrices,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenName } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { redeemBasket } from '@sb/dexUtils/pools/actions/redeemBasket'
import { usePoolBalances } from '@sb/dexUtils/pools/hooks/usePoolBalances'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { RefreshFunction } from '@sb/dexUtils/types'
import { VestingWithPk } from '@sb/dexUtils/vesting/types'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import Close from '@icons/closeIcon.svg'

import { Button } from '../../Tables/index.styles'
import { InputWithTotal, SimpleInput } from '../components'
import { BoldHeader, Line, StyledPaper } from '../index.styles'

interface WithdrawalProps {
  theme: Theme
  dexTokensPricesMap: Map<string, DexTokensPrices>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  // earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
  refreshAllTokensData: RefreshFunction
  setIsUnstakePopupOpen: (isOpen: boolean) => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  vesting?: VestingWithPk
}

const resolveWithdrawStatus = (result: string) => {
  if (result === 'success') {
    return 'Withdrawal successful'
  }
  if (result === 'failed') {
    return 'Withdrawal failed, please try again later or contact us in telegram.'
  }
  return 'Withdrawal cancelled'
}

const WithdrawalPopup: React.FC<WithdrawalProps> = (props) => {
  const {
    theme,
    dexTokensPricesMap,
    farmingTicketsMap,
    // earnedFeesInPoolForUserMap,
    selectedPool,
    allTokensData,
    close,
    refreshAllTokensData,
    setIsUnstakePopupOpen,
    setPoolWaitingForUpdateAfterOperation,
    vesting,
  } = props
  const { wallet } = useWallet()
  const connection = useConnection()
  const tokensInfo = useTokenInfos()

  const [poolBalances, refreshPoolBalances] = usePoolBalances(selectedPool)

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const [baseAmount, setBaseAmount] = useState<string | number>('')

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

  const setBaseAmountWithQuote = (ba: string | number) => {
    const qa = stripDigitPlaces(+ba * (poolAmountTokenB / poolAmountTokenA), 8)
    setBaseAmount(ba)
    setQuoteAmount(qa)
  }

  const setQuoteAmountWithBase = (qa: string | number) => {
    const ba = stripDigitPlaces(+qa * (poolAmountTokenA / poolAmountTokenB), 8)
    setBaseAmount(ba)
    setQuoteAmount(qa)
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

  const baseSymbol = getTokenName({
    address: selectedPool.tokenA,
    tokensInfoMap: tokensInfo,
  })
  const quoteSymbol = getTokenName({
    address: selectedPool.tokenB,
    tokensInfoMap: tokensInfo,
  })
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
  const lockedTokens = parseFloat(vesting?.outstanding.toString() || '0') // Vesting

  const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals
  const [withdrawAmountTokenA, withdrawAmountTokenB] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount: poolTokenAmount + stakedTokens + lockedTokens,
  })

  const [availableWithdrawAmountTokenA] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount: poolTokenAmount + lockedTokens,
  })

  const poolTokenAmountToWithdraw =
    (+baseAmount / availableWithdrawAmountTokenA) *
    (poolTokenAmount + lockedTokens)

  // need to show in popup
  // const { totalBaseTokenFee, totalQuoteTokenFee } =
  //   earnedFeesInPoolForUserMap.get(selectedPool.swapToken) || {
  //     totalBaseTokenFee: 0,
  //     totalQuoteTokenFee: 0,
  //   }

  // const feesUsd =
  //   totalBaseTokenFee * baseTokenPrice + totalQuoteTokenFee * quoteTokenPrice

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
      maxWidth="md"
      open
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify="space-between" width="100%">
        <BoldHeader>Withdraw Liquidity</BoldHeader>
        <Row>
          <ReloadTimer
            margin="0 1.5rem 0 0"
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
          placeholder="0"
          theme={theme}
          symbol={baseSymbol}
          value={baseAmount}
          onChange={setBaseAmountWithQuote}
          maxBalance={withdrawAmountTokenA}
        />
        <Row>
          <Text fontSize="4rem" fontFamily="Avenir Next Medium">
            +
          </Text>
        </Row>
        <SimpleInput
          placeholder="0"
          theme={theme}
          symbol={quoteSymbol}
          value={quoteAmount}
          onChange={setQuoteAmountWithBase}
          maxBalance={withdrawAmountTokenB}
        />
        <Line />
        <InputWithTotal theme={theme} value={total} />
      </RowContainer>

      <RowContainer justify="space-between" margin="2rem 0 0 0">
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: COLORS.success,
          }}
        >
          {TRANSACTION_COMMON_SOL_FEE} SOL
        </WhiteText>
      </RowContainer>

      <RowContainer justify="space-between" margin="3rem 0 2rem 0">
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident
          showLoader={operationLoading}
          theme={theme}
          onClick={async () => {
            const [
              availableToWithdrawAmountTokenA,
              availableToWithdrawAmountTokenB,
            ] = calculateWithdrawAmount({
              selectedPool,
              poolTokenAmount: poolTokenAmount + lockedTokens,
            })

            if (poolTokenAmount === 0 && vesting?.outstanding.eqn(0)) {
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

            if (!userPoolTokenAccount && !vesting) {
              notify({
                message: `No pool token account`,
                type: 'error',
              })

              return
            }

            if (!poolTokenAmountToWithdraw) {
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
              curveType: selectedPool.curveType,
              poolPublicKey: new PublicKey(selectedPool.swapToken),
              userPoolTokenAccount: userPoolTokenAccount
                ? new PublicKey(userPoolTokenAccount)
                : undefined,
              userPoolTokenAmount: poolTokenAmountToWithdraw,
              unlockVesting:
                poolTokenAmountToWithdraw > poolTokenAmount
                  ? vesting
                  : undefined,
              userBaseTokenAccount: userTokenAccountA
                ? new PublicKey(userTokenAccountA)
                : null,
              userQuoteTokenAccount: userTokenAccountB
                ? new PublicKey(userTokenAccountB)
                : null,
            })

            setOperationLoading(false)

            notify({
              type: result === 'success' ? 'success' : 'error',
              message: resolveWithdrawStatus(result),
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
              })
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

const WithTheme = withTheme()(WithdrawalPopup)

export { WithTheme as WithdrawalPopup }
