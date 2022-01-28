import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import React, { useCallback, useEffect, useState } from 'react'
import { compose } from 'recompose'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
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
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { withRegionCheck } from '@core/hoc/withRegionCheck'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { removeDecimals } from '@core/utils/helpers'

import Gear from '@icons/gear.svg'
import Inform from '@icons/inform.svg'
import Arrows from '@icons/switchArrows.svg'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { TableModeButton } from '../Pools/components/Tables/TablesSwitcher/styles'
import { BlockTemplate } from '../Pools/index.styles'
import { getTokenDataByMint } from '../Pools/utils'
import { Cards } from './components/Cards/Cards'
import { InputWithSelectorForSwaps } from './components/Inputs/index'
import { SelectCoinPopup } from './components/SelectCoinPopup'
import { Selector } from './components/Selector/Selector'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
import { TransactionSettingsPopup } from './components/TransactionSettingsPopup'
import { Card, SwapPageContainer } from './styles'
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

  const dexTokensPricesMap = getDexTokensPricesQuery.getDexTokensPrices.reduce(
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

  const reverseTokens = useCallback(async () => {
    setBaseTokenMintAddress(quoteTokenMintAddress)
    setQuoteTokenMintAddress(baseTokenMintAddress)

    setBaseTokenAddressFromSeveral(selectedQuoteTokenAddressFromSeveral)
    setQuoteTokenAddressFromSeveral(selectedBaseTokenAddressFromSeveral)

    await reverseTokenAmounts()
  }, [
    reverseTokenAmounts,
    quoteTokenMintAddress,
    baseTokenMintAddress,
    selectedQuoteTokenAddressFromSeveral,
    selectedBaseTokenAddressFromSeveral,
  ])

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

  console.log('route', swapRoute, swapRoute?.getDepositAndFee())

  return (
    <SwapPageContainer direction="column" height="100%" wrap="nowrap">
      <>
        <Row width="50rem" justify="flex-start" margin="2rem 1rem">
          <TableModeButton
            isActive={!isStableSwapTabActive}
            onClick={() => setIsStableSwapTabActive(false)}
            fontSize="1.5rem"
          >
            All
          </TableModeButton>
          <TableModeButton
            isActive={isStableSwapTabActive}
            onClick={() => setIsStableSwapTabActive(true)}
            fontSize="1.5rem"
          >
            Stable Swap
          </TableModeButton>
        </Row>
        <Row width="50rem" justify="flex-start" margin="0 0 2rem 0">
          <Selector
            data={pools}
            setBaseTokenMintAddress={setBaseTokenMintAddress}
            setQuoteTokenMintAddress={setQuoteTokenMintAddress}
          />
        </Row>
        <BlockTemplate
          theme={theme}
          width="50rem"
          style={{ padding: '2rem', zIndex: '10' }}
        >
          <RowContainer margin="1rem 0" justify="space-between">
            <Text>
              Slippage Tolerance: <strong>{slippage}%</strong>
            </Text>
            <Row>
              <ReloadTimer
                duration={15}
                initialRemainingTime={15}
                margin="0 1.5rem 0 0"
                callback={refreshAll}
              />
              {baseTokenMintAddress && quoteTokenMintAddress && (
                <TimerButton
                  onClick={() => openTokensAddressesPopup(true)}
                  margin="0 1.5rem 0 0"
                >
                  <SvgIcon src={Inform} width="60%" height="60%" />
                </TimerButton>
              )}
              <TimerButton
                margin="0"
                onClick={() => openTransactionSettingsPopup(true)}
              >
                <SvgIcon src={Gear} width="60%" height="60%" />
              </TimerButton>
            </Row>
          </RowContainer>
          <RowContainer margin="2rem 0 1rem 0">
            <InputWithSelectorForSwaps
              wallet={wallet}
              publicKey={publicKey}
              placeholder="0.00"
              theme={theme}
              directionFrom
              value={+inputAmount || +outputAmount === 0 ? inputAmount : ''}
              disabled={!baseTokenMintAddress || !quoteTokenMintAddress}
              onChange={(v) => {
                // setInputAmount(v)
                setInputsAmounts(v)
              }}
              symbol={baseSymbol}
              maxBalance={maxBaseAmount}
              openSelectCoinPopup={() => {
                setIsBaseTokenSelecting(true)
                setIsSelectCoinPopupOpen(true)
              }}
            />
          </RowContainer>
          <RowContainer justify="space-between" margin="0 2rem">
            <SvgIcon
              style={{ cursor: 'pointer' }}
              src={Arrows}
              width="2rem"
              height="2rem"
              onClick={reverseTokens}
            />
          </RowContainer>
          <RowContainer margin="1rem 0 2rem 0">
            <InputWithSelectorForSwaps
              wallet={wallet}
              publicKey={publicKey}
              placeholder="0.00"
              theme={theme}
              disabled={
                true ||
                !baseTokenMintAddress ||
                !quoteTokenMintAddress ||
                (!baseTokenMintAddress && !quoteTokenMintAddress)
              }
              value={+outputAmount || +inputAmount === 0 ? outputAmount : ''}
              symbol={quoteSymbol}
              maxBalance={maxQuoteAmount}
              openSelectCoinPopup={() => {
                setIsBaseTokenSelecting(false)
                setIsSelectCoinPopupOpen(true)
              }}
            />
          </RowContainer>

          <RowContainer margin="1rem 2rem" justify="space-between">
            <Text color="#93A0B2">Est. Price:</Text>
            <Text
              fontSize="1.5rem"
              color="#53DF11"
              fontFamily="Avenir Next Demi"
            >
              1{' '}
              <Text fontSize="1.5rem" fontFamily="Avenir Next Demi">
                {baseSymbol}{' '}
              </Text>
              ={' '}
              {stripByAmount(
                getEstimatedPrice({
                  route: swapRoute,
                  inputPrice: basePrice,
                  outputPrice: quotePrice,
                })
              )}{' '}
              <Text fontSize="1.5rem" fontFamily="Avenir Next Demi">
                {quoteSymbol}{' '}
              </Text>
            </Text>
          </RowContainer>

          <RowContainer>
            {!publicKey ? (
              <BtnCustom
                theme={theme}
                onClick={wallet.connect}
                needMinWidth={false}
                btnWidth="100%"
                height="5.5rem"
                fontSize="1.4rem"
                padding="2rem 8rem"
                borderRadius="1.1rem"
                borderColor={theme.palette.blue.serum}
                btnColor="#fff"
                backgroundColor={theme.palette.blue.serum}
                textTransform="none"
                margin="2rem 0 0 0"
                transition="all .4s ease-out"
                style={{ whiteSpace: 'nowrap' }}
              >
                Connect wallet
              </BtnCustom>
            ) : (
              <BtnCustom
                btnWidth="100%"
                height="5.5rem"
                fontSize="1.4rem"
                padding="1rem 2rem"
                borderRadius=".8rem"
                borderColor="none"
                btnColor="#fff"
                backgroundColor={
                  isButtonDisabled
                    ? '#3A475C'
                    : 'linear-gradient(91.8deg, #651CE4 15.31%, #D44C32 89.64%)'
                }
                textTransform="none"
                margin="2rem 0 0 0"
                transition="all .4s ease-out"
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
              </BtnCustom>
            )}
          </RowContainer>
        </BlockTemplate>
        {inputAmount && outputAmount && (
          <Card
            style={{ padding: '2rem' }}
            theme={theme}
            width="45rem"
            height="12rem"
          >
            <RowContainer margin="0.5rem 0" justify="space-between">
              <Text color="#93A0B2">Minimum received</Text>
              <Row style={{ flexWrap: 'nowrap' }}>
                <Text
                  style={{ padding: '0 0.5rem 0 0.5rem' }}
                  fontFamily="Avenir Next Bold"
                  color="#53DF11"
                >
                  {stripByAmount(outAmountWithSlippageWithoutDecimals)}{' '}
                </Text>
                <Text fontFamily="Avenir Next Bold">{quoteSymbol}</Text>
              </Row>
            </RowContainer>
            <RowContainer margin="0.5rem 0" justify="space-between">
              <Text color="#93A0B2">Price Impact</Text>
              <Row style={{ flexWrap: 'nowrap' }}>
                <Text
                  style={{ padding: '0 0.5rem 0 0.5rem' }}
                  fontFamily="Avenir Next Bold"
                  color="#53DF11"
                >
                  {stripByAmount(priceImpactPct * 100)}%
                </Text>
              </Row>
            </RowContainer>
            <RowContainer margin="0.5rem 0" justify="space-between">
              <Text color="#93A0B2">Liquidity provider fee</Text>
              <Row style={{ flexWrap: 'nowrap' }}>
                <Text
                  style={{ padding: '0 0.5rem 0 0.5rem' }}
                  fontFamily="Avenir Next Bold"
                >
                  $
                  {stripByAmount(
                    getFeeFromSwapRoute({
                      route: swapRoute,
                      tokenInfos,
                      pricesMap: dexTokensPricesMap,
                    })
                  )}{' '}
                </Text>
              </Row>
            </RowContainer>
          </Card>
        )}
        <Cards />
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
        // mints={[...new Set(mints)]}
        mints={[...new Set(pools.map((i) => [i.tokenA, i.tokenB]).flat())]}
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
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(SwapPage)
