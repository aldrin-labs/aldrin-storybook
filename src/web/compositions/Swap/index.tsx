import withTheme from '@material-ui/core/styles/withTheme'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { FONT_SIZES } from '@variables/variables'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import {
  getTokenMintAddressByName,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import {
  getDefaultBaseToken,
  getDefaultQuoteToken,
} from '@sb/dexUtils/pools/swap'
import { getSwapRouteFeesAmount } from '@sb/dexUtils/pools/swap/getSwapStepFeeUSD'
import { useSwapRoute } from '@sb/dexUtils/pools/swap/useSwapRoute'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { formatNumberWithSpaces, notEmpty } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { toMap } from '@sb/utils'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices as getDexTokensPricesRequest } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { getTradingVolumeForAllPools } from '@core/graphql/queries/pools/getTradingVolumeForAllPools'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { withRegionCheck } from '@core/hoc/withRegionCheck'
import {
  getNumberOfDecimalsFromNumber,
  getNumberOfIntegersFromNumber,
  stripByAmount,
} from '@core/utils/chartPageUtils'
import { CHARTS_API_URL, PROTOCOL } from '@core/utils/config'
import { DAY, endOfHourTimestamp } from '@core/utils/dateUtils'
import { numberWithOneDotRegexp } from '@core/utils/helpers'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import ArrowsExchangeIcon from '@icons/arrowsExchange.svg'
import SettingIcon from '@icons/settings.svg'

import { INPUT_FORMATTERS } from '../../components/Input'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { getTokenDataByMint } from '../Pools/utils'
import { TokenSelector, SwapAmountInput } from './components/Inputs/index'
import { SelectCoinPopup } from './components/SelectCoinPopup/SelectCoinPopup'
import { SwapSearch } from './components/SwapSearch'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
import {
  SwapPageContainer,
  SwapContentContainer,
  SwapBlockTemplate,
  SwapPageLayout,
  ReverseTokensContainer,
  SwapButton,
  BlackRow,
  RowTitle,
  RowValue,
  RowImpactTitle,
  SlippageButton,
  InfoIconContainer,
} from './styles'
import { getOHLCVMarketTypeFromSwapRoute, getSwapButtonText } from './utils'

const SwapPage = ({
  publicKey,
  getPoolsInfoQuery,
  getDexTokensPricesQuery,
  getTradingVolumeForAllPoolsQuery,
}: {
  publicKey: string
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getTradingVolumeForAllPoolsQuery: {
    getTradingVolumeForAllPools: { pool: string; tradingVolume: number }[]
  }
}) => {
  const theme = useTheme()
  const { wallet } = useWallet()
  const tokenInfos = useTokenInfos()

  const [userTokensData, refreshUserTokensData] = useUserTokenAccounts()

  const { getPoolsInfo: pools } = getPoolsInfoQuery
  const poolsMap = toMap(pools, (pool) => pool.swapToken)

  const { getTradingVolumeForAllPools: poolsTradingVolume = [] } =
    getTradingVolumeForAllPoolsQuery || { getTradingVolumeForAllPools: [] }

  // separate getting top pools

  const topPoolsByTradingVolume = [...poolsTradingVolume]
    .sort((a, b) => b.tradingVolume - a.tradingVolume)
    .map((poolWithVolume) => poolsMap.get(poolWithVolume.pool))
    .filter(notEmpty)

  const topTradingPairs = topPoolsByTradingVolume.map((pool) => {
    const baseSymbol = tokenInfos.get(pool.tokenA)?.symbol
    const quoteSymbol = tokenInfos.get(pool.tokenB)?.symbol

    return {
      baseMint: pool.tokenA,
      quoteMint: pool.tokenB,
      baseSymbol,
      quoteSymbol,
      pair: `${baseSymbol}_${quoteSymbol}`,
    }
  })

  const topTradingMints = [
    ...new Set(
      topTradingPairs.map((pair) => [pair.baseMint, pair.quoteMint]).flat()
    ),
  ]

  const { getDexTokensPrices = [] } = getDexTokensPricesQuery || {
    getDexTokensPrices: [],
  }

  const dexTokensPricesMap = getDexTokensPrices.reduce(
    (acc, el) => acc.set(el.symbol, el.price),
    new Map()
  )

  const [inputTokenMintAddress, setInputTokenMintAddress] = useState<string>('')
  const [outputTokenMintAddress, setOutputTokenMintAddress] =
    useState<string>('')

  // set values from redirect or default one
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    const inputFromRedirect = urlParams.get('base')
    const outputFromRedirect = urlParams.get('quote')

    const inputTokenMint = inputFromRedirect
      ? getTokenMintAddressByName(inputFromRedirect) || ''
      : getTokenMintAddressByName(getDefaultBaseToken(false)) || ''

    setInputTokenMintAddress(inputTokenMint)

    const outputTokenMint = outputFromRedirect
      ? getTokenMintAddressByName(outputFromRedirect) || ''
      : getTokenMintAddressByName(getDefaultQuoteToken(false)) || ''

    setOutputTokenMintAddress(outputTokenMint)
  }, [])

  const [slippage, setSlippage] = useState<number>(0.3)
  const [isTokensAddressesPopupOpen, setIsTokensAddressesPopupOpen] =
    useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  const [
    selectedInputTokenAddressFromSeveral,
    setInputTokenAddressFromSeveral,
  ] = useState<string>('')
  const [
    selectedOutputTokenAddressFromSeveral,
    setOutputTokenAddressFromSeveral,
  ] = useState<string>('')

  const [isInputTokenSelecting, setIsInputTokenSelecting] = useState(false)
  const [isSwapInProgress, setIsSwapInProgress] = useState(false)

  // above chart
  // const [priceShowField, setPriceShowField] = useState<'input' | 'output'>(
  //   'input'
  // )

  // const basePrice = dexTokensPricesMap.get(inputSymbol) || 0
  // const quotePrice = dexTokensPricesMap.get(outputSymbol) || 0

  // const estimatedPrice = stripByAmount(
  //   getEstimatedPrice({
  //     inputAmount,
  //     outputAmount,
  //     inputPrice: basePrice,
  //     outputPrice: quotePrice,
  //     field: priceShowField,
  //   })
  // )

  const {
    mints: tokenSelectorMints,
    swapRoute,
    inputAmount,
    outputAmount,
    loading: isLoadingSwapRoute,
    setFieldAmount,
    refresh: refreshAll,
    exchange,
    depositAndFee,
  } = useSwapRoute({
    pools,
    inputMint: inputTokenMintAddress,
    outputMint: outputTokenMintAddress,
    selectedInputTokenAddressFromSeveral,
    selectedOutputTokenAddressFromSeveral,
    slippage,
  })

  const inputSymbol = getTokenNameByMintAddress(inputTokenMintAddress)
  const outputSymbol = getTokenNameByMintAddress(outputTokenMintAddress)

  let { amount: maxInputAmount } = getTokenDataByMint(
    userTokensData,
    inputTokenMintAddress,
    selectedInputTokenAddressFromSeveral
  )

  const totalFeeUSD = getSwapRouteFeesAmount({
    swapRoute,
    pricesMap: dexTokensPricesMap,
  })

  const { amount: maxQuoteAmount } = getTokenDataByMint(
    userTokensData,
    outputTokenMintAddress,
    selectedOutputTokenAddressFromSeveral
  )

  // if we swap native sol to smth, we need to leave some SOL for covering fees
  if (
    depositAndFee &&
    inputTokenMintAddress === WRAPPED_SOL_MINT.toString() &&
    (!selectedInputTokenAddressFromSeveral ||
      wallet.publicKey?.toString() === selectedInputTokenAddressFromSeveral)
  ) {
    if (maxInputAmount >= depositAndFee) {
      maxInputAmount -= depositAndFee
    } else {
      maxInputAmount = 0
    }
  }

  const isEmptyInputAmount = +inputAmount === 0
  const isTokenABalanceInsufficient = inputAmount > +maxInputAmount

  const reverseTokens = () => {
    setInputTokenMintAddress(outputTokenMintAddress)
    setOutputTokenMintAddress(inputTokenMintAddress)

    setInputTokenAddressFromSeveral(selectedOutputTokenAddressFromSeveral)
    setOutputTokenAddressFromSeveral(selectedInputTokenAddressFromSeveral)

    if (outputAmount) {
      setFieldAmount(
        stripByAmount(outputAmount),
        'input',
        outputTokenMintAddress,
        inputTokenMintAddress
      )
    }
  }

  const isButtonDisabled = isTokenABalanceInsufficient || isSwapInProgress

  const priceImpact = swapRoute
    .filter((step) => step.ammLabel === 'Aldrin')
    .reduce((acc, step) => {
      const stepPriceImpact =
        (step.isSwapBaseToQuote
          ? step.swapAmountIn / step.pool.tvl.tokenA
          : step.swapAmountIn / step.pool.tvl.tokenB) * 100

      if (stepPriceImpact > 100) return 100

      if (stepPriceImpact > acc) {
        return stepPriceImpact
      }

      return acc
    }, 0)

  const isHighPriceImpact = priceImpact >= 1

  const buttonText = getSwapButtonText({
    baseSymbol: inputSymbol,
    minInputAmount: 0,
    isSwapRouteExists: swapRoute.length !== 0,
    isEmptyInputAmount,
    isTokenABalanceInsufficient,
    isLoadingSwapRoute,
    isTooSmallInputAmount: false,
    isSwapInProgress,
  })

  return (
    <SwapPageLayout>
      <SwapPageContainer
        justify="center"
        direction="row"
        height="100%"
        wrap="nowrap"
      >
        <SwapContentContainer direction="column">
          <RowContainer justify="flex-start" margin="0 0 1em 0">
            <SwapSearch
              topTradingMints={topTradingMints}
              topTradingPairs={topTradingPairs}
              data-testid="swap-search-field"
              tokens={tokenSelectorMints.map((mint) => ({ mint }))}
              onSelect={(args) => {
                const { amountFrom, tokenFrom, tokenTo } = args
                setInputTokenMintAddress(tokenFrom.mint)
                setOutputTokenMintAddress(tokenTo.mint)
                if (amountFrom) {
                  setFieldAmount(
                    +amountFrom,
                    'input',
                    tokenFrom.mint,
                    tokenTo.mint
                  )
                }
              }}
            />
          </RowContainer>
          <SwapBlockTemplate width="100%">
            <RowContainer margin="0 0 3em 0" justify="space-between">
              <Row>
                <ReloadTimer
                  data-testid="swap-reload-data-timer"
                  duration={15}
                  initialRemainingTime={15}
                  callback={refreshAll}
                  showTime
                  margin="0"
                  timeStyles={{
                    color: theme.colors.gray0,
                  }}
                  timerStyles={{
                    background: 'transparent',
                  }}
                  color={theme.colors.blue5}
                  trailColor={theme.colors.white}
                />
              </Row>
              <Row>
                <Row style={{ position: 'relative' }}>
                  <SlippageButton
                    data-testid="increace-slippage-tolerance"
                    onClick={() => {
                      setIsTokensAddressesPopupOpen(true)

                      // const newSlippage = +(+slippage + SLIPPAGE_STEP).toFixed(
                      //   2
                      // )

                      // setSlippage(newSlippage)
                    }}
                  >
                    <SvgIcon
                      src={SettingIcon}
                      height="0.75em"
                      width="0.75em"
                      style={{ marginRight: '0.4em' }}
                    />{' '}
                    <span style={{ fontSize: FONT_SIZES.esm }}>
                      {slippage}%
                    </span>
                  </SlippageButton>
                </Row>
              </Row>
            </RowContainer>
            <RowContainer
              style={{
                position: 'relative',
                border: `1px solid ${theme.colors.gray6}`,
                borderRadius: '0.8em',
                padding: '0.8em 0',
              }}
              margin=".5em 0 0 0"
              direction="column"
            >
              <RowContainer
                wrap="nowrap"
                justify="space-between"
                padding="0 0 0.8em 0"
                style={{ borderBottom: `1px solid ${theme.colors.gray6}` }}
              >
                <SwapAmountInput
                  title="From"
                  maxAmount={maxInputAmount}
                  amount={formatNumberWithSpaces(inputAmount)}
                  disabled={false}
                  onChange={(v) => {
                    if (v === '') {
                      setFieldAmount(v, 'input')
                      return
                    }
                    const parsedValue = INPUT_FORMATTERS.DECIMAL(v, inputAmount)

                    if (
                      numberWithOneDotRegexp.test(parsedValue) &&
                      getNumberOfIntegersFromNumber(parsedValue) <= 8 &&
                      getNumberOfDecimalsFromNumber(parsedValue) <= 8
                    ) {
                      setFieldAmount(parsedValue, 'input')
                    }
                  }}
                  appendComponent={
                    <TokenSelector
                      mint={inputTokenMintAddress}
                      data-testid="swap-input-token-selector"
                      onClick={() => {
                        setIsInputTokenSelecting(true)
                        setIsSelectCoinPopupOpen(true)
                      }}
                    />
                  }
                />
              </RowContainer>
              <ReverseTokensContainer onClick={reverseTokens}>
                <SvgIcon src={ArrowsExchangeIcon} />
              </ReverseTokensContainer>
              <RowContainer
                wrap="nowrap"
                justify="space-between"
                padding="0.8em 0 0 0"
              >
                <SwapAmountInput
                  title="To (Estimated)"
                  maxAmount={maxQuoteAmount}
                  amount={outputAmount}
                  onChange={(v) => {
                    if (v === '') {
                      setFieldAmount(v, 'output')
                      return
                    }

                    if (
                      numberWithOneDotRegexp.test(v) &&
                      getNumberOfIntegersFromNumber(v) <= 8 &&
                      getNumberOfDecimalsFromNumber(v) <= 8
                    ) {
                      setFieldAmount(v, 'output')
                    }
                  }}
                  appendComponent={
                    <TokenSelector
                      mint={outputTokenMintAddress}
                      data-testid="swap-output-token-selector"
                      onClick={() => {
                        setIsInputTokenSelecting(false)
                        setIsSelectCoinPopupOpen(true)
                      }}
                    />
                  }
                />
              </RowContainer>
            </RowContainer>
            {!isEmptyInputAmount && (
              <RowContainer justify="space-between" margin="1em 0 0 0">
                <BlackRow width="calc(50% - 0.6em)">
                  <RowTitle>Fee:</RowTitle>
                  <RowValue>
                    ${formatNumberToUSFormat(stripDigitPlaces(totalFeeUSD, 2))}
                  </RowValue>
                </BlackRow>
                <BlackRow width="calc(50% - 0.6em)">
                  <RowImpactTitle isHighPriceImpact={isHighPriceImpact}>
                    {isHighPriceImpact ? 'High Price Impact' : 'Fair price'}
                  </RowImpactTitle>

                  <InfoIconContainer isHighPriceImpact={isHighPriceImpact}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                        stroke="currentColor"
                      />
                      <path
                        d="M6 3.5H6.00656"
                        stroke="currentColor"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 5.5V8"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </InfoIconContainer>
                </BlackRow>
                {/* <BlackRow width="calc(50% - 0.8rem)">
                    <RowTitle>Network fee:</RowTitle>
                    <RowValue style={{ display: 'flex' }}>
                      {wallet.connected
                        ? stripDigitPlaces(depositAndFee, 6)
                        : '-'}{' '}
                      SOL{' '}
                    </RowValue>
                  </BlackRow> */}
              </RowContainer>
            )}
            {/* {!isLoadingSwapRoute && pctDiffUsedAndUIInputAmount >= 5 && (
              <RowContainer margin="0 0 .5em 0">
                <Text>
                  This swap will only use {swapRouteInAmount} (out of{' '}
                  {inputAmount}) USDC
                </Text>
              </RowContainer>
            )} */}
            <RowContainer margin="3em 0 0 0">
              {!publicKey ? (
                <BtnCustom
                  theme={theme}
                  onClick={() => {
                    setIsConnectWalletPopupOpen(true)
                  }}
                  needMinWidth={false}
                  btnWidth="100%"
                  height="4em"
                  fontSize="1em"
                  padding="1.4em 5em"
                  borderRadius="1.1rem"
                  borderColor={theme.colors.blue5}
                  btnColor="#fff"
                  backgroundColor={theme.colors.blue5}
                  textTransform="none"
                  transition="all .4s ease-out"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Connect wallet
                </BtnCustom>
              ) : (
                <SwapButton
                  isHighPriceImpact={isHighPriceImpact}
                  disabled={isButtonDisabled}
                  $fontSize="md"
                  minWidth="100%"
                  $variant="none"
                  onClick={async () => {
                    if (!swapRoute) return

                    setIsSwapInProgress(true)

                    try {
                      const result = await exchange()

                      if (result !== 'success') {
                        notify({
                          type: 'error',
                          message:
                            result !== 'failed'
                              ? 'Transaction cancelled'
                              : 'Swap operation failed. Please, try to increase slippage or try a bit later.',
                        })
                      } else {
                        notify({
                          type: 'success',
                          message: 'Swap executed successfully.',
                        })
                      }

                      refreshUserTokensData()
                      refreshAll()

                      // reset fields
                      if (result === 'success') {
                        await setFieldAmount('', 'input')
                      }

                      // remove loader
                      setIsSwapInProgress(false)
                    } catch (e) {
                      console.log('error', e)
                    }
                  }}
                >
                  <span>{buttonText}</span>
                </SwapButton>
              )}
            </RowContainer>
          </SwapBlockTemplate>
        </SwapContentContainer>

        <SelectCoinPopup
          data-testid="swap-select-token-popup"
          theme={theme}
          mints={tokenSelectorMints}
          topTradingMints={topTradingMints}
          allTokensData={userTokensData}
          pricesMap={dexTokensPricesMap}
          open={isSelectCoinPopupOpen}
          isBaseTokenSelecting={isInputTokenSelecting}
          setBaseTokenAddressFromSeveral={setInputTokenAddressFromSeveral}
          setQuoteTokenAddressFromSeveral={setOutputTokenAddressFromSeveral}
          selectTokenMintAddress={(address: string) => {
            if (isInputTokenSelecting) {
              if (outputTokenMintAddress === address) {
                setOutputTokenMintAddress('')
              }

              if (selectedInputTokenAddressFromSeveral) {
                setInputTokenAddressFromSeveral('')
              }

              setInputTokenMintAddress(address)
              setIsSelectCoinPopupOpen(false)
            } else {
              if (inputTokenMintAddress === address) {
                setInputTokenMintAddress('')
              }

              if (selectedOutputTokenAddressFromSeveral) {
                setOutputTokenAddressFromSeveral('')
              }

              setOutputTokenMintAddress(address)
              setIsSelectCoinPopupOpen(false)
            }
          }}
          close={() => setIsSelectCoinPopupOpen(false)}
        />

        <TokenAddressesPopup
          quoteTokenMintAddress={outputTokenMintAddress}
          baseTokenMintAddress={inputTokenMintAddress}
          allTokensData={userTokensData}
          open={isTokensAddressesPopupOpen}
          close={() => setIsTokensAddressesPopupOpen(false)}
        />

        <ConnectWalletPopup
          open={isConnectWalletPopupOpen}
          onClose={() => setIsConnectWalletPopupOpen(false)}
        />
        <div style={{ height: '15em', width: '30em', marginLeft: '0.6em' }}>
          <iframe
            allowFullScreen
            style={{ borderWidth: 0 }}
            src={`${PROTOCOL}//${CHARTS_API_URL}/?symbol=${inputSymbol}/${outputSymbol}&marketType=${getOHLCVMarketTypeFromSwapRoute(
              swapRoute
            )}&exchange=serum&theme=serum&isMobile=true${
              wallet.connected ? `&user_id=${wallet.publicKey}` : ''
            }`}
            height="100%"
            width="100%"
            id="tv_chart_serum"
            title="Chart"
            key={`${inputSymbol}/${outputSymbol}`}
          />
        </div>
      </SwapPageContainer>
    </SwapPageLayout>
  )
}

// @ts-ignore
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
  }),
  queryRendererHoc({
    name: 'getTradingVolumeForAllPoolsQuery',
    query: getTradingVolumeForAllPools,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    variables: () => ({
      timestampTo: endOfHourTimestamp(),
      timestampFrom: endOfHourTimestamp() - DAY,
    }),
  })
)(SwapPage)
