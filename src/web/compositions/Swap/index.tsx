import { SWAP_FEES_SETTINGS, useSwapRoute } from '@aldrin_exchange/swap_hook'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { PublicKey } from '@solana/web3.js'
import { FONT_SIZES } from '@variables/variables'
import { rgba } from 'polished'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { INPUT_FORMATTERS } from '@sb/components/Input'
import { PieTimer } from '@sb/components/PieTimer'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import SvgIcon from '@sb/components/SvgIcon'
import { Toast } from '@sb/components/Toast/Toast'
import { InlineText } from '@sb/components/Typography'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import {
  getTokenMintAddressByName,
  marketsWithMints,
} from '@sb/dexUtils/markets'
import { callToast } from '@sb/dexUtils/notifications'
import { checkIsPoolStable } from '@sb/dexUtils/pools/checkIsPoolStable'
import { getSwapRouteFeesAmount } from '@sb/dexUtils/pools/swap/getSwapStepFeeUSD'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { signAndSendTransactions } from '@sb/dexUtils/transactions'
import { formatNumberWithSpaces, notEmpty } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { toMap } from '@sb/utils'

import { getDexTokensPrices as getDexTokensPricesRequest } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { getTradingVolumeForAllPools } from '@core/graphql/queries/pools/getTradingVolumeForAllPools'
import { walletAdapterToWallet, getTokenDataByMint } from '@core/solana'
import { getTokenNameByMintAddress } from '@core/utils/awesomeMarkets/getTokenNameByMintAddress'
import {
  getNumberOfDecimalsFromNumber,
  getNumberOfIntegersFromNumber,
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { DAY, endOfHourTimestamp } from '@core/utils/dateUtils'
import {
  numberWithOneDotRegexp,
  removeDecimalsFromBN,
} from '@core/utils/helpers'
import { Metrics } from '@core/utils/metrics'

import HalfArrowsIcon from '@icons/halfArrows.svg'
import SettingIcon from '@icons/settings.svg'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { ArrowsExchangeIcon } from './components/Inputs/images/arrowsExchangeIcon'
import { TokenSelector, SwapAmountInput } from './components/Inputs/index'
import { SelectCoinPopup } from './components/SelectCoinPopup/SelectCoinPopup'
import { SwapSearch } from './components/SwapSearch'
import { SwapSettingsPopup } from './components/SwapSettingsPopup'
import { getDefaultBaseToken, getDefaultQuoteToken } from './config'
import {
  SwapPageContainer,
  SwapContentContainer,
  SwapBlockTemplate,
  SwapPageLayout,
  ReverseTokensContainer,
  SwapButton,
  BlackRow,
  RowImpactTitle,
  SlippageButton,
  RightColumn,
  TextButton,
  FailedButtonsRow,
  DropdownIconContainer,
} from './styles'
import { getEstimatedPrice, getSwapButtonText } from './utils'

const SwapPage = ({
  getPoolsInfoQuery,
  getDexTokensPricesQuery,
  getTradingVolumeForAllPoolsQuery,
}: {
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getTradingVolumeForAllPoolsQuery: {
    getTradingVolumeForAllPools: { pool: string; tradingVolume: number }[]
  }
}) => {
  const theme = useTheme()
  const { wallet } = useWallet()
  const connection = useConnection()
  const tokenInfosMap = useTokenInfos()

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

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
    const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
    const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

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
      : getTokenMintAddressByName(getDefaultBaseToken()) || ''

    setInputTokenMintAddress(inputTokenMint)

    const outputTokenMint = outputFromRedirect
      ? getTokenMintAddressByName(outputFromRedirect) || ''
      : getTokenMintAddressByName(getDefaultQuoteToken()) || ''

    setOutputTokenMintAddress(outputTokenMint)
  }, [])

  const [slippage, setSlippage] = useState<number>(0.5)
  const [isTokensAddressesPopupOpen, setIsTokensAddressesPopupOpen] =
    useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [isExchangeReversed, setIsExchangeReversed] = useState(false)
  const [priceShowField, setPriceShowField] = useState<'input' | 'output'>(
    'input'
  )
  const [
    selectedInputTokenAddressFromSeveral,
    setInputTokenAddressFromSeveral,
  ] = useState<string>('')
  const [
    selectedOutputTokenAddressFromSeveral,
    setOutputTokenAddressFromSeveral,
  ] = useState<string>('')

  const [isInputTokenSelecting, setIsInputTokenSelecting] = useState(false)
  const [swapStatus, setSwapStatus] = useState<
    'initialize' | 'pending-confirmation' | 'initializing-transaction' | null
  >(null)

  const inputSymbol = getTokenNameByMintAddress(inputTokenMintAddress)
  const outputSymbol = getTokenNameByMintAddress(outputTokenMintAddress)

  // const { pricesMap: coingeckoPricesMap } = useCoingeckoPrices([
  //   inputSymbol,
  //   outputSymbol,
  // ])

  const {
    mints: tokenSelectorMints,
    swapRoute,
    inputAmount,
    outputAmount,
    loading: isLoadingSwapRoute,
    setFieldAmount,
    refresh: refreshAll,
    buildTransactions,
    refreshOpenOrdersMap,
    depositAndFee,
  } = useSwapRoute({
    wallet,
    connection: connection.getConnection(),
    inputMint: inputTokenMintAddress,
    outputMint: outputTokenMintAddress,
    selectedInputTokenAddressFromSeveral: selectedInputTokenAddressFromSeveral
      ? new PublicKey(selectedInputTokenAddressFromSeveral)
      : undefined,
    selectedOutputTokenAddressFromSeveral: selectedOutputTokenAddressFromSeveral
      ? new PublicKey(selectedOutputTokenAddressFromSeveral)
      : undefined,
    slippage,
  })

  const outputDexTokenPrice = dexTokensPricesMap.get(outputSymbol) || 0

  // const inputCgcTokenPrice =
  //   coingeckoPricesMap.get(inputSymbol.toUpperCase()) || 0
  // const outputCgcTokenPrice =
  //   coingeckoPricesMap.get(outputSymbol.toUpperCase()) || 0

  // const estimatedPrice = inputCgcTokenPrice / outputCgcTokenPrice
  // const estimatedPriceFromRoute = +outputAmount / +inputAmount

  // const pricesDiffPct = stripDigitPlaces(
  //   ((estimatedPriceFromRoute - estimatedPrice) / estimatedPrice) * 100,
  //   2
  // )
  const isHighPriceImpact = swapRoute.priceImpact > 2

  const isHighPriceDiff = isHighPriceImpact

  // const priceDiffText =
  //   pricesDiffPct > 0
  //     ? `${pricesDiffPct}% cheaper than`
  //     : pricesDiffPct < -1
  //     ? `${-pricesDiffPct}% more expensive than`
  //     : `Within 1% of `

  let { amount: maxInputAmount } = getTokenDataByMint(
    userTokensData,
    inputTokenMintAddress,
    selectedInputTokenAddressFromSeveral
  )

  const depositAndFeeAmount =
    depositAndFee.signers +
    depositAndFee.tokenAccounts +
    depositAndFee.openOrders

  const depositAndFeeUSD = depositAndFeeAmount
  const poolsFeeUSD = getSwapRouteFeesAmount({
    swapSteps: swapRoute.steps,
    pricesMap: dexTokensPricesMap,
    tokenInfosMap,
  })

  const { amount: maxOutputAmount } = getTokenDataByMint(
    userTokensData,
    outputTokenMintAddress,
    selectedOutputTokenAddressFromSeveral
  )

  // if we swap native sol to smth, we need to leave some SOL for covering fees
  if (
    depositAndFeeAmount &&
    inputTokenMintAddress === WRAPPED_SOL_MINT.toString() &&
    (!selectedInputTokenAddressFromSeveral ||
      wallet.publicKey?.toString() === selectedInputTokenAddressFromSeveral)
  ) {
    if (maxInputAmount >= depositAndFeeAmount) {
      maxInputAmount -= depositAndFeeAmount
    } else {
      maxInputAmount = 0
    }
  }

  const isEmptyInputAmount = +inputAmount === 0
  const isEmptyOutputAmount = +outputAmount === 0

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

    setIsExchangeReversed(!isExchangeReversed)
  }

  const isSwapRouteExists = swapRoute.steps.length !== 0

  const buttonText = getSwapButtonText({
    baseSymbol: inputSymbol,
    isSwapRouteExists,
    isEmptyInputAmount,
    isTokenABalanceInsufficient,
    isLoadingSwapRoute,
    // pricesDiffPct: isHighPriceDiff ? +pricesDiffPct : 0,
    pricesDiffPct: 0,
    swapStatus,
  })

  const isButtonDisabled =
    isEmptyInputAmount ||
    isTokenABalanceInsufficient ||
    swapStatus ||
    isLoadingSwapRoute ||
    !isSwapRouteExists

  const showPriceInfo = !isEmptyInputAmount && !isEmptyOutputAmount

  const findMarketByMints = () => {
    return marketsWithMints.find(
      (market) =>
        (market.baseMintAddress === inputTokenMintAddress ||
          market.baseMintAddress === outputTokenMintAddress) &&
        (market.quoteMintAddress === inputTokenMintAddress ||
          market.quoteMintAddress === outputTokenMintAddress)
    )
  }

  const getSelectedPoolForSwap = () => {
    return pools.find(
      (pool) =>
        (pool?.tokenA === inputTokenMintAddress ||
          pool?.tokenA === outputTokenMintAddress) &&
        (pool?.tokenB === inputTokenMintAddress ||
          pool?.tokenB === outputTokenMintAddress) &&
        !checkIsPoolStable(pool)
    )
  }

  const marketsByMints = findMarketByMints()
  const selectedPoolForSwap = getSelectedPoolForSwap()

  const { decimals: inputTokenDecimals } = tokenInfosMap.get(
    inputTokenMintAddress
  ) || { decimals: 0 }

  const { decimals: outputTokenDecimals } = tokenInfosMap.get(
    outputTokenMintAddress
  ) || { decimals: 0 }

  const marketType = marketsByMints ? 0 : 2

  const isCrossOHLCV = !marketsByMints && !selectedPoolForSwap

  const OHLCVinputTokenMintAddress = marketsByMints
    ? marketsByMints.baseMintAddress
    : selectedPoolForSwap?.tokenA

  const OHLCVoutputTokenMintAddress = marketsByMints
    ? marketsByMints.quoteMintAddress
    : selectedPoolForSwap?.tokenB

  const changeInputField = (v) => {
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
  }

  const changeOutputField = (v) => {
    if (v === '') {
      setFieldAmount(v, 'output')
      return
    }

    const parsedValue = INPUT_FORMATTERS.DECIMAL(v, inputAmount)

    if (
      numberWithOneDotRegexp.test(parsedValue) &&
      getNumberOfIntegersFromNumber(parsedValue) <= 8 &&
      getNumberOfDecimalsFromNumber(parsedValue) <= 8
    ) {
      setFieldAmount(parsedValue, 'output')
    }
  }

  const toastId = 'swap-toast-id'

  useEffect(() => {
    const makeTransaction = async () => {
      try {
        setSwapStatus('initializing-transaction')
        const transactionsAndSigners = await buildTransactions(swapRoute)

        setSwapStatus('pending-confirmation')

        const result = await signAndSendTransactions({
          wallet: walletAdapterToWallet(wallet),
          connection,
          transactionsAndSigners,
          swapStatus, // @todo temp
          setSwapStatus,
          onStatusChange: (transaction) => {
            if (transaction.status === 'confirming') {
              for (let i = 0; i < swapRoute.steps.length; i++) {
                const step = swapRoute.steps[i]
                setTimeout(() => {
                  const transactionInputSymbol = getTokenNameByMintAddress(
                    step.inputMint
                  )
                  const transactionOutputSymbol = getTokenNameByMintAddress(
                    step.outputMint
                  )

                  callToast(toastId, {
                    render: () => (
                      <Toast
                        type="progress"
                        progressOptions={{
                          segments: swapRoute.steps.length + 1,
                          value: i + 1,
                        }}
                        title={`Swap ${stripByAmountAndFormat(
                          inputAmount,
                          4
                        )} ${inputSymbol} to ${stripByAmountAndFormat(
                          outputAmount,
                          4
                        )} ${outputSymbol}`}
                        description={`Swapping ${transactionInputSymbol} to ${transactionOutputSymbol}`}
                      />
                    ),
                  })
                }, i * 1000)
              }
            }
          },
        })

        // Send Metrics
        if (result === 'success') {
          // serum fee
          if (SWAP_FEES_SETTINGS.enabled) {
            const amountOut = removeDecimalsFromBN(
              swapRoute.amountOut,
              outputTokenDecimals
            )

            const serumFeeAmount = amountOut * SWAP_FEES_SETTINGS.percentage

            const serumSteps = swapRoute.steps.filter(
              (step) => step.ammLabel === 'Serum'
            ).length

            if (serumSteps > 0) {
              const serumFeeUSD =
                serumFeeAmount * serumSteps * outputDexTokenPrice

              Metrics.sendMetrics({
                metricName: 'fees',
                metricScope: 'serum',
                metricValue: serumFeeUSD,
              })
            }
          }

          // pools fee
          Metrics.sendMetrics({
            metricName: 'fees',
            metricScope: 'pools',
            metricValue: poolsFeeUSD,
          })
        }

        if (result === 'success') {
          callToast(toastId, {
            render: () => (
              <Toast
                type="success"
                progressOptions={{
                  segments: swapRoute.steps.length + 1,
                  value: swapRoute.steps.length + 1,
                }}
                title={`Swap ${stripByAmountAndFormat(
                  inputAmount,
                  4
                )} ${inputSymbol} to ${stripByAmountAndFormat(
                  outputAmount,
                  4
                )} ${outputSymbol}`}
                description="Swapped"
              />
            ),
          })
        } else if (result === 'failed') {
          callToast(toastId, {
            render: () => (
              <Toast
                type="error"
                progressOptions={{
                  segments: swapRoute.steps.length + 1,
                  value: swapRoute.steps.length + 1,
                }}
                title={`Swap ${stripByAmountAndFormat(
                  inputAmount,
                  4
                )} ${inputSymbol} to ${stripByAmountAndFormat(
                  outputAmount,
                  4
                )} ${outputSymbol}`}
                description={
                  <RowContainer justify="space-between">
                    <span>Failed.</span>
                    <FailedButtonsRow>
                      <TextButton color="white3">Cancel</TextButton>
                      <TextButton onClick={makeTransaction}>
                        Try again
                      </TextButton>
                    </FailedButtonsRow>
                  </RowContainer>
                }
              />
            ),
            options: {
              autoClose: false,
            },
          })
        } else {
          callToast(toastId, {
            render: () => (
              <Toast
                type="error"
                progressOptions={{
                  segments: swapRoute.steps.length + 1,
                  value: swapRoute.steps.length + 1,
                }}
                title={`Swap ${stripByAmountAndFormat(
                  inputAmount,
                  4
                )} ${inputSymbol} to ${stripByAmountAndFormat(
                  outputAmount,
                  4
                )} ${outputSymbol}`}
                description="Transaction cancelled by user"
              />
            ),
          })
        }

        // reset fields
        if (result === 'success') {
          await setFieldAmount('', 'input')
        }

        // remove loader
        setSwapStatus(null)

        await refreshAll()
        await refreshUserTokensData()

        if (swapRoute.steps.some((amm) => amm.ammLabel === 'Serum')) {
          refreshOpenOrdersMap()
        }
      } catch (e) {
        console.log('error', e)
      }
    }

    if (swapStatus === 'initializing-transaction') {
      makeTransaction()
    }
  }, [swapStatus])

  const formattedMinimumReceived = stripByAmount(
    removeDecimalsFromBN(swapRoute.minAmountOut, outputTokenDecimals)
  )

  const formattedPriceImpact =
    swapRoute.priceImpact < 0.01
      ? '< 0.01'
      : stripByAmount(swapRoute.priceImpact, 2)

  const formattedPoolsFeeUSD =
    poolsFeeUSD < 0.01 ? '< $0.01' : `$${stripByAmount(poolsFeeUSD, 2)}`

  const basePrice = dexTokensPricesMap.get(inputSymbol) || 0
  const quotePrice = dexTokensPricesMap.get(outputSymbol) || 0

  const estimatedPriceValue = stripByAmount(
    getEstimatedPrice({
      inputPrice: basePrice,
      outputPrice: quotePrice,
      inputAmount: removeDecimalsFromBN(swapRoute.amountIn, inputTokenDecimals),
      outputAmount: removeDecimalsFromBN(
        swapRoute.amountOut,
        outputTokenDecimals
      ),
      field: priceShowField,
    })
  )

  const isInputPriceShowField = priceShowField === 'input'

  return (
    <SwapPageLayout>
      <SwapPageContainer justify="center" direction="row" wrap="nowrap">
        {/* <LeftColumn>
          <ChartContainer>
            <SwapChartWithPrice
              isCrossOHLCV={isCrossOHLCV}
              marketType={marketType}
              inputTokenMintAddress={
                isCrossOHLCV
                  ? inputTokenMintAddress
                  : OHLCVinputTokenMintAddress
              }
              outputTokenMintAddress={
                isCrossOHLCV
                  ? outputTokenMintAddress
                  : OHLCVoutputTokenMintAddress
              }
              pricesMap={dexTokensPricesMap}
            />
          </ChartContainer>
        </LeftColumn> */}

        <RightColumn>
          <SwapContentContainer direction="column">
            <RowContainer justify="flex-start" margin="0 0 1em 0">
              <SwapSearch
                topTradingMints={topTradingMints}
                topTradingPairs={topTradingPairs}
                data-testid="swap-search-field"
                tokens={tokenSelectorMints.map((mint) => ({ mint }))}
                setInputTokenAddressFromSeveral={
                  setInputTokenAddressFromSeveral
                }
                setOutputTokenAddressFromSeveral={
                  setOutputTokenAddressFromSeveral
                }
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
              <RowContainer margin="0" justify="space-between">
                <PieTimer duration={15} callback={refreshAll} />
                <Row>
                  <Row style={{ position: 'relative' }}>
                    <SlippageButton
                      data-testid="increace-slippage-tolerance"
                      onClick={() => {
                        setIsTokensAddressesPopupOpen(true)
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
                  border: `1px solid ${theme.colors.white4}`,
                  borderRadius: '0.8em',
                  marginTop: '1.5em',
                }}
                direction="column"
              >
                <RowContainer
                  wrap="nowrap"
                  justify="space-between"
                  padding="1em"
                  style={{ borderBottom: `1px solid ${theme.colors.white4}` }}
                >
                  <SwapAmountInput
                    needMaxButton
                    title="From"
                    maxAmount={maxInputAmount}
                    amount={formatNumberWithSpaces(inputAmount)}
                    onMaxAmountClick={() =>
                      setFieldAmount(stripByAmount(maxInputAmount), 'input')
                    }
                    disabled={false}
                    onChange={(v) => {
                      if (v === '') {
                        setFieldAmount(v, 'input')
                        return
                      }
                      const parsedValue = INPUT_FORMATTERS.DECIMAL(
                        v,
                        inputAmount
                      )

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
                <ReverseTokensContainer
                  onClick={reverseTokens}
                  $isReversed={isExchangeReversed}
                >
                  <ArrowsExchangeIcon />
                </ReverseTokensContainer>
                <RowContainer
                  wrap="nowrap"
                  justify="space-between"
                  padding="1em"
                >
                  <SwapAmountInput
                    title="To (Estimated)"
                    maxAmount={maxOutputAmount}
                    amount={formatNumberWithSpaces(outputAmount)}
                    amountUSD={+outputAmount * outputDexTokenPrice}
                    onMaxAmountClick={() =>
                      setFieldAmount(stripByAmount(maxOutputAmount), 'output')
                    }
                    onChange={(v) => {
                      if (v === '') {
                        setFieldAmount(v, 'output')
                        return
                      }

                      const parsedValue = INPUT_FORMATTERS.DECIMAL(
                        v,
                        inputAmount
                      )

                      if (
                        numberWithOneDotRegexp.test(parsedValue) &&
                        getNumberOfIntegersFromNumber(parsedValue) <= 8 &&
                        getNumberOfDecimalsFromNumber(parsedValue) <= 8
                      ) {
                        setFieldAmount(parsedValue, 'output')
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
              {showPriceInfo && (
                <RowContainer justify="space-between" margin="0.5em 0 0 0">
                  {/* <BlackRow width="calc(50% - 0.6em)">
                    <RowTitle>Fee:</RowTitle>
                    <Row align="center" wrap="nowrap">
                      <RowValue>
                        {totalFeeUSD < 0.01
                          ? `< $0.01`
                          : `$${formattedTotalFeeUSD}`}
                      </RowValue>
                      {depositAndFeeAmount > 0.02 && (
                        <DarkTooltip title="Fee breakdown">
                          <Row
                            margin="0 0 0 0.3em"
                            style={{ color: theme.colors.white2 }}
                          >
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
                          </Row>
                        </DarkTooltip>
                      )}
                    </Row>
                  </BlackRow> */}

                  <BlackRow isDetailsOpen={isDetailsOpen} width="100%">
                    <RowContainer
                      style={{
                        borderBottom: isDetailsOpen
                          ? `1px solid ${theme.colors.white4}`
                          : 'none',
                      }}
                      height="1.7em"
                      justify="space-between"
                    >
                      <Row width="50%" justify="flex-start">
                        <InlineText color="white2" size="xs">
                          <SvgIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              setPriceShowField(
                                isInputPriceShowField ? 'output' : 'input'
                              )
                            }
                            src={HalfArrowsIcon}
                            width="0.8em"
                            height="0.8em"
                          />{' '}
                          1 {isInputPriceShowField ? inputSymbol : outputSymbol}{' '}
                          = {stripByAmount(estimatedPriceValue)}{' '}
                          {isInputPriceShowField ? outputSymbol : inputSymbol}
                        </InlineText>
                      </Row>

                      <Row justify="space-between">
                        <RowImpactTitle isHighPriceDiff={isHighPriceDiff}>
                          {isHighPriceDiff ? 'High Price Impact' : 'Fair price'}
                        </RowImpactTitle>
                        <DropdownIconContainer
                          isDetailsOpen={isDetailsOpen}
                          onClick={() => {
                            setIsDetailsOpen(!isDetailsOpen)
                          }}
                        >
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 18 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L9 9L17 1"
                              stroke="#ABBAD1"
                              strokeWidth="2"
                            />
                          </svg>
                        </DropdownIconContainer>
                      </Row>
                    </RowContainer>
                    {isDetailsOpen && (
                      <RowContainer direction="column">
                        <RowContainer margin="1em 0" justify="space-between">
                          <InlineText weight={500} size="xs" color="white3">
                            Minimum Received:
                          </InlineText>
                          <InlineText weight={600} size="xs" color="white2">
                            {formattedMinimumReceived} {outputSymbol}
                          </InlineText>
                        </RowContainer>
                        <RowContainer
                          margin="0 0 1em 0"
                          justify="space-between"
                        >
                          <InlineText weight={500} size="xs" color="white3">
                            Price Impact:
                          </InlineText>
                          <InlineText weight={600} size="xs" color="white2">
                            {formattedPriceImpact}%
                          </InlineText>
                        </RowContainer>
                        <RowContainer
                          margin="0 0 1em 0"
                          justify="space-between"
                        >
                          <InlineText weight={500} size="xs" color="white3">
                            Swap Fee:
                          </InlineText>
                          <InlineText weight={600} size="xs" color="white2">
                            {formattedPoolsFeeUSD}
                          </InlineText>
                        </RowContainer>
                        <RowContainer
                          margin="0 0 1em 0"
                          justify="space-between"
                        >
                          <InlineText weight={500} size="xs" color="white3">
                            Network Fee:
                          </InlineText>
                          <InlineText weight={600} size="xs" color="white2">
                            {wallet.connected
                              ? stripByAmount(depositAndFeeUSD)
                              : '--'}{' '}
                            SOL
                          </InlineText>
                        </RowContainer>
                      </RowContainer>
                    )}
                  </BlackRow>
                </RowContainer>
              )}
              <RowContainer style={{ marginTop: '1.5em' }}>
                {!wallet.publicKey ? (
                  <BtnCustom
                    onClick={() => {
                      setIsConnectWalletPopupOpen(true)
                    }}
                    needMinWidth={false}
                    btnWidth="100%"
                    height="4em"
                    padding="1.4em 5em"
                    fontSize="initial"
                    borderRadius="1.1rem"
                    borderColor="none"
                    btnColor={theme.colors.blue1}
                    backgroundColor={rgba('#5E55F2', 0.15)}
                    textTransform="none"
                    transition="all .4s ease-out"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <Row>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.5 4.5H3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 5.48495V6.51498C11 6.78998 10.78 7.01496 10.5 7.02496H9.52C8.98 7.02496 8.48502 6.62997 8.44002 6.08997C8.41002 5.77497 8.53001 5.47996 8.74001 5.27496C8.92501 5.08496 9.18001 4.97498 9.46001 4.97498H10.5C10.78 4.98498 11 5.20995 11 5.48495Z"
                          fill="#14141F"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.73999 5.27499C8.52999 5.47999 8.41 5.775 8.44 6.09C8.485 6.63 8.97999 7.02499 9.51999 7.02499H10.5V7.75C10.5 9.25 9.5 10.25 8 10.25H3.5C2 10.25 1 9.25 1 7.75V4.25C1 2.89 1.82 1.94 3.095 1.78C3.225 1.76 3.36 1.75 3.5 1.75H8C8.13 1.75 8.255 1.75499 8.375 1.77499C9.665 1.92499 10.5 2.88 10.5 4.25V4.97501H9.45999C9.17999 4.97501 8.92499 5.08499 8.73999 5.27499Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <Row padding="0 0 0 0.3em">
                        <InlineText color="blue1" size="sm">
                          Connect wallet
                        </InlineText>
                      </Row>
                    </Row>
                  </BtnCustom>
                ) : (
                  <SwapButton
                    isHighPriceDiff={isHighPriceDiff}
                    disabled={isButtonDisabled}
                    $fontSize="md"
                    minWidth="100%"
                    $variant="none"
                    onClick={async () => {
                      if (!swapRoute) return

                      setSwapStatus('initializing-transaction')
                    }}
                  >
                    <span>{buttonText}</span>
                  </SwapButton>
                )}
              </RowContainer>
            </SwapBlockTemplate>
          </SwapContentContainer>
        </RightColumn>

        <SelectCoinPopup
          data-testid="swap-select-token-popup"
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
                setOutputTokenMintAddress(inputTokenMintAddress)
              }

              if (selectedInputTokenAddressFromSeveral) {
                setInputTokenAddressFromSeveral('')
              }

              setInputTokenMintAddress(address)
              setIsSelectCoinPopupOpen(false)
            } else {
              if (inputTokenMintAddress === address) {
                setInputTokenMintAddress(outputTokenMintAddress)
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

        {isTokensAddressesPopupOpen && (
          <SwapSettingsPopup
            quoteTokenMintAddress={outputTokenMintAddress}
            baseTokenMintAddress={inputTokenMintAddress}
            open={isTokensAddressesPopupOpen}
            slippage={slippage}
            setSlippage={setSlippage}
            close={() => setIsTokensAddressesPopupOpen(false)}
          />
        )}

        <ConnectWalletPopup
          open={isConnectWalletPopupOpen}
          onClose={() => setIsConnectWalletPopupOpen(false)}
        />
      </SwapPageContainer>
    </SwapPageLayout>
  )
}

// @ts-ignore
export default compose(
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
