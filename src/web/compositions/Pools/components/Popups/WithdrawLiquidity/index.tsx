import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { SimpleInput, InputWithTotal } from '../components'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import {
  calculateWithdrawAmount,
  withdrawAllTokenTypes,
} from '@sb/dexUtils/pools'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PoolInfo, DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

export const WithdrawalPopup = ({
  theme,
  open,
  dexTokensPrices,
  selectedPool,
  allTokensData,
  close,
  refreshAllTokensData
}: {
  theme: Theme
  open: boolean
  dexTokensPrices: DexTokensPrices[]
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
  refreshAllTokensData: () => void
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

  const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals
  const [poolAmountTokenA, poolAmountTokenB] = [
    selectedPool.tvl.tokenA,
    selectedPool.tvl.tokenB,
  ]

  const [withdrawAmountTokenA, withdrawAmountTokenB] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount,
  })

  const poolTokenAmountToWithdraw =
    (+baseAmount / withdrawAmountTokenA) * poolTokenAmount

  const isDisabled =
    +baseAmount <= 0 ||
    +quoteAmount <= 0 ||
    operationLoading ||
    !withdrawAmountTokenA ||
    !withdrawAmountTokenB

  const baseTokenPrice =
    dexTokensPrices.find(
      (tokenInfo) =>
        tokenInfo.symbol === selectedPool.tokenA ||
        tokenInfo.symbol === baseSymbol
    )?.price || 0

  const quoteTokenPrice =
    dexTokensPrices.find(
      (tokenInfo) =>
        tokenInfo.symbol === selectedPool.tokenB ||
        tokenInfo.symbol === quoteSymbol
    )?.price || 0

  const total = +baseAmount * baseTokenPrice + +quoteAmount * quoteTokenPrice

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {
        setBaseAmount('');
        setQuoteAmount('');
        setOperationLoading(false);
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Withdraw Liquidity</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </Row>
      <RowContainer>
        <SimpleInput
          placeholder={''}
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
          placeholder={''}
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
        <BlueButton
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
            const result = await withdrawAllTokenTypes({
              wallet,
              connection,
              poolTokenAmount: poolTokenAmountToWithdraw,
              tokenSwapPublicKey: new PublicKey(selectedPool.swapToken),
              userTokenAccountA: new PublicKey(userTokenAccountA),
              userTokenAccountB: new PublicKey(userTokenAccountB),
              poolTokenAccount: new PublicKey(userPoolTokenAccount),
            })
            await refreshAllTokensData()
            await setOperationLoading(false)

            await notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Withdrawal successful'
                  : result === 'failed'
                  ? 'Withdrawal failed, please try again later or contact us in telegram.'
                  : 'Withdrawal cancelled',
            })

            await close()
          }}
        >
          Withdraw
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
