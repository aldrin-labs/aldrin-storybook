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
import {
  costOfAddingToken,
  TRANSACTION_COMMON_SOL_FEE,
} from '@sb/components/TraidingTerminal/utils'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { TokenAddressesPopup } from '@sb/compositions/Swap/components/TokenAddressesPopup'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { addOrder } from '@sb/dexUtils/twamm/addOrder'
import { PairSettings } from '@sb/dexUtils/twamm/types'
import { sleep } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { withRegionCheck } from '@core/hoc/withRegionCheck'
import { limitDecimalsCustom, stripByAmount } from '@core/utils/chartPageUtils'

import Arrows from '@icons/switchArrows.svg'

// TODO: imports

import { ConnectWalletWrapper } from '../../../components/ConnectWalletWrapper'
import { DEFAULT_FARMING_TICKET_END_TIME } from '../../../dexUtils/common/config'
import { Row, RowContainer } from '../../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../../Pools/index.styles'
import { getTokenDataByMint } from '../../Pools/utils'
import { InputWithSelectorForSwaps } from '../components/InputSelectorForSwap'
import OrderStats from './components/OrderStats/OrderStats'
import { SelectCoinPopup } from './components/SelectCoinPopup'
import { DEFAULT_ORDER_LENGTH } from './config'
import { SwapPageContainer, OrderInputs, OrderStatsWrapper } from './styles'

const MIN_RIN = 10_000_000_000

const PlaceOrder = ({
  theme,
  publicKey,
  getDexTokensPricesQuery,
  pairSettings,
  selectedPairSettings,
  orderArray,
  handleGetOrderArray,
  setTabIndex,
  setIsConnectWalletPopupOpen,
}: {
  theme: Theme
  publicKey: string
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  pairSettings: PairSettings[]
  selectedPairSettings: PairSettings
  orderArray: any
  handleGetOrderArray: () => void
  setTabIndex: (index: number) => void
  setIsConnectWalletPopupOpen: (value: boolean) => void
}) => {
  const { connected, wallet } = useWallet()
  const connection = useConnection()
  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts()

  const [orderLength, setOrderLength] = useState(DEFAULT_ORDER_LENGTH)

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

  const rinTokenPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === 'RIN'
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

  const [tickets] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    onlyUserTickets: true,
  })

  const hasActiveTickets =
    tickets
      .filter((t) => t.endTime === DEFAULT_FARMING_TICKET_END_TIME)
      .reduce((acc, t) => acc + t.tokensFrozen, 0) >= MIN_RIN

  const isButtonDisabled =
    !hasActiveTickets ||
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

    const newValue = value
    // if (value > max) {
    //   newValue = max
    // }
    return newValue
  }

  const setBaseAmountWithQuote = async (newBaseAmount: string | number) => {
    const quoteAmount = newBaseAmount * (baseTokenPrice / quoteTokenPrice)
    setBaseAmount(limitDecimalsCustom(newBaseAmount.toString()))
    setQuoteAmount(stripByAmount(quoteAmount))
  }

  const setQuoteAmountWithBase = async (newQuoteAmount: string | number) => {
    const baseAmount = newQuoteAmount * (quoteTokenPrice / baseTokenPrice)

    setBaseAmount(stripByAmount(baseAmount))
    setQuoteAmount(limitDecimalsCustom(newQuoteAmount.toString()))
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

  const maxOrderSizeQuote = +(100 / baseTokenPrice).toFixed(
    selectedPairSettings.quoteMintDecimals
  )

  const minOrderSize =
    parseInt(selectedPairSettings.minimumTokens.toString()) /
    Math.pow(10, selectedPairSettings.baseMintDecimals)

  const minOrderSizeQuote =
    (parseInt(selectedPairSettings.minimumTokens.toString()) /
      Math.pow(10, selectedPairSettings.baseMintDecimals)) *
    (isSwapBaseToQuote ? baseTokenPrice : quoteTokenPrice)

  const placeOrder = async () => {
    const side = checkSide(quoteTokenMintAddress, baseTokenMintAddress)

    const baseMintDecimals = isSwapBaseToQuote
      ? selectedPairSettings.baseMintDecimals
      : selectedPairSettings.quoteMintDecimals

    const minBaseAmount = isSwapBaseToQuote ? minOrderSize : minOrderSizeQuote

    if (baseAmount < minBaseAmount) {
      notify({
        message: `Min order size is ${minBaseAmount} for ${getTokenNameByMintAddress(
          baseTokenMintAddress
        )} token on this pair.`,
      })
      return
    }

    const maxBaseAmount = isSwapBaseToQuote ? maxOrderSize : maxOrderSizeQuote
    if (baseAmount > maxBaseAmount) {
      notify({
        message: `Max order size is ${maxBaseAmount} for ${getTokenNameByMintAddress(
          baseTokenMintAddress
        )} token on this pair.`,
      })
      return
    }

    if (orderLength < 1) {
      notify({
        message: `Min duration is 1 hour.`,
      })
      return
    }

    setIsOrderInProgress(true)

    const result = await addOrder({
      wallet,
      connection,
      amount: new BN(+baseAmount * 10 ** baseMintDecimals),
      timeLength: new BN(orderLength * 60 * 60),
      pairSettings: selectedPairSettings,
      mintFrom: new PublicKey(baseTokenMintAddress),
      mintTo: new PublicKey(quoteTokenMintAddress),
      orders: [],
      orderArray,
      side,
      allTokensData,
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
      setOrderLength(DEFAULT_ORDER_LENGTH)
      handleGetOrderArray()
      setTabIndex(1)
    }

    // remove loader
    setIsOrderInProgress(false)
  }

  return (
    <SwapPageContainer
      direction="column"
      height="100%"
      width="100%"
      wrap="nowrap"
    >
      <BlockTemplate
        style={{ width: '100%', padding: '2rem 2rem 4rem 2rem', zIndex: '10' }}
      >
        <Row width="100%" align="stretch">
          <Cell col={12} colSm={6}>
            <OrderInputs>
              <RowContainer margin="2rem 0 1rem 0">
                <InputWithSelectorForSwaps
                  tokenDecimals={selectedPairSettings.baseMintDecimals}
                  wallet={wallet}
                  publicKey={publicKey}
                  placeholder="0.00"
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
                  placeholder="0.00"
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

              <RowContainer margin="4rem 0 0rem 0">
                <InputWithType
                  type="number"
                  placeholder="Hours"
                  theme={theme}
                  value={orderLength}
                  metric="Hours"
                  label="Order duration"
                  onChange={handleOrderLength}
                />
              </RowContainer>
            </OrderInputs>
          </Cell>
          <Cell col={12} colSm={6}>
            <OrderStatsWrapper>
              <OrderStats
                orderAmount={baseAmount}
                baseSymbol={baseSymbol}
                cancellingFee={cancellingFee}
                placingFee={placingFee}
                rinTokenPrice={rinTokenPrice}
              />

              <ConnectWalletWrapper size="button-only">
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
                      : 'linear-gradient(91.8deg, #0E02EC 15.31%, #D44C32 89.64%)'
                  }
                  textTransform="none"
                  margin="0.5rem 0 0 0"
                  transition="all .4s ease-out"
                  disabled={isButtonDisabled}
                  onClick={placeOrder}
                >
                  {isOrderInProgress ? (
                    <Loader />
                  ) : !hasActiveTickets ? (
                    'Please stake at least 10 RIN'
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
              </ConnectWalletWrapper>
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
