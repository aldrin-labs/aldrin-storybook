import { useSwapRoute } from '@aldrin_exchange/swap_hook'
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
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText, Text } from '@sb/components/Typography'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { useCoingeckoPrices } from '@sb/dexUtils/coingecko/useCoingeckoPrices'
import { useConnection } from '@sb/dexUtils/connection'
import {
  aldrinTokensMapBySymbol,
  getTokenMintAddressByName,
  USE_MARKETS,
} from '@sb/dexUtils/markets'
import { callToast } from '@sb/dexUtils/notifications'
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
import {
  walletAdapterToWallet,
  getTokenDataByMint,
  RIN_MINT,
} from '@core/solana'
import { getTokenNameByMintAddress } from '@core/utils/awesomeMarkets/getTokenNameByMintAddress'
import {
  getNumberOfDecimalsFromNumber,
  getNumberOfIntegersFromNumber,
  stripByAmount,
} from '@core/utils/chartPageUtils'
import { DAY, endOfHourTimestamp } from '@core/utils/dateUtils'
import { numberWithOneDotRegexp } from '@core/utils/helpers'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import ArrowsExchangeIcon from '@icons/arrowsExchange.svg'
import SettingIcon from '@icons/settings.svg'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import WalletIcon from './assets/WalletIcon'
import { TokenSelector, SwapAmountInput } from './components/Inputs/index'
import { SelectCoinPopup } from './components/SelectCoinPopup/SelectCoinPopup'
import { SwapChartWithPrice } from './components/SwapChart'
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
  RowTitle,
  RowValue,
  RowImpactTitle,
  SlippageButton,
  InfoIconContainer,
  LeftColumn,
  RightColumn,
  ChartContainer,
} from './styles'
import { getSwapButtonText } from './utils'

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
      : getTokenMintAddressByName(getDefaultBaseToken(false)) || ''

    setInputTokenMintAddress(inputTokenMint)

    const outputTokenMint = outputFromRedirect
      ? getTokenMintAddressByName(outputFromRedirect) || ''
      : getTokenMintAddressByName(getDefaultQuoteToken(false)) || ''

    setOutputTokenMintAddress(outputTokenMint)
  }, [])

  const [slippage, setSlippage] = useState<number>(0.5)
  const [isTokensAddressesPopupOpen, setIsTokensAddressesPopupOpen] =
    useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [isExchangeReversed, setIsExchangeReversed] = useState(false)

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
    'initialize' | 'pending-confirmation' | null
  >(null)

  const inputSymbol = getTokenNameByMintAddress(inputTokenMintAddress)
  const outputSymbol = getTokenNameByMintAddress(outputTokenMintAddress)

  const { pricesMap: coingeckoPricesMap } = useCoingeckoPrices([
    inputSymbol,
    outputSymbol,
  ])

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
    pools: [],
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

  const inputCgcTokenPrice =
    coingeckoPricesMap.get(inputSymbol.toUpperCase()) || 0
  const outputCgcTokenPrice =
    coingeckoPricesMap.get(outputSymbol.toUpperCase()) || 0

  const estimatedPrice = inputCgcTokenPrice / outputCgcTokenPrice
  const estimatedPriceFromRoute = +outputAmount / +inputAmount

  const pricesDiffPct = stripDigitPlaces(
    ((estimatedPriceFromRoute - estimatedPrice) / estimatedPrice) * 100,
    2
  )
  const isHighPriceImpact = swapRoute.priceImpact > 2
  const isHighPriceDiff =
    inputTokenMintAddress === RIN_MINT || outputTokenMintAddress === RIN_MINT
      ? isHighPriceImpact
      : pricesDiffPct < -1

  const priceDiffText =
    pricesDiffPct > 0
      ? `${pricesDiffPct}% cheaper `
      : pricesDiffPct < -1
      ? `${-pricesDiffPct}% more expensive `
      : `Within 1% of `

  let { amount: maxInputAmount } = getTokenDataByMint(
    userTokensData,
    inputTokenMintAddress,
    selectedInputTokenAddressFromSeveral
  )

  const depositAndFeeUSD = depositAndFee * dexTokensPricesMap.get('SOL')
  const poolsFeeUSD = getSwapRouteFeesAmount({
    swapSteps: swapRoute.steps,
    pricesMap: dexTokensPricesMap,
    tokenInfosMap,
  })

  const totalFeeUSD = depositAndFeeUSD + poolsFeeUSD

  const formattedTotalFeeUSD = formatNumberToUSFormat(
    stripDigitPlaces(totalFeeUSD, 2)
  )

  const { amount: maxOutputAmount } = getTokenDataByMint(
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

  const buttonText = getSwapButtonText({
    baseSymbol: inputSymbol,
    isSwapRouteExists: swapRoute.steps.length !== 0,
    isEmptyInputAmount,
    isTokenABalanceInsufficient,
    isLoadingSwapRoute,
    pricesDiffPct: isHighPriceDiff ? +pricesDiffPct : 0,
    swapStatus,
  })

  const isButtonDisabled =
    isEmptyInputAmount ||
    isTokenABalanceInsufficient ||
    swapStatus ||
    isLoadingSwapRoute

  const showPriceInfo = !isEmptyInputAmount && !isEmptyOutputAmount

  const marketsList = USE_MARKETS

  const marketsWithMints = marketsList
    .filter((market) => !market.deprecated && !market.delisted)
    .map((market) => {
      const marketName = market.name
      const [base, quote] = marketName.split('/')

      const { address: baseMintAddress } = aldrinTokensMapBySymbol.get(
        base
      ) || {
        address: '',
      }
      const { address: quoteMintAddress } = aldrinTokensMapBySymbol.get(
        quote
      ) || {
        address: '',
      }

      return {
        ...market,
        baseMintAddress,
        quoteMintAddress,
      }
    })

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
          pool?.tokenB === outputTokenMintAddress)
    )
  }

  const marketsByMints = findMarketByMints()
  const selectedPoolForSwap = getSelectedPoolForSwap()

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
        const transactionsAndSigners = await buildTransactions(swapRoute)

        setSwapStatus('pending-confirmation')

        const result = await signAndSendTransactions({
          wallet: walletAdapterToWallet(wallet),
          connection,
          transactionsAndSigners,
          swapStatus, // @todo temp
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
                        title={`Swap ${inputAmount} ${inputSymbol} to ${outputAmount} ${outputSymbol}`}
                        description={`Swapping ${transactionInputSymbol} to ${transactionOutputSymbol}`}
                      />
                    ),
                  })
                }, i * 1000)
              }
            }
          },
        })

        if (result !== 'success') {
          if (result === 'failed') {
            callToast(toastId, {
              render: () => (
                <Toast
                  type="error"
                  title="Swap operation failed"
                  description="Please, try to increase slippage or try a bit later"
                />
              ),
            })
          } else {
            callToast(toastId, {
              render: () => (
                <Toast
                  type="error"
                  title={`Swap ${inputAmount} ${inputSymbol} to ${outputAmount} ${outputSymbol}`}
                  description="Transaction cancelled by user"
                />
              ),
            })
          }
        } else {
          callToast(toastId, {
            render: () => (
              <Toast
                type="success"
                title={`Swap ${inputAmount} ${inputSymbol} to ${outputAmount} ${outputSymbol}`}
                description="Swapped"
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

        refreshUserTokensData()
        refreshAll()

        if (swapRoute.steps.some((amm) => amm.ammLabel === 'Serum')) {
          refreshOpenOrdersMap()
        }
      } catch (e) {
        console.log('error', e)
      }
    }

    if (swapStatus === 'initialize') {
      makeTransaction()
    }
  }, [swapStatus])

  return (
    <SwapPageLayout>
      <SwapPageContainer justify="center" direction="row" wrap="nowrap">
        <LeftColumn>
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
        </LeftColumn>

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
                    title="From"
                    maxAmount={maxInputAmount}
                    amount={formatNumberWithSpaces(inputAmount)}
                    onMaxAmountClick={() =>
                      setFieldAmount(maxInputAmount, 'input')
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
                  <SvgIcon src={ArrowsExchangeIcon} />
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
                      setFieldAmount(maxOutputAmount, 'output')
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
                  <BlackRow width="calc(50% - 0.6em)">
                    <RowTitle>Fee:</RowTitle>
                    <Row align="center" wrap="nowrap">
                      <RowValue>
                        {totalFeeUSD < 0.01
                          ? `< $0.01`
                          : `$${formattedTotalFeeUSD}`}
                      </RowValue>
                      {depositAndFee > 0.02 && (
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
                  </BlackRow>

                  <BlackRow width="calc(50% - 0.6em)">
                    <RowImpactTitle isHighPriceDiff={isHighPriceDiff}>
                      {isHighPriceDiff ? 'High Price Impact' : 'Fair price'}
                    </RowImpactTitle>

                    <DarkTooltip
                      PopperProps={{ style: { opacity: 1 } }}
                      title={
                        <Row
                          direction="column"
                          align="flex-start"
                          style={{ fontSize: '16px' }}
                        >
                          <Text size="esm" margin="0">
                            <InlineText color="white1" weight={600}>
                              {stripByAmount(estimatedPriceFromRoute)}
                            </InlineText>{' '}
                            {outputSymbol} per {inputSymbol}.
                          </Text>
                          <Text color="white1" size="esm" margin="0">
                            <InlineText
                              color={isHighPriceDiff ? 'red1' : 'green2'}
                            >
                              {priceDiffText}
                            </InlineText>{' '}
                            than CoinGecko price.
                          </Text>
                        </Row>
                      }
                    >
                      <InfoIconContainer isHighPriceDiff={isHighPriceDiff}>
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
                    </DarkTooltip>
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
                      <WalletIcon />
                      <Row padding="0 0 0 0.3em">
                        <InlineText color="blue1" size="esm">
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

                      setSwapStatus('initialize')
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
