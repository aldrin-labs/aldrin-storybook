import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { InputWithCoins, InputWithTotal } from '../components'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import {
  calculateWithdrawAmount,
  depositAllTokenTypes,
} from '@sb/dexUtils/pools'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { PoolInfo, PoolsPrices } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { notify } from '@sb/dexUtils/notifications'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import AttentionComponent from '@sb/components/AttentionBlock'

export const AddLiquidityPopup = ({
  theme,
  open,
  poolsPrices,
  selectedPool,
  allTokensData,
  close,
  refreshAllTokensData,
}: {
  theme: Theme
  open: boolean
  poolsPrices: PoolsPrices[]
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

  const [warningChecked, setWarningChecked] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const {
    address: userTokenAccountA,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.tokenA)

  const {
    address: userTokenAccountB,
    amount: maxQuoteAmount,
    decimals: quoteTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.tokenB)

  const {
    amount: poolTokenRawAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.poolTokenMint)

  const baseSymbol = getTokenNameByMintAddress(selectedPool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(selectedPool.tokenB)

  // for cases with SOL token
  const isBaseTokenSOL = baseSymbol === 'SOL'
  const isQuoteTokenSOL = quoteSymbol === 'SOL'

  const isPoolWithSOLToken = isBaseTokenSOL || isQuoteTokenSOL
  const solAddresses = allTokensData.filter(
    (tokenData) => tokenData.mint === WRAPPED_SOL_MINT.toString()
  )

  const isSeveralSOLAddresses = solAddresses.length > 1
  const isNativeSOLSelected =
    allTokensData[0]?.address === userTokenAccountA ||
    allTokensData[0]?.address === userTokenAccountB

  const isNeedToLeftSomeSOL =
    isBaseTokenSOL && isNativeSOLSelected
      ? maxBaseAmount - +baseAmount < 0.1
      : isQuoteTokenSOL && isNativeSOLSelected
      ? maxQuoteAmount - +quoteAmount < 0.1
      : false

  const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals
  const [poolAmountTokenA, poolAmountTokenB] = [
    selectedPool.tvl.tokenA,
    selectedPool.tvl.tokenB,
  ]

  const [withdrawAmountTokenA, withdrawAmountTokenB] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount,
  })

  const isDisabled =
    !warningChecked ||
    +baseAmount <= 0 ||
    +quoteAmount <= 0 ||
    operationLoading ||
    baseAmount > maxBaseAmount ||
    quoteAmount > maxQuoteAmount

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
        <BoldHeader>Add Liquidity</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </Row>
      <RowContainer>
        <InputWithCoins
          placeholder={''}
          theme={theme}
          value={baseAmount}
          onChange={setBaseAmountWithQuote}
          symbol={baseSymbol}
          alreadyInPool={withdrawAmountTokenA}
          maxBalance={maxBaseAmount}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <InputWithCoins
          placeholder={''}
          theme={theme}
          value={quoteAmount}
          onChange={setQuoteAmountWithBase}
          symbol={quoteSymbol}
          alreadyInPool={withdrawAmountTokenB}
          maxBalance={maxQuoteAmount}
        />
        <Line />
        <InputWithTotal theme={theme} value={total} />
      </RowContainer>
      <Row margin={'2rem 0 1rem 0'} justify={'space-between'}>
        <Row direction={'column'} align={'start'}>
          <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
            Projected fee earnings based on the past 24h
          </Text>
          <Row>
            <Text
              fontSize={'2rem'}
              color={'#A5E898'}
              fontFamily={'Avenir Next Demi'}
            >
              ${stripDigitPlaces(total * (1 + selectedPool.apy24h / 100), 2)}
              &nbsp;
            </Text>
            <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
              / 24h
            </Text>
          </Row>
        </Row>
        <Row direction={'column'}>
          <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
            APY (24h)
          </Text>
          <Row>
            <Text
              fontSize={'2rem'}
              color={'#A5E898'}
              fontFamily={'Avenir Next Demi'}
            >
              {selectedPool.apy24h}%
            </Text>
          </Row>
        </Row>
      </Row>

      {(isNeedToLeftSomeSOL ||
        baseAmount > maxBaseAmount ||
        quoteAmount > maxQuoteAmount) && (
        <RowContainer margin={'2rem 0 0 0'}>
          <AttentionComponent
            text={
              isNeedToLeftSomeSOL
                ? 'Sorry, but you need to left some SOL (al least 0.1 SOL) on your wallet SOL account to successfully execute further transactions.'
                : baseAmount > maxBaseAmount
                ? `You entered more tokenA amount than you have.`
                : quoteAmount > maxQuoteAmount
                ? `You entered more tokenB amount than you have.`
                : ''
            }
            blockHeight={'8rem'}
          />
        </RowContainer>
      )}
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Row
          width={'60%'}
          justify="space-between"
          wrap={'nowrap'}
          padding={'0 2rem 0 0'}
        >
          <SCheckbox
            id={'warning_checkbox'}
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => setWarningChecked(!warningChecked)}
            checked={warningChecked}
          />
          <label htmlFor={'warning_checkbox'}>
            <WhiteText
              style={{
                cursor: 'pointer',
                color: '#F2ABB1',
                fontSize: '1.12rem',
                fontFamily: 'Avenir Next Medium',
                letterSpacing: '0.01rem',
              }}
            >
              I understand the risks of providing liquidity, and that I could
              lose money to impermanent loss.
            </WhiteText>
          </label>
        </Row>
        <BlueButton
          style={{ width: '40%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident={true}
          showLoader={operationLoading}
          theme={theme}
          onClick={async () => {
            const userAmountTokenA = +baseAmount * 10 ** baseTokenDecimals
            const userAmountTokenB = +quoteAmount * 10 ** quoteTokenDecimals

            if (
              !userTokenAccountA ||
              !userTokenAccountB ||
              !userAmountTokenA ||
              !userAmountTokenB
            ) {
              notify({
                message: `Sorry, something went wrong with your amount of ${
                  !userTokenAccountA ? 'tokenA' : 'tokenB'
                }`,
                type: 'error',
              })

              console.log('base data', {
                userTokenAccountA,
                userTokenAccountB,
                baseTokenDecimals,
                quoteTokenDecimals,
                userAmountTokenA,
                userAmountTokenB,
              })

              return
            }

            console.log('userPoolTokenAccount', userPoolTokenAccount)
            await setOperationLoading(true)

            const result = await depositAllTokenTypes({
              wallet,
              connection,
              userAmountTokenA,
              userAmountTokenB,
              tokenSwapPublicKey: new PublicKey(selectedPool.swapToken),
              userTokenAccountA: new PublicKey(userTokenAccountA),
              userTokenAccountB: new PublicKey(userTokenAccountB),
              ...(userPoolTokenAccount
                ? { poolTokenAccount: new PublicKey(userPoolTokenAccount) }
                : {}),
              transferSOLToWrapped: isPoolWithSOLToken && isNativeSOLSelected,
            })

            await refreshAllTokensData()
            await setOperationLoading(false)

            await notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Deposit successful'
                  : result === 'failed'
                  ? 'Deposit failed, please try again later or contact us in telegram.'
                  : 'Deposit cancelled',
            })

            await close()
          }}
        >
          Add liquidity
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
