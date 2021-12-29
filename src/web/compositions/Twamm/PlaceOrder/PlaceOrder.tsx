import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { withRegionCheck } from '@core/hoc/withRegionCheck'

import {DexTokensPrices, PoolInfo} from '@sb/compositions/Pools/index.types'
import { Theme } from '@material-ui/core'

import { Text } from '@sb/compositions/Addressbook'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { notify } from '@sb/dexUtils/notifications'

import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { useWallet } from '@sb/dexUtils/wallet'

import Arrows from '@icons/switchArrows.svg'
import { useConnection } from '@sb/dexUtils/connection'
import withTheme from '@material-ui/core/styles/withTheme'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import {
  getTokenMintAddressByName,
  getTokenNameByMintAddress, useOpenOrdersAccounts,
} from '@sb/dexUtils/markets'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { PublicKey } from '@solana/web3.js'
import { swap } from '@sb/dexUtils/pools/actions/swap'
import { usePoolBalances } from '@sb/dexUtils/pools/hooks/usePoolBalances'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import {
  costOfAddingToken,
  TRANSACTION_COMMON_SOL_FEE,
} from '@sb/components/TraidingTerminal/utils'
import { getMinimumReceivedAmountFromSwap } from '@sb/dexUtils/pools/swap/getMinimumReceivedAmountFromSwap'
import ScalesIcon from '@icons/scales.svg'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { checkIsPoolStable } from '@sb/dexUtils/pools/checkIsPoolStable'
import {
  getPoolsForSwapActiveTab,
  getSelectedPoolForSwap,
  getDefaultBaseToken,
  getDefaultQuoteToken,
} from '@sb/dexUtils/pools/swap'
import { Loader } from '@sb/components/Loader/Loader'
import { sleep } from '@sb/dexUtils/utils'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

// TODO: imports
import { TokenAddressesPopup } from '@sb/compositions/Swap/components/TokenAddressesPopup'
import { getTokenDataByMint } from '../../Pools/utils'
import { SelectCoinPopup } from './components/SelectCoinPopup'
import { SwapPageContainer, OrderInputs, OrderStatsWrapper } from './styles'
import { InputWithSelectorForSwaps } from '@sb/compositions/Swap/components/Inputs'
import { BlockTemplate } from '../../Pools/index.styles'
import { Row, RowContainer } from '../../AnalyticsRoute/index.styles'
import {Cell} from "@sb/components/Layout";
import OrderStats from "./components/OrderStats/OrderStats";
import {InputWithType} from "@sb/components/InputWithType/InputWithType";
import {addOrder} from "@sb/dexUtils/twamm/addOrder";
import BN from "bn.js";
import {getDexTokensPrices} from "@core/graphql/queries/pools/getDexTokensPrices";

const PlaceOrder = ({
  theme,
  publicKey,
  getPoolsInfoQuery,
  getDexTokensPricesQuery,
  pairSettings,
  orderArray,
  handleGetOrderArray,
}: {
  theme: Theme
  publicKey: string
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  pairSettings: any
  orderArray: any
  handleGetOrderArray: () => void
}) => {
  const [selectedPairSettings, setSelectedPairSettings] = useState(pairSettings[0]);

  const { wallet } = useWallet()
  const connection = useConnection()
  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts()
  // const [openOrdersAccounts] = useOpenOrdersAccounts()
  const tokensMap = useTokenInfos()

  const [orderLength, setOrderLength] = useState(0);

  const allPoolsOld = getPoolsInfoQuery.getPoolsInfo
  const allPools = allPoolsOld.filter(pool => pool.parsedName === 'USDC_SOL' || pool.parsedName === 'SOL_USDC');
  const nativeSOLTokenData = allTokensData[0]

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>('')
  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>('')

  // set values from redirect or default one
  useEffect(() => {
    const baseTokenMint = getTokenMintAddressByName(
      getDefaultBaseToken(false)
    );

    setBaseTokenMintAddress(baseTokenMint)

    const quoteTokenMint = getTokenMintAddressByName(
      'USDC'
    );

    setQuoteTokenMintAddress(quoteTokenMint)
  }, [])

  const pools = getPoolsForSwapActiveTab({
    pools: allPools,
    isStableSwapTabActive: false
  })

  const selectedPool = getSelectedPoolForSwap({
    pools,
    baseTokenMintAddress,
    quoteTokenMintAddress,
  })

  const isSelectedPoolStable = checkIsPoolStable(selectedPool)

  const [poolBalances, refreshPoolBalances] = usePoolBalances({
    poolTokenAccountA: selectedPool?.poolTokenAccountA,
    poolTokenAccountB: selectedPool?.poolTokenAccountB,
  })

  // update entered value on every pool ratio change
  useEffect(() => {
    if (!selectedPool || !+baseAmount) return

    const updateQuoteAmount = async () => {
      await setBaseAmountWithQuote(+baseAmount)
    }

    updateQuoteAmount()
  }, [poolBalances.baseTokenAmount, poolBalances.quoteTokenAmount])

  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3)
  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)

  const [selectedBaseTokenAddressFromSeveral, setBaseTokenAddressFromSeveral] =
    useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')

  const isSwapBaseToQuote = selectedPool?.tokenA === baseTokenMintAddress

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)
  const [isOrderInProgress, setIsOrderInProgress] = useState(false)

  const baseSymbol = getTokenNameByMintAddress(baseTokenMintAddress)
  const quoteSymbol = getTokenNameByMintAddress(quoteTokenMintAddress)

  const baseTokenPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === baseSymbol
    )[0]?.price || 0;

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

  const replaceMint = (mint: string) => {
    if(mint === 'So11111111111111111111111111111111111111112') {
      return pairSettings[0].baseTokenMint.toString();
    } else if(mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') {
      return pairSettings[0].quoteTokenMint.toString();
    }
    return mint;
  }

  let {
    address: userBaseTokenAccount,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    replaceMint(baseTokenMintAddress),
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

  const {
    address: userQuoteTokenAccount,
    decimals: quoteTokenDecimals,
    amount: maxQuoteAmount,
  } = getTokenDataByMint(
    allTokensData,
    replaceMint(quoteTokenMintAddress),
    selectedQuoteTokenAddressFromSeveral
  )

  const reverseTokens = async () => {
    setBaseTokenMintAddress(quoteTokenMintAddress)
    setQuoteTokenMintAddress(baseTokenMintAddress)

    setBaseTokenAddressFromSeveral(selectedQuoteTokenAddressFromSeveral)
    setQuoteTokenAddressFromSeveral(selectedBaseTokenAddressFromSeveral)

    await setBaseAmountWithQuote(
      quoteAmount,
      selectedPool?.tokenA === quoteTokenMintAddress
    )
  }

  const poolsAmountDiff = isSwapBaseToQuote
    ? +poolAmountTokenA / +baseAmount
    : +poolAmountTokenA / +quoteAmount

  // price impact due to curve
  const rawSlippage = 100 / (poolsAmountDiff + 1)
  const totalWithFees = +quoteAmount - (+quoteAmount / 100) * slippageTolerance

  const isTokenABalanceInsufficient = baseAmount > +maxBaseAmount

  const needEnterAmount = baseAmount == 0 || quoteAmount == 0

  const isButtonDisabled =
    isTokenABalanceInsufficient ||
    !selectedPool ||
    !selectedPool.supply ||
    baseAmount == 0 ||
    quoteAmount == 0 ||
    orderLength == 0 ||
    isOrderInProgress

  // for cases with SOL token
  const isBaseTokenSOL = baseSymbol === 'SOL'
  const isQuoteTokenSOL = quoteSymbol === 'SOL'

  const isPoolWithSOLToken = isBaseTokenSOL || isQuoteTokenSOL

  const isNativeSOLSelected =
    nativeSOLTokenData?.address === userBaseTokenAccount ||
    nativeSOLTokenData?.address === userQuoteTokenAccount

  const transferSOLToWrapped = isPoolWithSOLToken && isNativeSOLSelected

  const userPoolBaseTokenAccount = isSwapBaseToQuote
    ? userBaseTokenAccount
    : userQuoteTokenAccount

  const userPoolBaseTokenPublicKey = userPoolBaseTokenAccount
    ? new PublicKey(userPoolBaseTokenAccount)
    : null

  const userPoolQuoteTokenAccount = isSwapBaseToQuote
    ? userQuoteTokenAccount
    : userBaseTokenAccount

  const userPoolQuoteTokenPublicKey = userPoolQuoteTokenAccount
    ? new PublicKey(userPoolQuoteTokenAccount)
    : null

  const setValueBasedOnRange = (min: number, max: number, value: number) => {

  }

  const setBaseAmountWithQuote = async (
    newBaseAmount: string | number,
    isSwapBaseToQuoteFromArgs?: boolean
  ) => {
    let newBaseAmountCopy = newBaseAmount;
    if(newBaseAmountCopy > maxOrderSize) {
      newBaseAmountCopy = maxOrderSize
    } else if(newBaseAmountCopy < minOrderSize) {
      newBaseAmountCopy = minOrderSize;
    }
    setBaseAmount(newBaseAmountCopy)
    console.log('tokenDecimals', baseTokenDecimals)
    console.log('newBaseAmount', newBaseAmount)
    // let tokensMapCopy = [...tokensMap.entries()];
    // console.log(tokensMapCopy, 'tokensMapCopy')
    // tokensMapCopy.forEach((token, index) => {
    //   if(token[0] === baseTokenMintAddress) {
    //     console.log('poolpos')
    //   }
    // })
    const swapAmountOut = await getMinimumReceivedAmountFromSwap({
      swapAmountIn: +newBaseAmountCopy,
      isSwapBaseToQuote: isSwapBaseToQuoteFromArgs ?? isSwapBaseToQuote,
      pool: selectedPool,
      wallet,
      tokensMap,
      connection,
      userBaseTokenAccount: userPoolBaseTokenPublicKey,
      userQuoteTokenAccount: userPoolQuoteTokenPublicKey,
      transferSOLToWrapped,
      allTokensData,
      poolBalances,
    })

    if (swapAmountOut === 0) {
      setQuoteAmount('')
    } else {
      setQuoteAmount(swapAmountOut)
    }
  }

  const setQuoteAmountWithBase = async (newQuoteAmount: string | number) => {
    const isSwapBaseToQuoteForQuoteChange = !isSwapBaseToQuote

    setQuoteAmount(newQuoteAmount)

    const swapAmountOut = await getMinimumReceivedAmountFromSwap({
      swapAmountIn: +newQuoteAmount,
      isSwapBaseToQuote: isSwapBaseToQuoteForQuoteChange,
      pool: selectedPool,
      wallet,
      tokensMap,
      connection,
      userBaseTokenAccount: userPoolBaseTokenPublicKey,
      userQuoteTokenAccount: userPoolQuoteTokenPublicKey,
      transferSOLToWrapped,
      allTokensData,
      poolBalances,
    })

    if (swapAmountOut === 0) {
      setBaseAmount('')
    } else {
      setBaseAmount(swapAmountOut)
    }
  }

  const handleOrderLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderLength(+event.target.value)
  }

  const checkSide = (mintTo, mintFrom) => {
    let side = null;
    if(mintFrom === selectedPairSettings.baseTokenMint.toString() && mintTo === selectedPairSettings.quoteTokenMint.toString()) {
      side = 'ask';
    } else if(mintTo === selectedPairSettings.baseTokenMint.toString() && mintFrom === selectedPairSettings.quoteTokenMint.toString()) {
      side = 'bid';
    }
    return side;
  }

  let mints = [...new Set(pools.map((i) => [i.tokenA, i.tokenB]).flat())];
  // let filteredMints: string[] = [...mints];
  // pairSettings.forEach(pair => {
  //   // if(mints.includes(pair.baseTokenMint.toString()) || mints.includes(pair.quoteTokenMint.toString())) {
  //   //   filteredMints.push(pair)
  //   // }
  //   filteredMints.push([pair.baseTokenMint.toString(), pair.quoteTokenMint.toString()])
  // })

  const placingFee = parseInt(selectedPairSettings.fees.placingFeeNumerator.toString())/parseInt(selectedPairSettings.fees.placingFeeDenominator.toString());
  const cancellingFee = parseInt(selectedPairSettings.fees.cancellingFeeNumerator.toString())/parseInt(selectedPairSettings.fees.cancellingFeeDenominator.toString());
  const maxOrderSize = (100/baseTokenPrice).toFixed(selectedPairSettings.baseMintDecimals);
  const minOrderSize = parseInt(selectedPairSettings.minimumTokens.toString())/Math.pow(10, selectedPairSettings.baseMintDecimals)
  console.log('maxOrderSize', {maxOrderSize, baseTokenPrice, selectedPairSettings: selectedPairSettings.baseMintDecimals})
  console.log('minOrderSize', {minOrderSize})

  return (
    <SwapPageContainer direction="column" height="100%" width="100%" wrap="nowrap">
      <BlockTemplate
        theme={theme}
        style={{ width: '100%', padding: '2rem', zIndex: '10' }}
      >
        <Row width={'100%'} align="flex-start">
          <Cell col={12} colSm={6}>
            <OrderInputs>
              <RowContainer margin="2rem 0 1rem 0">
                <InputWithSelectorForSwaps
                  wallet={wallet}
                  publicKey={publicKey}
                  placeholder={
                    +baseAmount === 0 && +quoteAmount !== 0 && isSelectedPoolStable
                      ? 'Insufficient Balance'
                      : '0.00'
                  }
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
                      label: "Maximum Order Size",
                      value: maxOrderSize
                    }
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
                {isSelectedPoolStable ? (
                  <DarkTooltip title="This pool uses the stable curve, which provides better rates for swapping stablecoins.">
                    <div>
                      <SvgIcon src={ScalesIcon} width="2rem" height="2rem" />
                    </div>
                  </DarkTooltip>
                ) : null}
              </RowContainer>
              <RowContainer margin="1rem 0 2rem 0">
                <InputWithSelectorForSwaps
                  wallet={wallet}
                  publicKey={publicKey}
                  placeholder={
                    +quoteAmount === 0 && +baseAmount !== 0 && isSelectedPoolStable
                      ? 'Insufficient Balance'
                      : '0.00'
                  }
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
                  placeholder="Hours"
                  theme={theme}
                  value={orderLength}
                  metric="Hours"
                  onChange={handleOrderLength}
                />
              </RowContainer>

              {selectedPool && (
                <RowContainer margin="1rem 2rem" justify="space-between" style={{width: 'auto'}}>
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
                    {isSelectedPoolStable
                      ? 1
                      : isSwapBaseToQuote
                        ? stripDigitPlaces(+poolAmountTokenB / +poolAmountTokenA, 8)
                        : stripDigitPlaces(
                          +(+poolAmountTokenA / +poolAmountTokenB),
                          8
                        )}{' '}
                    <Text fontSize="1.5rem" fontFamily="Avenir Next Demi">
                      {quoteSymbol}{' '}
                    </Text>
                  </Text>
                </RowContainer>
              )}

              <RowContainer>

              </RowContainer>
            </OrderInputs>
          </Cell>
          <Cell col={12} colSm={6}>
            <OrderStatsWrapper>
              <OrderStats
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
                    if (!selectedPool) return

                    setIsOrderInProgress(true)

                    const side = checkSide(new PublicKey(replaceMint(quoteTokenMintAddress)).toString(), new PublicKey(replaceMint(baseTokenMintAddress)).toString());
                    const result = await addOrder({
                      wallet,
                      connection,
                      amount: new BN(+baseAmount * 10 ** baseTokenDecimals),
                      timeLength: new BN(orderLength),
                      pairSettings: selectedPairSettings,
                      mintFrom: new PublicKey(replaceMint(baseTokenMintAddress)),
                      mintTo: new PublicKey(replaceMint(quoteTokenMintAddress)),
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

                    refreshPoolBalances()
                    refreshAllTokensData()

                    // reset fields
                    if (result === 'success') {
                      setBaseAmount('')
                      setQuoteAmount('')
                      setOrderLength(0)
                      handleGetOrderArray()
                    }

                    // remove loader
                    setIsOrderInProgress(false)
                  }}
                >
                  {isOrderInProgress ? (
                    <Loader />
                  ) : isTokenABalanceInsufficient ? (
                    `Insufficient ${isTokenABalanceInsufficient ? baseSymbol : quoteSymbol
                    } Balance`
                  ) : !selectedPool ? (
                    'No pools available'
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
        poolsInfo={pools}
        theme={theme}
        mints={mints}
        replaceMint={replaceMint}
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
    name: 'getDexTokensPricesQuery',
    query: getDexTokensPrices,
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000,
  })
)(PlaceOrder)
