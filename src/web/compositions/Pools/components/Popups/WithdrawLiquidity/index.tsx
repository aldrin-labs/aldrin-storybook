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
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

export const WithdrawalPopup = ({
  theme,
  open,
  selectedPool,
  allTokensData,
  close,
}: {
  theme: Theme
  open: boolean
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const [quoteAmount, setQuoteAmount] = useState<string | number>('')

  const [operationLoading, setOperationLoading] = useState<boolean>(false)
  const [
    [withdrawAmountTokenA, withdrawAmountTokenB],
    setWithdrawAmounts,
  ] = useState<[number, number]>([0, 0])

  const poolTokenInfo = getTokenDataByMint(
    allTokensData,
    selectedPool.poolTokenMint
  )
  const poolTokenAmount = poolTokenInfo?.amount || 0
  const poolTokenDecimals = poolTokenInfo?.decimals || 0
  const poolTokenAmountToWithdraw =
    (+baseAmount / withdrawAmountTokenA) *
    100 *
    poolTokenAmount *
    10 ** poolTokenDecimals

  const baseTokenInfo = getTokenDataByMint(allTokensData, selectedPool.tokenA)
  const quoteTokenInfo = getTokenDataByMint(allTokensData, selectedPool.tokenB)

  // load max withdrawal values for tokenA, tokenB
  useEffect(() => {
    const getData = async () => {
      const [
        withdrawAmountTokenA,
        withdrawAmountTokenB,
      ] = await getMaxWithdrawAmount({
        wallet,
        connection,
        swapTokenPublicKey: new PublicKey(selectedPool.swapToken),
        poolTokenAmount,
      })

      setWithdrawAmounts([withdrawAmountTokenA, withdrawAmountTokenB])
    }

    getData()
  }, [wallet, connection, selectedPool.swapToken, poolTokenAmount])

  const isDisabled = +baseAmount <= 0 || +quoteAmount <= 0 || operationLoading
  const total = +baseAmount + +quoteAmount

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
          theme={theme}
          symbol={getTokenNameByMintAddress(selectedPool.tokenA)}
          value={baseAmount}
          onChange={setBaseAmount}
          maxBalance={withdrawAmountTokenA}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <SimpleInput
          theme={theme}
          symbol={getTokenNameByMintAddress(selectedPool.tokenB)}
          value={quoteAmount}
          onChange={setQuoteAmount}
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
          theme={theme}
          onClick={async () => {
            const userTokenAccountA = baseTokenInfo?.address
            const userTokenAccountB = quoteTokenInfo?.address
            const userPoolTokenAccount = poolTokenInfo?.address

            if (
              !userTokenAccountA ||
              !userTokenAccountB ||
              !userPoolTokenAccount ||
              !poolTokenAmountToWithdraw
            )
              return // add notify

            await setOperationLoading(true)
            await withdrawAllTokenTypes({
              wallet,
              connection,
              poolTokenAmount: poolTokenAmountToWithdraw,
              swapTokenPublicKey: new PublicKey(selectedPool.swapToken),
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
