import React, { useEffect, useState } from 'react'

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
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PublicKey } from '@solana/web3.js'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { notify } from '@sb/dexUtils/notifications'
import AttentionComponent from '@sb/components/AttentionBlock'
import { SelectSeveralAddressesPopup } from '../SelectorForSeveralAddresses'
import { createBasket } from '@sb/dexUtils/pools/createBasket'

export const AddLiquidityPopup = ({
  theme,
  open,
  dexTokensPricesMap,
  selectedPool,
  allTokensData,
  close,
  refreshAllTokensData,
}: {
  theme: Theme
  open: boolean
  dexTokensPricesMap: Map<string, DexTokensPrices>
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
  refreshAllTokensData: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  // if user has more than one token for one mint
  const [
    selectedBaseTokenAddressFromSeveral,
    setBaseTokenAddressFromSeveral,
  ] = useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const setBaseAmountWithQuote = (baseAmount: string | number) => {
    const quoteAmount = stripDigitPlaces(
      +baseAmount * (poolAmountTokenB / poolAmountTokenA),
      8
    )

    setBaseAmount(baseAmount)
    if (poolAmountTokenA !== 0 && poolAmountTokenB !== 0) {
      setQuoteAmount(quoteAmount)
    }
  }

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const setQuoteAmountWithBase = (quoteAmount: string | number) => {
    const baseAmount = stripDigitPlaces(
      +quoteAmount * (poolAmountTokenA / poolAmountTokenB),
      8
    )

    if (poolAmountTokenA !== 0 && poolAmountTokenB !== 0) {
      setBaseAmount(baseAmount)
    }    
    setQuoteAmount(quoteAmount)
  }

  const [
    isSelectorForSeveralBaseAddressesOpen,
    setIsSelectorForSeveralBaseAddressesOpen,
  ] = useState(false)
  const [
    isSelectorForSeveralQuoteAddressesOpen,
    setIsSelectorForSeveralQuoteAddressesOpen,
  ] = useState(false)

  const [warningChecked, setWarningChecked] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const {
    address: userTokenAccountA,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    selectedPool.tokenA,
    selectedBaseTokenAddressFromSeveral
  )

  const {
    address: userTokenAccountB,
    amount: maxQuoteAmount,
    decimals: quoteTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    selectedPool.tokenB,
    selectedQuoteTokenAddressFromSeveral
  )

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

  useEffect(() => {
    const isSeveralBaseAddresses =
      allTokensData.filter((el) => el.mint === selectedPool.tokenA).length > 1

    const isSeveralQuoteAddresses =
      allTokensData.filter((el) => el.mint === selectedPool.tokenB).length > 1

    setIsSelectorForSeveralBaseAddressesOpen(isSeveralBaseAddresses)
    setIsSelectorForSeveralQuoteAddressesOpen(isSeveralQuoteAddresses)
  }, [])

  const isDisabled =
    !warningChecked ||
    +baseAmount <= 0 ||
    +quoteAmount <= 0 ||
    operationLoading ||
    baseAmount > maxBaseAmount ||
    quoteAmount > maxQuoteAmount

  const baseTokenPrice =
    (
      dexTokensPricesMap.get(selectedPool.tokenA) ||
      dexTokensPricesMap.get(baseSymbol)
    )?.price || 10

  const quoteTokenPrice =
    (
      dexTokensPricesMap.get(selectedPool.tokenB) ||
      dexTokensPricesMap.get(quoteSymbol)
    )?.price || 10

  const total = +baseAmount * baseTokenPrice + +quoteAmount * quoteTokenPrice
  const tvlUSD =
    baseTokenPrice * selectedPool.tvl.tokenA +
    quoteTokenPrice * selectedPool.tvl.tokenB

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {
        const isSeveralBaseAddresses =
          allTokensData.filter((el) => el.mint === selectedPool.tokenA).length >
          1

        const isSeveralQuoteAddresses =
          allTokensData.filter((el) => el.mint === selectedPool.tokenB).length >
          1

        setBaseTokenAddressFromSeveral('')
        setQuoteTokenAddressFromSeveral('')
        setBaseAmount('')
        setQuoteAmount('')
        setWarningChecked(false)
        setOperationLoading(false)
        setIsSelectorForSeveralBaseAddressesOpen(isSeveralBaseAddresses)
        setIsSelectorForSeveralQuoteAddressesOpen(isSeveralQuoteAddresses)
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Deposit Liquidity</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </Row>
      <RowContainer>
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Enter the amount of the first coin you wish to add, the second coin
          will adjust according to the match of a pool ratio.
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder={'0'}
          theme={theme}
          value={baseAmount}
          onChange={setBaseAmountWithQuote}
          symbol={baseSymbol}
          alreadyInPool={withdrawAmountTokenA}
          maxBalance={maxBaseAmount}
          needAlreadyInPool={false}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <InputWithCoins
          placeholder={'0'}
          theme={theme}
          value={quoteAmount}
          onChange={setQuoteAmountWithBase}
          symbol={quoteSymbol}
          alreadyInPool={withdrawAmountTokenB}
          maxBalance={maxQuoteAmount}
          needAlreadyInPool={false}
        />
        <Line />
        <InputWithTotal theme={theme} value={total} />
      </RowContainer>

      <Row
        margin={'2rem 0 1rem 0'}
        align={'flex-start'}
        justify={'space-between'}
      >
        <Row direction={'column'} align={'flex-start'} justify="flex-start">
          <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
            Total Value Locked:
          </Text>
          <Text
            fontSize={'1.5rem'}
            color={'#A5E898'}
            fontFamily={'Avenir Next Demi'}
            style={{ marginBottom: '1rem' }}
          >
            ${formatNumberToUSFormat(stripDigitPlaces(tvlUSD, 2))}
          </Text>
          <Text fontSize={'1.5rem'}>
            {formatNumberToUSFormat(
              stripDigitPlaces(selectedPool.tvl.tokenA, 2)
            )}{' '}
            {getTokenNameByMintAddress(selectedPool.tokenA)} /{' '}
            {formatNumberToUSFormat(
              stripDigitPlaces(selectedPool.tvl.tokenB, 2)
            )}{' '}
            {getTokenNameByMintAddress(selectedPool.tokenB)}
          </Text>
        </Row>
        <Row direction={'column'}>
          <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
            APY (24h)
          </Text>
          <Row>
            <Text
              fontSize={'1.5rem'}
              color={'#A5E898'}
              fontFamily={'Avenir Next Demi'}
            >
              {stripDigitPlaces(selectedPool.apy24h, 6)}%
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
                ? 'Sorry, but you need to left some SOL (at least 0.1 SOL) on your wallet SOL account to successfully execute further transactions.'
                : baseAmount > maxBaseAmount
                ? `You entered more token ${baseSymbol} amount than you have.`
                : quoteAmount > maxQuoteAmount
                ? `You entered more ${quoteSymbol} amount than you have.`
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
            const userBaseTokenAmount = +baseAmount * 10 ** baseTokenDecimals
            const userQuoteTokenAmount = +quoteAmount * 10 ** quoteTokenDecimals

            if (
              !userTokenAccountA ||
              !userTokenAccountB ||
              !userBaseTokenAmount ||
              !userQuoteTokenAmount
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
                userBaseTokenAmount,
                userQuoteTokenAmount,
              })

              return
            }

            console.log('userPoolTokenAccount', userPoolTokenAccount)
            await setOperationLoading(true)

            const result = await createBasket({
              wallet,
              connection,
              poolPublicKey: new PublicKey(selectedPool.swapToken),
              userBaseTokenAmount,
              userQuoteTokenAmount,
              userBaseTokenAccount: new PublicKey(userTokenAccountA),
              userQuoteTokenAccount: new PublicKey(userTokenAccountB),
              ...(userPoolTokenAccount
                ? { userPoolTokenAccount: new PublicKey(userPoolTokenAccount) }
                : { userPoolTokenAccount: null }),
              transferSOLToWrapped: isPoolWithSOLToken && isNativeSOLSelected,
            })

            // start button loader

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

            await setTimeout(() => refreshAllTokensData(), 7500)
            // end button loader
            
            await setTimeout(() => refreshAllTokensData(), 15000)

            await close()
          }}
        >
          Deposit liquidity
        </BlueButton>
      </RowContainer>
      <SelectSeveralAddressesPopup
        theme={theme}
        tokens={allTokensData.filter((el) => el.mint === selectedPool.tokenA)}
        open={isSelectorForSeveralBaseAddressesOpen}
        close={() => setIsSelectorForSeveralBaseAddressesOpen(false)}
        selectTokenMintAddress={() => {}}
        selectTokenAddressFromSeveral={setBaseTokenAddressFromSeveral}
      />
      <SelectSeveralAddressesPopup
        theme={theme}
        tokens={allTokensData.filter((el) => el.mint === selectedPool.tokenB)}
        open={isSelectorForSeveralQuoteAddressesOpen}
        close={() => setIsSelectorForSeveralQuoteAddressesOpen(false)}
        selectTokenMintAddress={() => {}}
        selectTokenAddressFromSeveral={setQuoteTokenAddressFromSeveral}
      />
    </DialogWrapper>
  )
}
