import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { Theme } from '@material-ui/core'

import { Text } from '@sb/components/Typography'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { notify } from '@sb/dexUtils/notifications'

import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { useWallet } from '@sb/dexUtils/wallet'

import Inform from '@icons/inform.svg'
import Gear from '@icons/gear.svg'
import Arrows from '@icons/switchArrows.svg'
import { useConnection } from '@sb/dexUtils/connection'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import withTheme from '@material-ui/core/styles/withTheme'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import {
  getTokenNameByMintAddress,
  useAllMarketsList,
} from '@sb/dexUtils/markets'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { PublicKey, PublicKey } from '@solana/web3.js'
import { swap } from '@sb/dexUtils/pools/swap'
import { getTokenDataByMint } from '../Pools/utils'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
import { REBALANCE_CONFIG } from '../Rebalance/Rebalance.config'
import { TokenInfo } from '../Rebalance/Rebalance.types'
import { getAllTokensData } from '../Rebalance/utils'
import { TransactionSettingsPopup } from './components/TransactionSettingsPopup'
import { SelectCoinPopup } from './components/SelectCoinPopup'
import { Card } from './styles'
import { InputWithSelectorForSwaps } from './components/Inputs/index'
import { ReloadTimer, TimerButton } from '../Rebalance/components/ReloadTimer'
import { BlockTemplate } from '../Pools/index.styles'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { mock } from '../Pools/components/Tables/AllPools/AllPoolsTable.utils'

const SwapsPage = ({
  theme,
  publicKey,
  getPoolsInfoQuery,
  getDexTokensPricesQuery,
  getPoolsInfoQueryRefetch,
  getDexTokensPricesQueryRefetch,
}: {
  theme: Theme
  publicKey: string
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getPoolsInfoQueryRefetch: () => void
  getDexTokensPricesQueryRefetch: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const allMarketsMap = useAllMarketsList()

  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3)
  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])
  const [selectedBaseTokenAddressFromSeveral, setBaseTokenAddressFromSeveral] =
    useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')
  const [isTransactionSettingsPopupOpen, openTransactionSettingsPopup] =
    useState(false)

  const [refreshAllTokensDataCounter, setRefreshAllTokensDataCounter] =
    useState<number>(0)

  const refreshAllTokensData = () =>
    setRefreshAllTokensDataCounter(refreshAllTokensDataCounter + 1)

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>('')
  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>('')
  const [isWarningPopupOpen, openWarningPopup] = useState(true)

  // const selectedTokens = marketsData.find(
  //   (market) =>
  //     (market.tokenA === getTokenNameByMintAddress(baseTokenMintAddress) &&
  //       market.tokenB === getTokenNameByMintAddress(quoteTokenMintAddress)) ||
  //     market.tokenB === getTokenNameByMintAddress(baseTokenMintAddress) ||
  //       market.tokenB === getTokenNameByMintAddress(quoteTokenMintAddress)
  // )

  // const selectedTokens = getPoolsInfoQuery.getPoolsInfo.find(
  const selectedTokens = mock.find(
    (pool) =>
      (pool?.tokenA === baseTokenMintAddress ||
        pool?.tokenA === quoteTokenMintAddress) &&
      (pool?.tokenB === baseTokenMintAddress ||
        pool?.tokenB === quoteTokenMintAddress)
  )

  const { getDexTokensPrices = [] } = getDexTokensPricesQuery || {
    getDexTokensPrices: [],
  }
  const isBaseTokenA = selectedTokens?.tokenA === baseTokenMintAddress

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const setQuoteAmountWithBase = (quoteAmount: string | number) => {
    const baseAmount = isBaseTokenA
      ? stripDigitPlaces(
          +quoteAmount * (+poolAmountTokenA / +poolAmountTokenB),
          8
        )
      : stripDigitPlaces(
          +quoteAmount * (+poolAmountTokenB / +poolAmountTokenA),
          8
        )
    setBaseAmount(baseAmount)
    setQuoteAmount(quoteAmount)
  }

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)

  const setBaseAmountWithQuote = (baseAmount: string | number) => {
    const quoteAmount = isBaseTokenA
      ? stripDigitPlaces(
          +baseAmount * (+poolAmountTokenB / +poolAmountTokenA),
          8
        )
      : stripDigitPlaces(
          +baseAmount * (+poolAmountTokenA / +poolAmountTokenB),
          8
        )
    setBaseAmount(baseAmount)
    setQuoteAmount(quoteAmount)
  }

  const baseSymbol = baseTokenMintAddress
    ? getTokenNameByMintAddress(baseTokenMintAddress)
    : 'Select token'

  const quoteSymbol = quoteTokenMintAddress
    ? getTokenNameByMintAddress(quoteTokenMintAddress)
    : 'Select token'

  const isSwapBaseToQuote = selectedTokens?.tokenA === baseTokenMintAddress

  const [poolAmountTokenA, poolAmountTokenB] = [
    selectedTokens?.tvl.tokenA,
    selectedTokens?.tvl.tokenB,
  ]

  const {
    address: userBaseTokenAccount,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    baseTokenMintAddress,
    selectedBaseTokenAddressFromSeveral
  )

  const {
    address: userQuoteTokenAccount,
    decimals: quoteTokenDecimals,
    amount: maxQuoteAmount,
  } = getTokenDataByMint(
    allTokensData,
    quoteTokenMintAddress,
    selectedQuoteTokenAddressFromSeveral
  )

  useEffect(() => {
    const fetchData = async () => {
      const allTokensData = await getAllTokensData(wallet.publicKey, connection)

      await setAllTokensData(allTokensData)
    }

    if (wallet?.publicKey) {
      fetchData()
    }
  }, [wallet?.publicKey, refreshAllTokensDataCounter])

  const mints = allTokensData.map((tokenInfo: TokenInfo) => tokenInfo.mint)

  // const filteredMints = [...new Set(mints)]

  // const isNativeSOLSelected =
  //   allTokensData[0]?.address === userBaseTokenAccount ||
  //   allTokensData[0]?.address === userQuoteTokenAccount

  const reverseTokens = async () => {
    await setBaseTokenMintAddress(quoteTokenMintAddress)
    await setQuoteTokenMintAddress(baseTokenMintAddress)
    await setBaseAmount(quoteAmount)
    await setQuoteAmount(baseAmount)
  }

  const poolsAmountDiff = isSwapBaseToQuote
    ? +poolAmountTokenA / +baseAmount
    : +poolAmountTokenA / +quoteAmount

  // price impact due to curve
  const rawSlippage = 100 / (poolsAmountDiff + 1)

  const sumFeesPercentages =
    REBALANCE_CONFIG.SLIPPAGE + slippageTolerance + rawSlippage

  const totalWithFees = +quoteAmount - (+quoteAmount / 100) * sumFeesPercentages

  const isTokenABalanceInsufficient = baseAmount > +maxBaseAmount

  const InsufficientLiquidiy =
    baseSymbol !== 'Select token' &&
    quoteSymbol !== 'Select token' &&
    !selectedTokens

  const isButtonDisabled = isTokenABalanceInsufficient || !selectedTokens

  return (
    <RowContainer
      direction="column"
      height="100%"
      style={{
        background: theme.palette.grey.additional,
      }}
    >
      <>
        <BlockTemplate
          theme={theme}
          width="50rem"
          style={{ padding: '2rem', zIndex: '10' }}
        >
          <RowContainer margin="1rem 2rem" justify="space-between">
            <Text>
              Slippage Tolerance: <strong>{slippageTolerance}%</strong>
            </Text>
            <Row>
              <ReloadTimer
                marginRight="1.5rem"
                callback={async () => {
                  await getDexTokensPricesQueryRefetch()
                  await getPoolsInfoQueryRefetch()
                  await refreshAllTokensData()
                }}
              />
              {baseTokenMintAddress && quoteTokenMintAddress && (
                <TimerButton
                  onClick={() => openTokensAddressesPopup(true)}
                  marginRight="1.5rem"
                >
                  <SvgIcon src={Inform} width="50%" height="50%" />
                </TimerButton>
              )}
              <SvgIcon
                style={{ cursor: 'pointer' }}
                onClick={() => openTransactionSettingsPopup(true)}
                src={Gear}
                width="2.5rem"
                height="2.5rem"
              />
            </Row>
          </RowContainer>
          <RowContainer margin="2rem 0 1rem 0">
            <InputWithSelectorForSwaps
              wallet={wallet}
              publicKey={publicKey}
              placeholder="0.00"
              theme={theme}
              directionFrom
              value={baseAmount}
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
            />
          </RowContainer>
          <RowContainer justify="flex-start" margin="0 2rem">
            <SvgIcon
              style={{ cursor: 'pointer' }}
              src={Arrows}
              width="2.5rem"
              height="2.5rem"
              onClick={() => {
                reverseTokens()
              }}
            />
          </RowContainer>
          <RowContainer margin="1rem 0 2rem 0">
            <InputWithSelectorForSwaps
              wallet={wallet}
              publicKey={publicKey}
              placeholder="0.00"
              theme={theme}
              disabled={
                !baseTokenMintAddress ||
                !quoteTokenMintAddress ||
                (!baseTokenMintAddress && !quoteTokenMintAddress)
              }
              value={quoteAmount}
              onChange={setQuoteAmountWithBase}
              symbol={quoteSymbol}
              maxBalance={maxQuoteAmount}
              openSelectCoinPopup={() => {
                setIsBaseTokenSelecting(false)
                setIsSelectCoinPopupOpen(true)
              }}
            />
          </RowContainer>

          {selectedTokens && (
            <RowContainer margin="1rem 2rem" justify="space-between">
              <Text color="#93A0B2">Price:</Text>
              <Text
                fontSize="1.5rem"
                color="#A5E898"
                fontFamily="Avenir Next Demi"
              >
                1{' '}
                <Text fontSize="1.5rem" fontFamily="Avenir Next Demi">
                  {baseSymbol}{' '}
                </Text>
                ={' '}
                {isBaseTokenA
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
                margin="4rem 0 0 0"
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
                    : 'linear-gradient(90.62deg, #5EB6A8 0.11%, #3861C1 99.54%)'
                }
                textTransform="none"
                margin="1rem 0 0 0"
                transition="all .4s ease-out"
                disabled={isButtonDisabled}
                onClick={async () => {
                  if (!selectedTokens) return

                  console.log('baseTokenDecimals', {
                    baseTokenDecimals,
                    quoteTokenDecimals,
                  })

                  const swapAmountIn = +baseAmount * 10 ** baseTokenDecimals
                  const swapAmountOut =
                    +totalWithFees * 10 ** quoteTokenDecimals

                  // for cases with SOL token
                  const isBaseTokenSOL = baseSymbol === 'SOL'
                  const isQuoteTokenSOL = quoteSymbol === 'SOL'

                  const isPoolWithSOLToken = isBaseTokenSOL || isQuoteTokenSOL

                  const isNativeSOLSelected =
                    allTokensData[0]?.address === userBaseTokenAccount ||
                    allTokensData[0]?.address === userQuoteTokenAccount

                  try {
                    const result = await swap({
                      wallet,
                      connection,
                      poolPublicKey: new PublicKey(selectedTokens.swapToken),
                      userBaseTokenAccount: new PublicKey(
                        isSwapBaseToQuote
                          ? userBaseTokenAccount
                          : userQuoteTokenAccount
                      ),
                      userQuoteTokenAccount: new PublicKey(
                        isSwapBaseToQuote
                          ? userQuoteTokenAccount
                          : userBaseTokenAccount
                      ),
                      swapAmountIn,
                      swapAmountOut,
                      isSwapBaseToQuote,
                      transferSOLToWrapped:
                        isPoolWithSOLToken && isNativeSOLSelected,
                    })

                    await notify({
                      type: result ? 'success' : 'error',
                      message: result
                        ? 'Swap executed successfully.'
                        : 'Swap operation failed. Please, try to increase slippage tolerance.',
                    })
                  } catch (e) {
                    console.error('swap error:', e)
                    if (e.message.includes('cancelled')) {
                      await notify({
                        type: 'error',
                        message: 'Swap operation cancelled.',
                      })
                    }
                  }

                  await refreshAllTokensData()
                }}
              >
                {isTokenABalanceInsufficient
                  ? `Insufficient ${baseSymbol} Balance`
                  : InsufficientLiquidiy
                  ? 'Insufficient liquidiy'
                  : 'Swap'}
              </BtnCustom>
            )}
          </RowContainer>
        </BlockTemplate>
        {baseTokenMintAddress &&
          quoteTokenMintAddress &&
          baseAmount &&
          quoteAmount && (
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
                    color="#A5E898"
                  >
                    {totalWithFees.toFixed(5)}{' '}
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
                    color="#A5E898"
                  >
                    {stripDigitPlaces(rawSlippage, 2)}%
                  </Text>
                </Row>
              </RowContainer>{' '}
              <RowContainer margin="0.5rem 0" justify="space-between">
                <Text color="#93A0B2">Liquidity provider fee</Text>
                <Row style={{ flexWrap: 'nowrap' }}>
                  <Text
                    style={{ padding: '0 0.5rem 0 0.5rem' }}
                    fontFamily="Avenir Next Bold"
                  >
                    {REBALANCE_CONFIG.SLIPPAGE}%
                  </Text>
                </Row>
              </RowContainer>
            </Card>
          )}
      </>

      <TransactionSettingsPopup
        theme={theme}
        open={isTransactionSettingsPopupOpen}
        close={() => openTransactionSettingsPopup(false)}
        setSlippageTolerance={setSlippageTolerance}
      />

      <SelectCoinPopup
        poolsInfo={mock}
        theme={theme}
        // mints={swapTokens}
        mints={[...new Set(mints)]}
        baseTokenMintAddress={baseTokenMintAddress}
        quoteTokenMintAddress={quoteTokenMintAddress}
        allTokensData={allTokensData}
        open={isSelectCoinPopupOpen}
        poolsPrices={getDexTokensPrices}
        isBaseTokenSelecting={isBaseTokenSelecting}
        setBaseTokenAddressFromSeveral={setBaseTokenAddressFromSeveral}
        setQuoteTokenAddressFromSeveral={setQuoteTokenAddressFromSeveral}
        selectTokenMintAddress={(address: string) => {
          const select = isBaseTokenSelecting
            ? () => {
                if (quoteTokenMintAddress === address) {
                  setQuoteTokenMintAddress('')
                }
                setBaseTokenMintAddress(address)
                setIsSelectCoinPopupOpen(false)
              }
            : () => {
                if (baseTokenMintAddress === address) {
                  setBaseTokenMintAddress('')
                }
                setQuoteTokenMintAddress(address)
                setIsSelectCoinPopupOpen(false)
              }

          select()
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

      {/* <WarningPopup
        theme={theme}
        open={isWarningPopupOpen}
        onClose={() => openWarningPopup(false)}
        isSwapPage={true}
      /> */}
    </RowContainer>
  )
}

export default compose(
  withTheme(),
  withPublicKey,
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
)(SwapsPage)
