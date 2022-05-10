import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import { FONT_SIZES } from '@variables/variables'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { useConnection } from '@sb/dexUtils/connection'
import {
  getTokenMintAddressByName,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { getFeesAmount } from '@sb/dexUtils/pools/swap/getFeesAmount'
import {
  getPoolsForSwapActiveTab,
  getSelectedPoolForSwap,
  getDefaultBaseToken,
  getDefaultQuoteToken,
} from '@sb/dexUtils/pools/swap/index'
import { multiSwap } from '@sb/dexUtils/pools/swap/multiSwap'
import { useSwapRoute } from '@sb/dexUtils/pools/swap/useSwapRoute'
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
import { numberWithOneDotRegexp } from '@core/utils/helpers'
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
  getRouteMintsPath,
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

  const {
    mints: tokenSelectorMints,
    swapRoute,
    inputAmount,
    outputAmount,
    loading: isLoadingSwapRoute,
    setFieldAmount,
    refresh: refreshAll,
  } = useSwapRoute({
    pools: allPools,
    inputMint: baseTokenMintAddress,
    outputMint: quoteTokenMintAddress,
    // slippage,
  })

  console.log('swapRoute', swapRoute)

  const isSwapRouteExists = swapRoute.length !== 0

  const baseSymbol = getTokenNameByMintAddress(baseTokenMintAddress)
  const quoteSymbol = getTokenNameByMintAddress(quoteTokenMintAddress)

  let { amount: maxBaseAmount, address: userBaseTokenAccount } =
    getTokenDataByMint(
      allTokensData,
      baseTokenMintAddress,
      selectedBaseTokenAddressFromSeveral
    )

  const totalFeeUSD = swapRoute.reduce((acc, step) => {
    const feeAmountTokenA = getFeesAmount({
      amount: step.swapAmountIn,
      pool: step.pool,
    })

    const mint = step.isSwapBaseToQuote ? step.pool.tokenA : step.pool.tokenB
    const symbol = getTokenNameByMintAddress(mint)

    const tokenAPrice = dexTokensPricesMap.get(symbol) || 0

    console.log('acc', { acc, feeAmountTokenA, tokenAPrice })

    return acc + feeAmountTokenA * tokenAPrice
  }, 0)

  const basePrice = dexTokensPricesMap.get(baseSymbol) || 0
  const quotePrice = dexTokensPricesMap.get(quoteSymbol) || 0
  const outputUSD = quotePrice * outputAmount

  // const { decimals: baseTokenDecimals } = tokenInfos.get(
  //   baseTokenMintAddress
  // ) || {
  //   decimals: 0,
  // }

  // const { decimals: quoteTokenDecimals } = tokenInfos.get(
  //   quoteTokenMintAddress
  // ) || {
  //   decimals: 0,
  // }

  const { amount: maxQuoteAmount } = getTokenDataByMint(
    allTokensData,
    quoteTokenMintAddress,
    selectedQuoteTokenAddressFromSeveral
  )

  const networkFee = swapRoute.length * TRANSACTION_COMMON_SOL_FEE

  // if we swap native sol to smth, we need to leave some SOL for covering fees
  if (nativeSOLTokenData?.address === userBaseTokenAccount) {
    if (maxBaseAmount >= networkFee) {
      maxBaseAmount -= networkFee
    } else {
      maxBaseAmount = 0
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

  // const totalWithFees = +quoteAmount - (+quoteAmount / 100) * slippageTolerance

  // const isTokenABalanceInsufficient = baseAmount > +maxBaseAmount

  // const needEnterAmount = +baseAmount === 0 || +quoteAmount === 0
  // const { inAmount, outAmount, outAmountWithSlippage, priceImpactPct } =
  //   swapRoute || {
  //     inAmount: 0,
  //     outAmount: 0,
  //     outAmountWithSlippage: 0,
  //     priceImpactPct: 0,
  //   }

  const outputAmountWithSlippage =
    outputAmount - (outputAmount / 100) * slippage

  const needEnterAmount = +inputAmount === 0
  const isTokenABalanceInsufficient = inputAmount > +maxBaseAmount

  const reverseTokens = () => {
    setBaseTokenMintAddress(quoteTokenMintAddress)
    setQuoteTokenMintAddress(baseTokenMintAddress)

    setBaseTokenAddressFromSeveral(selectedQuoteTokenAddressFromSeveral)
    setQuoteTokenAddressFromSeveral(selectedBaseTokenAddressFromSeveral)

    setFieldAmount(
      stripByAmount(outputAmount),
      'input',
      quoteTokenMintAddress,
      baseTokenMintAddress
    )
  }

  const isButtonDisabled =
    // isLoadingSwapRoute ||
    isTokenABalanceInsufficient ||
    // +baseAmount === 0 ||
    // +quoteAmount === 0 ||
    isSwapInProgress

  // const pctDiffUsedAndUIInputAmount =
  //   ((+inputAmount - swapRouteInAmount) / inputAmount) * 100

  // const reverseTokens = async () => {
  //   setBaseTokenMintAddress(quoteTokenMintAddress)
  //   setQuoteTokenMintAddress(baseTokenMintAddress)

  //   setBaseTokenAddressFromSeveral(selectedQuoteTokenAddressFromSeveral)
  //   setQuoteTokenAddressFromSeveral(selectedBaseTokenAddressFromSeveral)

  //   setBaseAmountWithQuote(
  //     quoteAmount,
  //     quoteTokenMintAddress,
  //     baseTokenMintAddress
  //   )
  // }

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
    setFieldAmount(inputAmount, 'input', baseTokenMint, quoteTokenMint)
  }, [])

  const priceImpact = swapRoute.reduce((acc, step) => {
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
      <SwapPageContainer direction="column" height="100%" wrap="nowrap">
        <SwapContentContainer direction="column">
          <RowContainer justify="flex-start" margin="0 0 2rem 0">
            <SwapSearch
              tokens={tokenSelectorMints.map((mint) => ({ mint }))}
              onSelect={(args) => {
                const { amountFrom, tokenFrom, tokenTo } = args
                setBaseTokenMintAddress(tokenFrom.mint)
                setQuoteTokenMintAddress(tokenTo.mint)
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
                        setFieldAmount(v, 'input')
                        return
                      }

                      if (
                        numberWithOneDotRegexp.test(v) &&
                        getNumberOfIntegersFromNumber(v) <= 8 &&
                        getNumberOfDecimalsFromNumber(v) <= 8
                      ) {
                        setFieldAmount(v, 'input')
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
                          // onClick={halfButtonOnClick}
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
                          // onClick={maxButtonOnClick}
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
                    if (!swapRoute) return

                    setIsSwapInProgress(true)

                    // const { transactions } = await jupiter.exchange({
                    //   route: swapRoute,
                    // })

                    // const transactionsAndSigners = []

                    // if (transactions.setupTransaction) {
                    //   transactionsAndSigners.push({
                    //     transaction: transactions.setupTransaction,
                    //   })
                    // }

                    // transactionsAndSigners.push({
                    //   transaction: transactions.swapTransaction,
                    // })

                    // if (transactions.cleanupTransaction) {
                    //   transactionsAndSigners.push({
                    //     transaction: transactions.cleanupTransaction,
                    //   })
                    // }

                    try {
                      // const result = await signAndSendTransactions({
                      //   connection,
                      //   wallet,
                      //   transactionsAndSigners,
                      // })

                      const result = await multiSwap({
                        wallet,
                        connection,
                        allTokensData,
                        swapRoute,
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
                      await refreshAll()

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
                        baseSymbol,
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
                          {formatNumberToUSFormat(
                            stripByAmount(estimatedPrice)
                          )}
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
                      {formatNumberToUSFormat(stripDigitPlaces(totalFeeUSD, 2))}
                    </RowValue>
                  </BlackRow>
                  <BlackRow width="calc(50% - 0.8rem)">
                    <RowTitle>Network fee:</RowTitle>
                    <RowValue style={{ display: 'flex' }}>
                      {stripDigitPlaces(networkFee, 6)} SOL{' '}
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
                    {quoteSymbol}
                  </RowValue>
                </BlackRow>
              </RowContainer>
            ) : null}
          </SwapBlockTemplate>
        </SwapContentContainer>

        <SelectCoinPopup
          theme={theme}
          mints={tokenSelectorMints}
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
  })
)(SwapPage)
