import React, { useState, useEffect } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { SimpleInput, InputWithTotal } from '../components'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { getMaxWithdrawAmount, withdrawAllTokenTypes } from '@sb/dexUtils/pools'
import { PublicKey } from '@solana/web3.js'
import { useMaxWithdrawalAmounts, useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PoolInfo, PoolsPrices } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { publicKey } from '@sb/dexUtils/token-swap/layout'

export const WithdrawalPopup = ({
  theme,
  open,
  poolsPrices,
  selectedPool,
  allTokensData,
  close,
}: {
  theme: Theme
  open: boolean
  poolsPrices: PoolsPrices[]
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
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
  const [
    [withdrawAmountTokenA, withdrawAmountTokenB],
    setWithdrawAmounts,
  ] = useState<[number, number]>([0, 0])

  const [[poolAmountTokenA, poolAmountTokenB], setAmounts] = useState<
    [number, number]
  >([0, 0])

  const poolTokenInfo = getTokenDataByMint(
    allTokensData,
    selectedPool.poolTokenMint
  )

  console.log('poolTokenInfo', poolTokenInfo)

  const poolTokenDecimals = poolTokenInfo?.decimals || 0
  const poolTokenAmount = (poolTokenInfo?.amount || 0) * poolTokenDecimals

  const poolTokenAmountToWithdraw =
    (+baseAmount / withdrawAmountTokenA) * poolTokenAmount

  const baseTokenInfo = getTokenDataByMint(allTokensData, selectedPool.tokenA)
  const baseSymbol = getTokenNameByMintAddress(selectedPool.tokenA)

  const quoteTokenInfo = getTokenDataByMint(allTokensData, selectedPool.tokenB)
  const quoteSymbol = getTokenNameByMintAddress(selectedPool.tokenB)

  const [withdrawalAmounts, loaded] = useMaxWithdrawalAmounts({
    poolTokenAmount: poolTokenAmount,
    tokenSwapPublicKey: new PublicKey(selectedPool.swapToken),
  })
  // load max withdrawal values for tokenA, tokenB
  useEffect(() => {
    const getData = async () => {
      const [
        withdrawAmountTokenA,
        withdrawAmountTokenB,
        poolTokenAmountA,
        poolTokenAmountB,
      ] = await getMaxWithdrawAmount({
        wallet,
        connection,
        tokenSwapPublicKey: new PublicKey(selectedPool.swapToken),
        poolTokenAmount,
      })
      setAmounts([poolTokenAmountA, poolTokenAmountB])
      setWithdrawAmounts([withdrawAmountTokenA, withdrawAmountTokenB])
    }

    getData()
  }, [wallet, connection, selectedPool.swapToken, poolTokenAmount])

  const isDisabled =
    +baseAmount <= 0 ||
    +quoteAmount <= 0 ||
    operationLoading ||
    !withdrawAmountTokenA ||
    !withdrawAmountTokenB

  const baseTokenPrice =
    poolsPrices.find(
      (tokenInfo) =>
        tokenInfo.symbol === selectedPool.tokenA ||
        tokenInfo.symbol === baseSymbol
    )?.price || 0

  const quoteTokenPrice =
    poolsPrices.find(
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
          disabled={!loaded}
          placeholder={!loaded ? 'Loading...' : ''}
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
          disabled={!loaded}
          placeholder={!loaded ? 'Loading...' : ''}
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
            const userTokenAccountA = baseTokenInfo?.address
            const userTokenAccountB = quoteTokenInfo?.address
            const userPoolTokenAccount = poolTokenInfo?.address

            console.log(' poolTokenAmountToWithdraw data', {
              perc: (+baseAmount / withdrawAmountTokenA) * 100,
              poolTokenAmount,
              poolTokenDecimals,
            })

            console.log('poolTokenAmountToWithdraw', poolTokenAmountToWithdraw)

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
            await withdrawAllTokenTypes({
              wallet,
              connection,
              poolTokenAmount: poolTokenAmountToWithdraw,
              tokenSwapPublicKey: new PublicKey(selectedPool.swapToken),
              userTokenAccountA: new PublicKey(userTokenAccountA),
              userTokenAccountB: new PublicKey(userTokenAccountB),
              poolTokenAccount: new PublicKey(userPoolTokenAccount),
            })
            await setOperationLoading(false)
          }}
        >
          Withdraw
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
