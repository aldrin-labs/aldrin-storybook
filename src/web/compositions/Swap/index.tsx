import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import { FONT_SIZES } from '@variables/variables'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'

import { Loading, TooltipRegionBlocker } from '@sb/components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Text } from '@sb/compositions/Addressbook/index'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { useConnection } from '@sb/dexUtils/connection'
import {
  ALL_TOKENS_MINTS,
  getTokenMintAddressByName,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { signAndSendTransactions } from '@sb/dexUtils/transactions'
import { useWallet } from '@sb/dexUtils/wallet'
import { withRegionCheck } from '@sb/hoc'
import { withPublicKey } from '@sb/hoc/withPublicKey'
import { useJupiterSwap } from '@sb/hooks/useJupiter/useJupiterSwap'

import { getDexTokensPrices as getDexTokensPricesRequest } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import {
  getPoolsForSwapActiveTab,
  getSelectedPoolForSwap,
  getDefaultBaseToken,
  getDefaultQuoteToken,
} from '@core/solana'
import {
  getNumberOfDecimalsFromNumber,
  getNumberOfIntegersFromNumber,
  stripByAmount,
} from '@core/utils/chartPageUtils'
import { numberWithOneDotRegexp, removeDecimals } from '@core/utils/helpers'
import {
  stripDigitPlaces,
  formatNumberToUSFormat,
} from '@core/utils/PortfolioTableUtils'

import ArrowRightIcon from '@icons/arrowRight.svg'
import ReverseArrows from '@icons/reverseArrows.svg'
import Arrows from '@icons/switchArrows.svg'

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
  getFeeFromSwapRoute,
  getRouteMintsPath,
  getSwapButtonText,
  getSwapNetworkFee,
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
  const connection = useConnection()
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

  const [isRegionCheckIsLoading, setRegionCheckIsLoading] =
    useState<boolean>(false)
  const [isFromRestrictedRegion, setIsFromRestrictedRegion] =
    useState<boolean>(false)

  // useEffect(() => {
  //   setRegionCheckIsLoading(true)
  //   getRegionData({ setIsFromRestrictedRegion }).then(() => {
  //     setRegionCheckIsLoading(false)
  //   })
  // }, [setIsFromRestrictedRegion])

  const pools = getPoolsForSwapActiveTab({
    pools: allPools,
    isStableSwapTabActive,
  })

  const [slippage, setSlippage] = useState<number>(0.3)
  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  const [selectedBaseTokenAddressFromSeveral, setBaseTokenAddressFromSeveral] =
    useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')

  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)
  const [isSwapInProgress, setIsSwapInProgress] = useState(false)
  const [priceShowField, setPriceShowField] = useState<'input' | 'output'>(
    'input'
  )

  const baseSymbol = getTokenNameByMintAddress(baseTokenMintAddress)
  const quoteSymbol = getTokenNameByMintAddress(quoteTokenMintAddress)

  const basePrice = dexTokensPricesMap.get(baseSymbol) || 0
  const quotePrice = dexTokensPricesMap.get(quoteSymbol) || 0

  const { decimals: baseTokenDecimals } = tokenInfos.get(
    baseTokenMintAddress
  ) || {
    decimals: 0,
  }

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
    setInputAmount,
    refresh: refreshAmountsWithSwapRoute,
  } = useJupiterSwap({
    inputMint: baseTokenMintAddress,
    outputMint: quoteTokenMintAddress,
    slippage,
  })

  const networkFee = getSwapNetworkFee({ swapRoute, depositAndFee })

  // if we swap native sol to smth, we need to leave some SOL for covering fees
  if (nativeSOLTokenData?.address === userBaseTokenAccount) {
    if (maxBaseAmount >= networkFee) {
      maxBaseAmount -= networkFee
    } else {
      maxBaseAmount = 0
    }
  }

  const { inAmount, outAmount, outAmountWithSlippage, priceImpactPct } =
    swapRoute || {
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

  const outputUSD = +outputAmount * quotePrice

  const halfButtonOnClick = () =>
    setInputAmount(stripDigitPlaces(maxBaseAmount / 2, 8))

  const maxButtonOnClick = () =>
    setInputAmount(stripDigitPlaces(maxBaseAmount, 8))

  const isAmountsEntered = inputAmount && outputAmount
  const isOpenOrdersCreationRequired =
    depositAndFee?.openOrdersDeposits.length > 0
  const priceImpact = priceImpactPct * 100

  const swapRouteInAmount = removeDecimals(inAmount, baseTokenDecimals)

  const estimatedPrice = stripByAmount(
    getEstimatedPrice({
      inputAmount: swapRouteInAmount,
      outputAmount: removeDecimals(outAmount, quoteTokenDecimals),
      inputPrice: basePrice,
      outputPrice: quotePrice,
      field: priceShowField,
    })
  )

  const pctDiffUsedAndUIInputAmount =
    ((+inputAmount - swapRouteInAmount) / inputAmount) * 100

  const minInputAmount =
    swapRoute &&
    swapRoute.marketInfos[0].minInAmount &&
    removeDecimals(swapRoute.marketInfos[0].minInAmount, baseTokenDecimals)

  const isTooSmallInputAmount = minInputAmount && minInputAmount > inputAmount

  return (
    <SwapPageLayout>
      <SwapPageContainer direction="column" height="100%" wrap="nowrap">
        <SwapContentContainer direction="column">
          <RowContainer justify="flex-start" margin="0 0 2rem 0">
            <SwapSearch
              tokens={mints.map((mint) => ({ mint }))}
              onSelect={(args) => {
                const { amountFrom, tokenFrom, tokenTo } = args
                setBaseTokenMintAddress(tokenFrom.mint)
                setQuoteTokenMintAddress(tokenTo.mint)
                if (amountFrom) {
                  setInputAmount(+amountFrom, tokenFrom.mint, tokenTo.mint)
                }
              }}
            />
          </RowContainer>
          <SwapBlockTemplate theme={theme} width="100%" background="#1A1A1A">
            <RowContainer margin="0 0 .5em 0" justify="space-between">
              <Row>
                <ValueButton>
                  <ReloadTimer
                    duration={15}
                    initialRemainingTime={15}
                    callback={refreshAll}
                    showTime
                    margin="0"
                    timerStyles={{ background: 'transparent' }}
                  />
                </ValueButton>
                {baseTokenMintAddress && quoteTokenMintAddress && (
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
                      color: '#fbf2f2',
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
                    maxAmount={maxBaseAmount}
                    amount={formatNumberToUSFormat(inputAmount)}
                    disabled={false}
                    onChange={(v) => {
                      if (v === '') {
                        setInputAmount(v)
                        return
                      }

                      if (
                        numberWithOneDotRegexp.test(v) &&
                        getNumberOfIntegersFromNumber(v) <= 8 &&
                        getNumberOfDecimalsFromNumber(v) <= 8
                      ) {
                        setInputAmount(v)
                      }
                    }}
                    roundSides={['top-left']}
                    appendComponent={
                      <Row>
                        <SetAmountButton
                          minWidth="0"
                          $fontSize="xs"
                          $fontFamily="demi"
                          $borderRadius="xxl"
                          onClick={halfButtonOnClick}
                          type="button"
                          $variant="secondary"
                          $color="halfWhite"
                          backgroundColor="#383B45"
                          style={{ marginRight: '0.8rem' }}
                        >
                          Half
                        </SetAmountButton>
                        <SetAmountButton
                          minWidth="0"
                          $fontSize="xs"
                          $fontFamily="demi"
                          $borderRadius="xxl"
                          onClick={maxButtonOnClick}
                          type="button"
                          $variant="secondary"
                          $color="halfWhite"
                          backgroundColor="#383B45"
                        >
                          Max
                        </SetAmountButton>
                      </Row>
                    }
                  />
                </Row>
                <Row width="calc(35% - 0.2rem)">
                  <TokenSelector
                    mint={baseTokenMintAddress}
                    roundSides={['top-right']}
                    onClick={() => {
                      setIsBaseTokenSelecting(true)
                      setIsSelectCoinPopupOpen(true)
                    }}
                  />
                </Row>
              </RowContainer>
              <ReverseTokensContainer onClick={reverseTokens}>
                <SvgIcon src={Arrows} width="1em" height="1em" />
              </ReverseTokensContainer>
              <RowContainer justify="space-between" margin=".4rem 0 0 0">
                <Row width="calc(65% - .2rem)">
                  <SwapAmountInput
                    title="You Receive"
                    maxAmount={maxQuoteAmount}
                    amount={
                      outputAmount
                        ? formatNumberToUSFormat(stripByAmount(outputAmount))
                        : ''
                    }
                    disabled
                    roundSides={['bottom-left']}
                    appendComponent={
                      <Text
                        fontFamily="Avenir Next"
                        fontSize={FONT_SIZES.sm}
                        color="#A6A6A6"
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
                    mint={quoteTokenMintAddress}
                    roundSides={['bottom-right']}
                    onClick={() => {
                      setIsBaseTokenSelecting(false)
                      setIsSelectCoinPopupOpen(true)
                    }}
                  />
                </Row>
              </RowContainer>
            </RowContainer>
            {!isLoadingSwapRoute && pctDiffUsedAndUIInputAmount >= 5 && (
              <RowContainer margin="0 0 .5em 0">
                <Text>
                  This swap will only use {swapRouteInAmount} (out of{' '}
                  {inputAmount}) USDC
                </Text>
              </RowContainer>
            )}
            <RowContainer>
              {!publicKey ? (
                <TooltipRegionBlocker
                  isFromRestrictedRegion={isFromRestrictedRegion}
                >
                  <span style={{ width: '100%' }}>
                    <BtnCustom
                      theme={theme}
                      disabled={isFromRestrictedRegion}
                      onClick={() => {
                        if (isFromRestrictedRegion || isRegionCheckIsLoading) {
                          return
                        }
                        setIsConnectWalletPopupOpen(true)
                      }}
                      needMinWidth={false}
                      btnWidth="100%"
                      height="4em"
                      fontSize="1em"
                      padding="1.4em 5em"
                      borderRadius="1.1rem"
                      borderColor={theme.palette.blue.serum}
                      btnColor="#fff"
                      backgroundColor={theme.palette.blue.serum}
                      textTransform="none"
                      transition="all .4s ease-out"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {isRegionCheckIsLoading && (
                        <Loading
                          color="#FFFFFF"
                          size={16}
                          style={{ height: '16px' }}
                        />
                      )}
                      {!isRegionCheckIsLoading &&
                        (isFromRestrictedRegion
                          ? `Restricted region`
                          : `Connect wallet`)}
                    </BtnCustom>
                  </span>
                </TooltipRegionBlocker>
              ) : (
                <SwapButton
                  disabled={isButtonDisabled}
                  onClick={async () => {
                    if (!jupiter || !swapRoute) return

                    setIsSwapInProgress(true)

                    const { transactions } = await jupiter.exchange({
                      route: swapRoute,
                    })

                    const transactionsAndSigners = []

                    if (transactions.setupTransaction) {
                      transactionsAndSigners.push({
                        transaction: transactions.setupTransaction,
                      })
                    }

                    transactionsAndSigners.push({
                      transaction: transactions.swapTransaction,
                    })

                    if (transactions.cleanupTransaction) {
                      transactionsAndSigners.push({
                        transaction: transactions.cleanupTransaction,
                      })
                    }

                    try {
                      const result = await signAndSendTransactions({
                        connection,
                        wallet,
                        transactionsAndSigners,
                      })

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

                      refreshAllTokensData()
                      await refreshAmountsWithSwapRoute()

                      // reset fields
                      if (!result.error) {
                        await setInputAmount('')
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
                        baseSymbol,
                        minInputAmount,
                        isSwapRouteExists: !!swapRoute,
                        needEnterAmount,
                        isTokenABalanceInsufficient,
                        isLoadingSwapRoute,
                        isTooSmallInputAmount,
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

            {isAmountsEntered ? (
              <RowContainer direction="column" margin="2.4rem 0 0 0">
                <RowContainer justify="space-between">
                  <BlackRow justify="center" width="calc(50% - 0.8rem)">
                    <Row>
                      <RowValue>
                        <RowAmountValue>1</RowAmountValue>
                        {priceShowField === 'input' ? baseSymbol : quoteSymbol}
                      </RowValue>
                      <SvgIcon
                        src={ReverseArrows}
                        height="0.9em"
                        width="0.9em"
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
                          {formatNumberToUSFormat(estimatedPrice)}
                        </RowAmountValue>
                        {priceShowField === 'input' ? quoteSymbol : baseSymbol}
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
                      {formatNumberToUSFormat(
                        stripDigitPlaces(
                          getFeeFromSwapRoute({
                            route: swapRoute,
                            tokenInfos,
                            pricesMap: dexTokensPricesMap,
                          }),
                          2
                        )
                      )}
                    </RowValue>
                  </BlackRow>
                  <BlackRow width="calc(50% - 0.8rem)">
                    <RowTitle>Network fee:</RowTitle>
                    <RowValue style={{ display: 'flex' }}>
                      {stripDigitPlaces(
                        networkFee,
                        isOpenOrdersCreationRequired ? 4 : 6
                      )}{' '}
                      SOL{' '}
                      {isOpenOrdersCreationRequired ? (
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
                      stripByAmount(outAmountWithSlippageWithoutDecimals)
                    )}{' '}
                    {quoteSymbol}
                  </RowValue>
                </BlackRow>
              </RowContainer>
            ) : null}
          </SwapBlockTemplate>
        </SwapContentContainer>

        <SelectCoinPopup
          theme={theme}
          mints={mints}
          allTokensData={allTokensData}
          pricesMap={dexTokensPricesMap}
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

        <ConnectWalletPopup
          open={isConnectWalletPopupOpen}
          onClose={() => setIsConnectWalletPopupOpen(false)}
        />
      </SwapPageContainer>
    </SwapPageLayout>
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
