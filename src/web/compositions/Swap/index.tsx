import withTheme from '@material-ui/core/styles/withTheme'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { FONT_SIZES } from '@variables/variables'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Text } from '@sb/compositions/Addressbook/index'
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
import { getSwapStepFeesAmount } from '@sb/dexUtils/pools/swap/getSwapStepFeeUSD'
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
  stripDigitPlaces,
  formatNumberToUSFormat,
} from '@core/utils/PortfolioTableUtils'

import ArrowRightIcon from '@icons/arrowRight.svg'

import { INPUT_FORMATTERS } from '../../components/Input'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { getTokenDataByMint } from '../Pools/utils'
import { TokenSelector, SwapAmountInput } from './components/Inputs/index'
import { SelectCoinPopup } from './components/SelectCoinPopup/SelectCoinPopup'
import { SwapSearch } from './components/SwapSearch'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
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
  SwapContentContainer,
  SwapBlockTemplate,
  SwapPageLayout,
  CircleIconContainer,
  SetAmountButton,
} from './styles'
import {
  getEstimatedPrice,
  getOHLCVMarketTypeFromSwapRoute,
  getRouteMintsPath,
  getSwapButtonText,
} from './utils'

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
  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
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
  const [priceShowField, setPriceShowField] = useState<'input' | 'output'>(
    'input'
  )

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

  const isSwapRouteExists = swapRoute.length !== 0

  const inputSymbol = getTokenNameByMintAddress(inputTokenMintAddress)
  const outputSymbol = getTokenNameByMintAddress(outputTokenMintAddress)

  let { amount: maxInputAmount } = getTokenDataByMint(
    userTokensData,
    inputTokenMintAddress,
    selectedInputTokenAddressFromSeveral
  )

  const totalFeeUSD = swapRoute.reduce((acc, step) => {
    const stepFeeUSD = getSwapStepFeesAmount({
      swapStep: step,
      pricesMap: dexTokensPricesMap,
    })

    return acc + stepFeeUSD
  }, 0)

  const basePrice = dexTokensPricesMap.get(inputSymbol) || 0
  const quotePrice = dexTokensPricesMap.get(outputSymbol) || 0
  const outputUSD = quotePrice * outputAmount

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

  const estimatedPrice = stripByAmount(
    getEstimatedPrice({
      inputAmount,
      outputAmount,
      inputPrice: basePrice,
      outputPrice: quotePrice,
      field: priceShowField,
    })
  )

  const outputAmountWithSlippage =
    +outputAmount - (+outputAmount / 100) * slippage * swapRoute.length

  const needEnterAmount = +inputAmount === 0
  const isTokenABalanceInsufficient = inputAmount > +maxInputAmount

  const reverseTokens = () => {
    setInputTokenMintAddress(outputTokenMintAddress)
    setOutputTokenMintAddress(inputTokenMintAddress)

    setInputTokenAddressFromSeveral(selectedOutputTokenAddressFromSeveral)
    setOutputTokenAddressFromSeveral(selectedInputTokenAddressFromSeveral)

    setFieldAmount(
      stripByAmount(outputAmount),
      'input',
      outputTokenMintAddress,
      inputTokenMintAddress
    )
  }

  const isButtonDisabled =
    // isLoadingSwapRoute ||
    isTokenABalanceInsufficient ||
    // +baseAmount === 0 ||
    // +quoteAmount === 0 ||
    isSwapInProgress

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

  return (
    <SwapPageLayout>
      <SwapPageContainer
        justify="space-around"
        direction="row"
        height="100%"
        wrap="nowrap"
      >
        <SwapContentContainer direction="column">
          <RowContainer justify="flex-start" margin="0 0 2rem 0">
            <SwapSearch
              topTradingMints={topTradingMints}
              topTradingPairs={topTradingPairs}
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
            <RowContainer margin="0 0 .5em 0" justify="space-between">
              <Row>
                <ValueButton>
                  <ReloadTimer
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
                </ValueButton>
                {inputTokenMintAddress && outputTokenMintAddress && (
                  <ValueButton onClick={() => openTokensAddressesPopup(true)}>
                    i
                  </ValueButton>
                )}
              </Row>
              <Row>
                <Text padding="0 0.8rem 0 0">Slippage Tolerance:</Text>
                <Row style={{ position: 'relative' }}>
                  <ValueInput
                    onChange={(e) => {
                      if (
                        numberWithOneDotRegexp.test(e.target.value) &&
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
                  />
                  <div
                    style={{
                      position: 'absolute',
                      fontFamily: 'Avenir Next Medium',
                      color: theme.colors.gray1,
                      fontSize: FONT_SIZES.sm,
                      right: '1.5rem',
                    }}
                  >
                    %
                  </div>
                </Row>
                <ValueButton
                  onClick={() => {
                    const newSlippage = +(+slippage - SLIPPAGE_STEP).toFixed(2)

                    if (newSlippage > 0) {
                      setSlippage(newSlippage)
                    }
                  }}
                >
                  -
                </ValueButton>
                <ValueButton
                  onClick={() => {
                    const newSlippage = +(+slippage + SLIPPAGE_STEP).toFixed(2)

                    setSlippage(newSlippage)
                  }}
                >
                  +
                </ValueButton>
              </Row>
            </RowContainer>
            <RowContainer
              style={{ position: 'relative' }}
              margin=".5em 0 1.6rem 0"
              direction="column"
            >
              <RowContainer justify="space-between">
                <Row width="calc(65% - .2rem)">
                  <SwapAmountInput
                    title="You Pay"
                    maxAmount={maxInputAmount}
                    amount={formatNumberWithSpaces(inputAmount)}
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
                    roundSides={['top-left']}
                    appendComponent={
                      <Row>
                        <SetAmountButton
                          // onClick={halfButtonOnClick}
                          type="button"
                          $variant="secondary"
                          style={{ marginRight: '0.8rem' }}
                        >
                          Half
                        </SetAmountButton>
                        <SetAmountButton
                          // onClick={maxButtonOnClick}
                          type="button"
                          $variant="secondary"
                        >
                          Max
                        </SetAmountButton>
                      </Row>
                    }
                  />
                </Row>
                <Row width="calc(35% - 0.2rem)">
                  <TokenSelector
                    mint={inputTokenMintAddress}
                    roundSides={['top-right']}
                    onClick={() => {
                      setIsInputTokenSelecting(true)
                      setIsSelectCoinPopupOpen(true)
                    }}
                  />
                </Row>
              </RowContainer>
              <ReverseTokensContainer onClick={reverseTokens}>
                <svg
                  width="11"
                  height="10"
                  viewBox="0 0 11 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.40138 2.6212L8.00836 0.0142284L10.6153 2.6212L9.87064 3.3659L8.53449 2.03029L8.53502 8.96748L7.4817 8.96748L7.4817 2.03029L6.14608 3.3659L5.40138 2.6212ZM0.134766 6.88716L0.879465 6.14246L2.21508 7.47808L2.21508 0.54089L3.2684 0.54089L3.2684 7.47808L4.60402 6.14246L5.34872 6.88716L2.74174 9.49414L0.134766 6.88716Z"
                    fill="white"
                    fillOpacity="0.7"
                  />
                </svg>
              </ReverseTokensContainer>
              <RowContainer justify="space-between" margin=".4rem 0 0 0">
                <Row width="calc(65% - .2rem)">
                  <SwapAmountInput
                    title="You Receive"
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
                    roundSides={['bottom-left']}
                    appendComponent={
                      <Text
                        fontFamily="Avenir Next"
                        fontSize={FONT_SIZES.sm}
                        color="gray1"
                      >
                        ≈$
                        {outputUSD
                          ? formatNumberToUSFormat(
                              stripDigitPlaces(outputUSD, 2)
                            )
                          : '0.00'}
                      </Text>
                    }
                  />
                </Row>
                <Row width="calc(35% - .2rem)">
                  <TokenSelector
                    mint={outputTokenMintAddress}
                    roundSides={['bottom-right']}
                    onClick={() => {
                      setIsInputTokenSelecting(false)
                      setIsSelectCoinPopupOpen(true)
                    }}
                  />
                </Row>
              </RowContainer>
            </RowContainer>
            {/* {!isLoadingSwapRoute && pctDiffUsedAndUIInputAmount >= 5 && (
              <RowContainer margin="0 0 .5em 0">
                <Text>
                  This swap will only use {swapRouteInAmount} (out of{' '}
                  {inputAmount}) USDC
                </Text>
              </RowContainer>
            )} */}
            <RowContainer>
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
                  theme={theme}
                  disabled={isButtonDisabled}
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
                  <RowContainer>
                    <RowContainer>
                      {getSwapButtonText({
                        baseSymbol: inputSymbol,
                        minInputAmount: 0,
                        isSwapRouteExists,
                        needEnterAmount,
                        isTokenABalanceInsufficient,
                        isLoadingSwapRoute,
                        isTooSmallInputAmount: false,
                        isSwapInProgress,
                      })}
                    </RowContainer>
                    {!isSwapInProgress && (
                      <RowContainer>
                        {getRouteMintsPath(swapRoute).map(
                          (mint, index, arr) => {
                            const { symbol } = tokenInfos.get(mint) || {
                              symbol: getTokenNameByMintAddress(mint),
                            }
                            return (
                              <>
                                <Text
                                  color="rgba(248, 250, 255, 0.5)"
                                  padding="0 0.4rem"
                                >
                                  {symbol}
                                </Text>
                                {arr.length - 1 !== index && (
                                  <SvgIcon
                                    src={ArrowRightIcon}
                                    width="0.8em"
                                    height="0.8em"
                                  />
                                )}
                              </>
                            )
                          }
                        )}
                      </RowContainer>
                    )}
                  </RowContainer>
                </SwapButton>
              )}
            </RowContainer>

            {!needEnterAmount ? (
              <RowContainer direction="column" margin="2.4rem 0 0 0">
                <RowContainer justify="space-between">
                  <BlackRow justify="center" width="calc(50% - 0.8rem)">
                    <Row>
                      <RowValue>
                        <RowAmountValue>1</RowAmountValue>
                        {priceShowField === 'input'
                          ? inputSymbol
                          : outputSymbol}
                      </RowValue>
                      <span
                        style={{
                          color: theme.colors.white,
                          padding: '0 0.5rem',
                        }}
                        onClick={() =>
                          setPriceShowField(
                            priceShowField === 'input' ? 'output' : 'input'
                          )
                        }
                      >
                        ⇌
                      </span>
                      <RowValue>
                        <RowAmountValue>
                          {formatNumberToUSFormat(
                            stripByAmount(estimatedPrice)
                          )}
                        </RowAmountValue>
                        {priceShowField === 'input'
                          ? outputSymbol
                          : inputSymbol}
                      </RowValue>
                    </Row>
                  </BlackRow>
                  <BlackRow width="calc(50% - 0.8rem)">
                    <RowTitle>Price Impact:</RowTitle>
                    <RowAmountValue>
                      {priceImpact < 0.1
                        ? '< 0.1'
                        : stripDigitPlaces(priceImpact, 2)}
                      %
                    </RowAmountValue>
                  </BlackRow>
                </RowContainer>

                <RowContainer justify="space-between">
                  <BlackRow width="calc(50% - 0.8rem)">
                    <RowTitle>Trading fee:</RowTitle>
                    <RowValue>
                      $
                      {formatNumberToUSFormat(stripDigitPlaces(totalFeeUSD, 2))}
                    </RowValue>
                  </BlackRow>
                  <BlackRow width="calc(50% - 0.8rem)">
                    <RowTitle>Network fee:</RowTitle>
                    <RowValue style={{ display: 'flex' }}>
                      {wallet.connected
                        ? stripDigitPlaces(depositAndFee, 6)
                        : '-'}{' '}
                      SOL{' '}
                      {false && isOpenOrdersCreationRequired ? (
                        <DarkTooltip
                          title={
                            'The route includes the Serum market, which requires opening an "Open Order" account, which costs 0.024 SOL. You can close the account later and get the fee back.'
                          }
                        >
                          <CircleIconContainer
                            size="1em"
                            style={{
                              marginLeft: '.5rem',
                            }}
                          >
                            i
                          </CircleIconContainer>
                        </DarkTooltip>
                      ) : null}
                    </RowValue>
                  </BlackRow>
                </RowContainer>

                <BlackRow width="100%">
                  <RowTitle>Minimum Received:</RowTitle>
                  <RowValue>
                    {formatNumberToUSFormat(
                      stripByAmount(outputAmountWithSlippage)
                    )}{' '}
                    {outputSymbol}
                  </RowValue>
                </BlackRow>
              </RowContainer>
            ) : null}
          </SwapBlockTemplate>
        </SwapContentContainer>

        <SelectCoinPopup
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
          close={() => openTokensAddressesPopup(false)}
        />

        <ConnectWalletPopup
          open={isConnectWalletPopupOpen}
          onClose={() => setIsConnectWalletPopupOpen(false)}
        />
        <div style={{ height: '100%', width: 'calc(100% - 40em)' }}>
          <iframe
            allowFullScreen
            style={{ borderWidth: 0 }}
            src={`${PROTOCOL}//${CHARTS_API_URL}/?symbol=${inputSymbol}/${outputSymbol}&marketType=${getOHLCVMarketTypeFromSwapRoute(
              swapRoute
            )}&exchange=serum&theme=serum&isMobile=false${
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
