import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Page } from '@sb/components/Layout'
import SvgIcon from '@sb/components/SvgIcon'
import {
  costOfAddingToken,
  TRANSACTION_COMMON_SOL_FEE,
} from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  ReloadTimer,
  TimerButton,
} from '@sb/compositions/Rebalance/components/ReloadTimer'
import {
  ALL_TOKENS_MINTS,
  getTokenMintAddressByName,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import {
  getPoolsForSwapActiveTab,
  getSelectedPoolForSwap,
  getDefaultBaseToken,
  getDefaultQuoteToken,
} from '@sb/dexUtils/pools/swap/index'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices as getDexTokensPricesRequest } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { withRegionCheck } from '@core/hoc/withRegionCheck'
import {
  getNumberOfDecimalsFromNumber,
  getNumberOfIntegersFromNumber,
  stripByAmount,
} from '@core/utils/chartPageUtils'
import { removeDecimals } from '@core/utils/helpers'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import Inform from '@icons/inform.svg'
import ReverseArrows from '@icons/reverseArrows.svg'
import Arrows from '@icons/switchArrows.svg'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'
import { getTokenDataByMint } from '../Pools/utils'
import { TokenSelector, SwapAmountInput } from './components/Inputs/index'
import { SelectCoinPopup } from './components/SelectCoinPopup'
import { SwapSearch } from './components/SwapSearch'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
import { TransactionSettingsPopup } from './components/TransactionSettingsPopup'
import { SLIPPAGE_STEP } from './config'
import {
  SwapPageContainer,
  ValueButton,
  ValueInput,
  BlackRow,
  RowTitle,
  RowValue,
  RowAmountValue,
  SwapButton,
  ReverseTokensContainer,
} from './styles'
import { useJupiterSwap } from './useJupiterSwap'
import {
  getEstimatedPrice,
  getFeeFromSwapRoute,
  getSwapButtonText,
} from './utils'

const SwapPage = ({
  theme,
  publicKey,
  getPoolsInfoQuery,
  getDexTokensPricesQuery,
}: {
  theme: Theme
  publicKey: string
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const { wallet } = useWallet()
  const tokenInfos = useTokenInfos()

  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts()

  const allPools = getPoolsInfoQuery.getPoolsInfo
  const nativeSOLTokenData = allTokensData[0]

  const { getDexTokensPrices = [] } = getDexTokensPricesQuery || {
    getDexTokensPrices: [],
  }

  const dexTokensPricesMap = getDexTokensPrices.reduce(
    (acc, el) => acc.set(el.symbol, el.price),
    new Map()
  )

  const [isStableSwapTabActive, setIsStableSwapTabActive] =
    useState<boolean>(false)

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>('')
  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>('')

  // set values from redirect or default one
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    const baseFromRedirect = urlParams.get('base')
    const quoteFromRedirect = urlParams.get('quote')
    const isStableSwapFromRedirect = urlParams.get('isStablePool') === 'true'

    const baseTokenMint = baseFromRedirect
      ? getTokenMintAddressByName(baseFromRedirect) || ''
      : getTokenMintAddressByName(
          getDefaultBaseToken(isStableSwapFromRedirect)
        ) || ''

    setBaseTokenMintAddress(baseTokenMint)

    const quoteTokenMint = quoteFromRedirect
      ? getTokenMintAddressByName(quoteFromRedirect) || ''
      : getTokenMintAddressByName(
          getDefaultQuoteToken(isStableSwapFromRedirect)
        ) || ''

    setQuoteTokenMintAddress(quoteTokenMint)

    setIsStableSwapTabActive(isStableSwapFromRedirect)
  }, [])

  useEffect(() => {
    const updatedPoolsList = getPoolsForSwapActiveTab({
      pools: allPools,
      isStableSwapTabActive,
    })

    const isPoolExistInNewTab = getSelectedPoolForSwap({
      pools: updatedPoolsList,
      baseTokenMintAddress,
      quoteTokenMintAddress,
    })

    // set tokens to default one if pool with selected tokens
    // does not exist in new tab
    if (!isPoolExistInNewTab) {
      const defaultBaseTokenMint =
        getTokenMintAddressByName(getDefaultBaseToken(isStableSwapTabActive)) ||
        ''

      const defaultQuoteTokenMint =
        getTokenMintAddressByName(
          getDefaultQuoteToken(isStableSwapTabActive)
        ) || ''

      setBaseTokenMintAddress(defaultBaseTokenMint)
      setQuoteTokenMintAddress(defaultQuoteTokenMint)
    }
  }, [isStableSwapTabActive])

  const pools = getPoolsForSwapActiveTab({
    pools: allPools,
    isStableSwapTabActive,
  })

  const [slippage, setSlippage] = useState<number>(0.3)
  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)

  const [selectedBaseTokenAddressFromSeveral, setBaseTokenAddressFromSeveral] =
    useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')
  const [isTransactionSettingsPopupOpen, openTransactionSettingsPopup] =
    useState(false)

  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)
  const [isSwapInProgress, setIsSwapInProgress] = useState(false)
  const [priceShowField, setPriceShowField] = useState<'input' | 'output'>(
    'input'
  )

  const baseSymbol = getTokenNameByMintAddress(baseTokenMintAddress)
  const quoteSymbol = getTokenNameByMintAddress(quoteTokenMintAddress)

  const basePrice = dexTokensPricesMap.get(baseSymbol) || 0
  const quotePrice = dexTokensPricesMap.get(quoteSymbol) || 0

  const { decimals: quoteTokenDecimals } = tokenInfos.get(
    quoteTokenMintAddress
  ) || {
    decimals: 0,
  }

  let { address: userBaseTokenAccount, amount: maxBaseAmount } =
    getTokenDataByMint(
      allTokensData,
      baseTokenMintAddress,
      selectedBaseTokenAddressFromSeveral
    )

  // if we swap native sol to smth, we need to leave some SOL for covering fees
  if (nativeSOLTokenData?.address === userBaseTokenAccount) {
    const solFees = TRANSACTION_COMMON_SOL_FEE + costOfAddingToken

    if (maxBaseAmount >= solFees) {
      maxBaseAmount -= solFees
    } else {
      maxBaseAmount = 0
    }
  }

  const { amount: maxQuoteAmount } = getTokenDataByMint(
    allTokensData,
    quoteTokenMintAddress,
    selectedQuoteTokenAddressFromSeveral
  )

  const {
    jupiter,
    route: swapRoute,
    inputAmount,
    outputAmount,
    loading: isLoadingSwapRoute,
    depositAndFee,
    setInputsAmounts,
    refresh: refreshAmountsWithSwapRoute,
    reverseTokenAmounts,
  } = useJupiterSwap({
    inputMint: baseTokenMintAddress,
    outputMint: quoteTokenMintAddress,
    slippage,
  })

  const { outAmountWithSlippage, priceImpactPct } = swapRoute || {
    inAmount: 0,
    outAmount: 0,
    outAmountWithSlippage: 0,
    priceImpactPct: 0,
  }

  const outAmountWithSlippageWithoutDecimals = removeDecimals(
    outAmountWithSlippage,
    quoteTokenDecimals
  )

  const needEnterAmount = +inputAmount === 0
  const isTokenABalanceInsufficient = inputAmount > +maxBaseAmount

  const reverseTokens = () => {
    setBaseTokenMintAddress(quoteTokenMintAddress)
    setQuoteTokenMintAddress(baseTokenMintAddress)

    setBaseTokenAddressFromSeveral(selectedQuoteTokenAddressFromSeveral)
    setQuoteTokenAddressFromSeveral(selectedBaseTokenAddressFromSeveral)
  }

  const isButtonDisabled =
    isLoadingSwapRoute ||
    isTokenABalanceInsufficient ||
    +inputAmount === 0 ||
    +outputAmount === 0 ||
    isSwapInProgress

  const refreshAll = async () => {
    refreshAllTokensData()
    await refreshAmountsWithSwapRoute()
  }

  const mints = [
    ...new Set([
      ...pools.map((i) => [i.tokenA, i.tokenB]).flat(),
      ...ALL_TOKENS_MINTS.map(({ address }) => address.toString()),
    ]),
  ]

  const networkFee = depositAndFee
    ? (depositAndFee.ataDeposit * depositAndFee.ataDepositLength +
        depositAndFee.openOrdersDeposits.reduce((acc, n) => acc + n, 0) +
        depositAndFee.signatureFee) /
      LAMPORTS_PER_SOL
    : swapRoute?.marketInfos.length * TRANSACTION_COMMON_SOL_FEE

  const outputUSD = +outputAmount * quotePrice

  console.log('swapRoute', swapRoute)

  return (
    <Page>
      <SwapPageContainer direction="column" height="100%" wrap="nowrap">
        <>
          <Row width="50rem" justify="flex-start" margin="0 0 2rem 0">
            <SwapSearch
              tokens={mints.map((mint) => ({ mint }))}
              onSelect={(args) => {
                const { amountFrom, tokenFrom, tokenTo } = args
                setBaseTokenMintAddress(tokenFrom.mint)
                setQuoteTokenMintAddress(tokenTo.mint)
                setInputsAmounts(+amountFrom, tokenFrom.mint, tokenTo.mint)
              }}
            />
          </Row>
          <BlockTemplate
            theme={theme}
            width="50rem"
            background="#1A1A1A"
            style={{ padding: '2rem', zIndex: '10' }}
          >
            <RowContainer margin="0 0 1rem 0" justify="space-between">
              <Row>
                <ReloadTimer
                  duration={15}
                  initialRemainingTime={15}
                  margin="0 1.5rem 0 0"
                  callback={refreshAll}
                  showTime
                />
                {baseTokenMintAddress && quoteTokenMintAddress && (
                  <TimerButton
                    onClick={() => openTokensAddressesPopup(true)}
                    margin="0 1.5rem 0 0"
                  >
                    <SvgIcon src={Inform} width="60%" height="60%" />
                  </TimerButton>
                )}
              </Row>
              <Row>
                <Text padding="0 0.8rem 0 0">Slippage Tolerance:</Text>
                <Row style={{ position: 'relative' }}>
                  <ValueInput
                    onChange={(e) => {
                      if (
                        /^-?\d*\.?\d*$/.test(e.target.value) &&
                        getNumberOfIntegersFromNumber(e.target.value) <= 2 &&
                        getNumberOfDecimalsFromNumber(e.target.value) <= 2
                      ) {
                        setSlippage(e.target.value)
                      }
                    }}
                    onBlur={() => {
                      if (+slippage <= 0) {
                        setSlippage(0.3)
                      }
                    }}
                    value={slippage}
                    placeholder="1.00"
                    theme={theme}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      fontFamily: 'Avenir Next Medium',
                      color: '#fbf2f2',
                      fontSize: '1.3rem',
                      right: '1.5rem',
                    }}
                  >
                    %
                  </div>
                </Row>
                <ValueButton
                  theme={theme}
                  onClick={() => {
                    const newSlippage = +(slippage - SLIPPAGE_STEP).toFixed(2)

                    if (newSlippage > 0) {
                      setSlippage(newSlippage)
                    }
                  }}
                >
                  -
                </ValueButton>
                <ValueButton
                  theme={theme}
                  onClick={() => {
                    const newSlippage = +(slippage + SLIPPAGE_STEP).toFixed(2)

                    setSlippage(newSlippage)
                  }}
                >
                  +
                </ValueButton>
              </Row>
            </RowContainer>
            <RowContainer
              style={{ position: 'relative' }}
              margin="1rem 0 0 0"
              direction="column"
            >
              <RowContainer justify="space-between">
                <Row width="calc(65% - .2rem)">
                  <SwapAmountInput
                    title="You Pay"
                    maxAmount={maxBaseAmount}
                    amount={inputAmount}
                    disabled={false}
                    onChange={(v) => setInputsAmounts(v)}
                    sharpSides={['top-right', 'bottom-left', 'bottom-right']}
                    appendComponent={<Row>{/* two buttons */}</Row>}
                  />
                </Row>
                <Row width="calc(35% - 0.2rem)">
                  <TokenSelector
                    symbol={baseSymbol}
                    sharpSides={['top-left', 'bottom-left']}
                    onClick={() => {
                      setIsBaseTokenSelecting(true)
                      setIsSelectCoinPopupOpen(true)
                    }}
                  />
                </Row>
              </RowContainer>
              <ReverseTokensContainer onClick={reverseTokens}>
                <SvgIcon src={Arrows} width="1.5rem" height="1.5rem" />
              </ReverseTokensContainer>
              <RowContainer justify="space-between" margin=".4rem 0 1.6rem 0">
                <Row width="calc(65% - .2rem)">
                  <SwapAmountInput
                    title="You Receive"
                    maxAmount={maxQuoteAmount}
                    amount={outputAmount}
                    disabled
                    sharpSides={['top-right', 'top-left', 'bottom-right']}
                    appendComponent={
                      <Text
                        fontFamily="Avenir Next"
                        fontSize="1.2rem"
                        color="#A6A6A6"
                      >
                        ≈$
                        {outputUSD ? stripDigitPlaces(outputUSD, 2) : '0.00'}
                      </Text>
                    }
                  />
                </Row>
                <Row width="calc(35% - .2rem)">
                  <TokenSelector
                    symbol={quoteSymbol}
                    sharpSides={['top-left', 'bottom-left']}
                    onClick={() => {
                      setIsBaseTokenSelecting(false)
                      setIsSelectCoinPopupOpen(true)
                    }}
                  />
                </Row>
              </RowContainer>
            </RowContainer>
            <RowContainer>
              {!publicKey ? (
                <BtnCustom
                  theme={theme}
                  onClick={wallet.connect}
                  needMinWidth={false}
                  btnWidth="100%"
                  height="6.4rem"
                  fontSize="1.6rem"
                  padding="2rem 8rem"
                  borderRadius="1.1rem"
                  borderColor={theme.palette.blue.serum}
                  btnColor="#fff"
                  backgroundColor={theme.palette.blue.serum}
                  textTransform="none"
                  transition="all .4s ease-out"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Connect wallet
                </BtnCustom>
              ) : (
                <SwapButton
                  disabled={isButtonDisabled}
                  onClick={async () => {
                    if (!jupiter || !swapRoute) return

                    setIsSwapInProgress(true)

                    const { execute } = await jupiter.exchange({
                      route: swapRoute,
                    })

                    try {
                      const result = await execute({ wallet })

                      console.log('result', result)

                      if (result.error) {
                        notify({
                          type: 'error',
                          message: result.error.message.includes('cancelled')
                            ? 'Transaction cancelled'
                            : 'Swap operation failed. Please, try to increase slippage or try a bit later.',
                        })
                      } else {
                        notify({
                          type: 'success',
                          message: 'Swap executed successfully.',
                        })
                      }

                      refreshAllTokensData()
                      await refreshAmountsWithSwapRoute()

                      // reset fields
                      if (result === 'success') {
                        await setInputsAmounts('')
                      }

                      // remove loader
                      setIsSwapInProgress(false)
                    } catch (e) {
                      console.log('error', e)
                    }
                  }}
                >
                  {getSwapButtonText({
                    baseSymbol,
                    isSwapRouteExists: !!swapRoute,
                    needEnterAmount,
                    isTokenABalanceInsufficient,
                    isLoadingSwapRoute,
                  })}
                </SwapButton>
              )}
            </RowContainer>

            {inputAmount && outputAmount && (
              <RowContainer direction="column" margin="2rem 0 0 0">
                <RowContainer justify="space-between">
                  <BlackRow width="48%">
                    <RowTitle>Price:</RowTitle>
                    <Row>
                      <RowValue>
                        <RowAmountValue>1</RowAmountValue>
                        {priceShowField === 'input' ? baseSymbol : quoteSymbol}
                      </RowValue>
                      <SvgIcon
                        src={ReverseArrows}
                        height="1.4rem"
                        width="1.4rem"
                        style={{
                          transform: 'rotate(90deg)',
                          margin: '0 0.5rem',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          setPriceShowField(
                            priceShowField === 'input' ? 'output' : 'input'
                          )
                        }
                      />
                      <RowValue>
                        <RowAmountValue>
                          {stripByAmount(
                            getEstimatedPrice({
                              inputAmount: +inputAmount,
                              outputAmount: +outputAmount,
                              inputPrice: basePrice,
                              outputPrice: quotePrice,
                              field: priceShowField,
                            })
                          )}
                        </RowAmountValue>
                        {priceShowField === 'input' ? quoteSymbol : baseSymbol}
                      </RowValue>
                    </Row>
                  </BlackRow>
                  <BlackRow width="48%">
                    <RowTitle>Price Impact:</RowTitle>
                    <RowAmountValue>
                      {priceImpactPct < 0.1 ? '< 0.1' : priceImpactPct}%
                    </RowAmountValue>
                  </BlackRow>
                </RowContainer>

                <RowContainer justify="space-between">
                  <BlackRow width="48%">
                    <RowTitle>Trading fee:</RowTitle>
                    <RowValue>
                      $
                      {stripByAmount(
                        getFeeFromSwapRoute({
                          route: swapRoute,
                          tokenInfos,
                          pricesMap: dexTokensPricesMap,
                        })
                      )}
                    </RowValue>
                  </BlackRow>
                  <BlackRow width="48%">
                    <RowTitle>Network fee:</RowTitle>
                    <RowValue>{networkFee} SOL</RowValue>
                  </BlackRow>
                </RowContainer>

                <BlackRow width="100%">
                  <RowTitle>Minimum Received:</RowTitle>
                  <RowValue>
                    {stripByAmount(outAmountWithSlippageWithoutDecimals)}{' '}
                    {quoteSymbol}
                  </RowValue>
                </BlackRow>
              </RowContainer>
            )}
          </BlockTemplate>
        </>

        <TransactionSettingsPopup
          theme={theme}
          slippage={slippage}
          open={isTransactionSettingsPopupOpen}
          close={() => {
            if (slippage >= 0.01) {
              openTransactionSettingsPopup(false)
            }
          }}
          setSlippage={setSlippage}
        />

        <SelectCoinPopup
          poolsInfo={pools}
          theme={theme}
          mints={mints}
          baseTokenMintAddress={baseTokenMintAddress}
          quoteTokenMintAddress={quoteTokenMintAddress}
          allTokensData={allTokensData}
          open={isSelectCoinPopupOpen}
          isBaseTokenSelecting={isBaseTokenSelecting}
          setBaseTokenAddressFromSeveral={setBaseTokenAddressFromSeveral}
          setQuoteTokenAddressFromSeveral={setQuoteTokenAddressFromSeveral}
          selectTokenMintAddress={(address: string) => {
            if (isBaseTokenSelecting) {
              if (quoteTokenMintAddress === address) {
                setQuoteTokenMintAddress('')
              }

              if (selectedBaseTokenAddressFromSeveral) {
                setBaseTokenAddressFromSeveral('')
              }

              setBaseTokenMintAddress(address)
              setIsSelectCoinPopupOpen(false)
            } else {
              if (baseTokenMintAddress === address) {
                setBaseTokenMintAddress('')
              }

              if (selectedQuoteTokenAddressFromSeveral) {
                setQuoteTokenAddressFromSeveral('')
              }

              setQuoteTokenMintAddress(address)
              setIsSelectCoinPopupOpen(false)
            }
          }}
          close={() => setIsSelectCoinPopupOpen(false)}
        />

        <TokenAddressesPopup
          theme={theme}
          quoteTokenMintAddress={quoteTokenMintAddress}
          baseTokenMintAddress={baseTokenMintAddress}
          allTokensData={allTokensData}
          open={isTokensAddressesPopupOpen}
          close={() => openTokensAddressesPopup(false)}
        />
      </SwapPageContainer>
    </Page>
  )
}

export default compose(
  withTheme(),
  withPublicKey,
  withRegionCheck,
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getDexTokensPricesRequest,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(SwapPage)
