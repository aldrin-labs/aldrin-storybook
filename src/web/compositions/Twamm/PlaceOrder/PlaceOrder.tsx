import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { InputWithType } from '@sb/components/InputWithType/InputWithType'
import { Cell } from '@sb/components/Layout'
import { Loader } from '@sb/components/Loader/Loader'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import {
  costOfAddingToken,
  TRANSACTION_COMMON_SOL_FEE,
} from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { InputWithSelectorForSwaps } from '@sb/compositions/Swap/components/Inputs'
import { TokenAddressesPopup } from '@sb/compositions/Swap/components/TokenAddressesPopup'
import { useConnection } from '@sb/dexUtils/connection'
import {
  getTokenMintAddressByName,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { checkIsPoolStable } from '@sb/dexUtils/pools/checkIsPoolStable'
import { usePoolBalances } from '@sb/dexUtils/pools/hooks/usePoolBalances'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useWallet } from '@sb/dexUtils/wallet'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { withRegionCheck } from '@core/hoc/withRegionCheck'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import ScalesIcon from '@icons/scales.svg'
import Arrows from '@icons/switchArrows.svg'

import { withPublicKey } from '@core/hoc/withPublicKey'

import { getMinimumReceivedAmountFromSwap } from '@sb/dexUtils/pools/swap/getMinimumReceivedAmountFromSwap'
import {
  getPoolsForSwapActiveTab,
  getSelectedPoolForSwap,
  getDefaultBaseToken,
} from '@sb/dexUtils/pools/swap'
import { sleep } from '@sb/dexUtils/utils'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

// TODO: imports
import { addOrder } from '@sb/dexUtils/twamm/addOrder'

import { Row, RowContainer } from '../../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../../Pools/index.styles'
import { getTokenDataByMint } from '../../Pools/utils'
import OrderStats from './components/OrderStats/OrderStats'
import { SelectCoinPopup } from './components/SelectCoinPopup'
import { SwapPageContainer, OrderInputs, OrderStatsWrapper } from './styles'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { PairSettings } from '@sb/dexUtils/twamm/types'

const PlaceOrder = ({
  theme,
  publicKey,
  getDexTokensPricesQuery,
  pairSettings,
  orderArray,
  handleGetOrderArray,
}: {
  theme: Theme
  publicKey: string
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  pairSettings: PairSettings[]
  orderArray: any
  handleGetOrderArray: () => void
}) => {
  // change to 0 before prod
  const selectedPairSettings = pairSettings[1]

  const { wallet } = useWallet()
  const connection = useConnection()
  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts()

  const [orderLength, setOrderLength] = useState(60)

  const nativeSOLTokenData = allTokensData[0]

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>('')
  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>('')

  // set values from redirect or default one
  useEffect(() => {
    if (selectedPairSettings) {
      setBaseTokenMintAddress(selectedPairSettings.baseTokenMint)
      setQuoteTokenMintAddress(selectedPairSettings.quoteTokenMint)
    }
  }, [selectedPairSettings])

  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)

  const [selectedBaseTokenAddressFromSeveral, setBaseTokenAddressFromSeveral] =
    useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')

  const isSwapBaseToQuote =
    selectedPairSettings.baseTokenMint === baseTokenMintAddress

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)
  const [isOrderInProgress, setIsOrderInProgress] = useState(false)

  const baseSymbol = getTokenNameByMintAddress(baseTokenMintAddress)
  const quoteSymbol = getTokenNameByMintAddress(quoteTokenMintAddress)

  const baseTokenPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === baseSymbol
    )[0]?.price || 0

  const quoteTokenPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === quoteSymbol
    )[0]?.price || 0

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

  const reverseTokens = async () => {
    setBaseTokenMintAddress(quoteTokenMintAddress)
    setQuoteTokenMintAddress(baseTokenMintAddress)

    setBaseTokenAddressFromSeveral(selectedQuoteTokenAddressFromSeveral)
    setQuoteTokenAddressFromSeveral(selectedBaseTokenAddressFromSeveral)

    setBaseAmount(quoteAmount)
    setQuoteAmount(baseAmount)
  }

  const isTokenABalanceInsufficient = baseAmount > +maxBaseAmount

  const needEnterAmount = baseAmount == 0 || quoteAmount == 0

  const isButtonDisabled =
    isTokenABalanceInsufficient ||
    baseAmount == 0 ||
    quoteAmount == 0 ||
    orderLength == 0 ||
    isOrderInProgress

  const setValueBasedOnRange = (value: number | string, max: number) => {
    // empty input field
    if (value === '') {
      return value
    }

    let newValue = value
    if (value > max) {
      newValue = max
    }
    return newValue
  }

  const setBaseAmountWithQuote = async (newBaseAmount: string | number) => {
    let baseAmountInRange = setValueBasedOnRange(newBaseAmount, maxOrderSize)
    const quoteAmount = baseAmountInRange * (baseTokenPrice / quoteTokenPrice)

    setBaseAmount(baseAmountInRange)
    setQuoteAmount(stripDigitPlaces(quoteAmount, 8))
  }

  const setQuoteAmountWithBase = async (newQuoteAmount: string | number) => {
    let quoteAmountInRange = setValueBasedOnRange(
      newQuoteAmount,
      maxOrderSizeQuote
    )

    const baseAmount = quoteAmountInRange * (quoteTokenPrice / baseTokenPrice)

    setBaseAmount(baseAmount)
    setQuoteAmount(quoteAmountInRange)
  }

  const handleOrderLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderLength(event.target.value)
  }

  const checkSide = (mintTo, mintFrom) => {
    let side = null
    if (
      mintFrom === selectedPairSettings.baseTokenMint &&
      mintTo === selectedPairSettings.quoteTokenMint
    ) {
      side = 'ask'
    } else if (
      mintTo === selectedPairSettings.baseTokenMint &&
      mintFrom === selectedPairSettings.quoteTokenMint
    ) {
      side = 'bid'
    }
    return side
  }

  const mints = [
    ...new Set(
      pairSettings.map((i) => [i.baseTokenMint, i.quoteTokenMint]).flat()
    ),
  ]

  const placingFee =
    parseInt(selectedPairSettings.fees.placingFeeNumerator.toString()) /
    parseInt(selectedPairSettings.fees.placingFeeDenominator.toString())

  const cancellingFee =
    parseInt(selectedPairSettings.fees.cancellingFeeNumerator.toString()) /
    parseInt(selectedPairSettings.fees.cancellingFeeDenominator.toString())

  const maxOrderSize = +(100 / baseTokenPrice).toFixed(
    selectedPairSettings.baseMintDecimals
  )

  const maxOrderSizeQuote = +(100 / quoteTokenPrice).toFixed(
    selectedPairSettings.quoteMintDecimals
  )

  const minOrderSize =
    parseInt(selectedPairSettings.minimumTokens.toString()) /
    Math.pow(10, selectedPairSettings.baseMintDecimals)

  const minOrderSizeQuote =
    (parseInt(selectedPairSettings.minimumTokens.toString()) /
      Math.pow(10, selectedPairSettings.baseMintDecimals)) *
    (isSwapBaseToQuote ? baseTokenPrice : quoteTokenPrice)

  return (
    <SwapPageContainer
      direction="column"
      height="100%"
      width="100%"
      wrap="nowrap"
    >
      <BlockTemplate
        theme={theme}
        style={{ width: '100%', padding: '2rem', zIndex: '10' }}
      >
        <Row width="100%" align="flex-start">
          <Cell col={12} colSm={6}>
            <OrderInputs>
              <RowContainer margin="2rem 0 1rem 0">
                <InputWithSelectorForSwaps
                  tokenDecimals={selectedPairSettings.baseMintDecimals}
                  wallet={wallet}
                  publicKey={publicKey}
                  placeholder={'0.00'}
                  theme={theme}
                  directionFrom
                  value={+baseAmount || +quoteAmount === 0 ? baseAmount : ''}
                  disabled={
                    !baseTokenMintAddress ||
                    !quoteTokenMintAddress ||
                    (!baseTokenMintAddress && !quoteTokenMintAddress)
                  }
                  onChange={setBaseAmountWithQuote}
                  symbol={baseSymbol}
                  maxBalance={maxBaseAmount}
                  openSelectCoinPopup={() => {
                    setIsBaseTokenSelecting(true)
                    setIsSelectCoinPopupOpen(true)
                  }}
                  customStats={[
                    {
                      label: 'Maximum Order Size',
                      value: maxOrderSize,
                    },
                  ]}
                />
              </RowContainer>
              <RowContainer justify="space-between" margin="0 2rem">
                <SvgIcon
                  style={{ cursor: 'pointer' }}
                  src={Arrows}
                  width="2rem"
                  height="2rem"
                  onClick={() => {
                    reverseTokens()
                  }}
                />
              </RowContainer>
              <RowContainer margin="1rem 0 2rem 0">
                <InputWithSelectorForSwaps
                  tokenDecimals={selectedPairSettings.quoteMintDecimals}
                  wallet={wallet}
                  publicKey={publicKey}
                  placeholder={'0.00'}
                  theme={theme}
                  disabled={
                    !baseTokenMintAddress ||
                    !quoteTokenMintAddress ||
                    (!baseTokenMintAddress && !quoteTokenMintAddress)
                  }
                  value={+quoteAmount || +baseAmount === 0 ? quoteAmount : ''}
                  onChange={setQuoteAmountWithBase}
                  symbol={quoteSymbol}
                  maxBalance={maxQuoteAmount}
                  openSelectCoinPopup={() => {
                    setIsBaseTokenSelecting(false)
                    setIsSelectCoinPopupOpen(true)
                  }}
                />
              </RowContainer>

              <RowContainer margin="4rem 0 2rem 0">
                <InputWithType
                  placeholder="Minutes"
                  theme={theme}
                  value={orderLength}
                  metric="Minutes"
                  onChange={handleOrderLength}
                />
              </RowContainer>
            </OrderInputs>
          </Cell>
          <Cell col={12} colSm={6}>
            <OrderStatsWrapper>
              <OrderStats
                orderAmount={baseAmount * baseTokenPrice}
                baseSymbol={baseSymbol}
                cancellingFee={cancellingFee}
                placingFee={placingFee}
              />
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
                    const side = checkSide(
                      quoteTokenMintAddress,
                      baseTokenMintAddress
                    )

                    const baseMintDecimals = isSwapBaseToQuote
                      ? selectedPairSettings.baseMintDecimals
                      : selectedPairSettings.quoteMintDecimals

                    const minBaseAmount = isSwapBaseToQuote
                      ? minOrderSize
                      : minOrderSizeQuote

                    if (baseAmount < minBaseAmount) {
                      notify({
                        message: `Min order size is ${minBaseAmount} for ${getTokenNameByMintAddress(
                          baseTokenMintAddress
                        )} token on this pair.`,
                      })
                      return
                    }

                    setIsOrderInProgress(true)

                    const result = await addOrder({
                      wallet,
                      connection,
                      amount: new BN(+baseAmount * 10 ** baseMintDecimals),
                      timeLength: new BN(orderLength * 60),
                      pairSettings: selectedPairSettings,
                      mintFrom: new PublicKey(baseTokenMintAddress),
                      mintTo: new PublicKey(quoteTokenMintAddress),
                      orders: [],
                      orderArray,
                      side,
                    })

                    notify({
                      type: result === 'success' ? 'success' : 'error',
                      message:
                        result === 'success'
                          ? 'Order placed successfully.'
                          : result === 'failed'
                          ? 'Order placing operation failed.'
                          : 'Order placing cancelled',
                    })

                    // refresh data
                    await sleep(2 * 1000)

                    refreshAllTokensData()

                    // reset fields
                    if (result === 'success') {
                      setBaseAmount('')
                      setQuoteAmount('')
                      setOrderLength(60)
                      handleGetOrderArray()
                    }

                    // remove loader
                    setIsOrderInProgress(false)
                  }}
                >
                  {isOrderInProgress ? (
                    <Loader />
                  ) : isTokenABalanceInsufficient ? (
                    `Insufficient ${
                      isTokenABalanceInsufficient ? baseSymbol : quoteSymbol
                    } Balance`
                  ) : needEnterAmount ? (
                    'Enter amount'
                  ) : (
                    'Place Time-Weighted Average Order'
                  )}
                </BtnCustom>
              )}
            </OrderStatsWrapper>
          </Cell>
        </Row>
      </BlockTemplate>

      <SelectCoinPopup
        pairSettings={pairSettings}
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
  )
}

export default compose(
  withTheme(),
  withPublicKey,
  withRegionCheck,
  queryRendererHoc({
    name: 'getDexTokensPricesQuery',
    query: getDexTokensPrices,
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000,
  })
)(PlaceOrder)
