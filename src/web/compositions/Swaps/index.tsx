import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import { PoolInfo, PoolsPrices } from '@sb/compositions/Pools/index.types'
import { Theme } from '@material-ui/core'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { ReloadTimer, TimerButton } from '../Rebalance/components/ReloadTimer'
import { InputWithSelectorForSwaps } from './components/Inputs/index'
import { Card } from './styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { SelectCoinPopup } from '../Pools/components/Popups/SelectCoin'

import { TransactionSettingsPopup } from './components/TransactionSettingsPopup'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { getAllTokensData } from '../Rebalance/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import Inform from '@icons/inform.svg'
import Gear from '@icons/gear.svg'
import Arrows from '@icons/switchArrows.svg'
import { TokenInfo } from '../Rebalance/Rebalance.types'
import { useConnection } from '@sb/dexUtils/connection'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import withTheme from '@material-ui/core/styles/withTheme'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import {
  ALL_TOKENS_MINTS,
  ALL_TOKENS_MINTS_MAP,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { getTokenDataByMint } from '../Pools/utils'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { REBALANCE_CONFIG } from '../Rebalance/Rebalance.config'
import { filterDataBySymbolForDifferentDeviders } from '../Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import Pools from '../Pools/components/Tables/Pools'

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
  getDexTokensPricesQuery: { getDexTokensPrices: PoolsPrices[] }
  getPoolsInfoQueryRefetch: () => void
  getDexTokensPricesQueryRefetch: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3)
  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])
  const [
    selectedBaseTokenAddressFromSeveral,
    setBaseTokenAddressFromSeveral,
  ] = useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')
  const [
    isTransactionSettingsPopupOpen,
    openTransactionSettingsPopup,
  ] = useState(false)

  const [
    refreshAllTokensDataCounter,
    setRefreshAllTokensDataCounter,
  ] = useState<number>(0)

  const [selectedPool, selectPool] = useState<PoolInfo | null>(null)

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>('')
  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>('')

  const selectedTokens = getPoolsInfoQuery.getPoolsInfo.find(
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

  const baseTokenPrice =
    getDexTokensPrices.find(
      (tokenInfo) =>
        tokenInfo.symbol === baseTokenMintAddress ||
        tokenInfo.symbol === baseSymbol
    )?.price || 10

  const quoteTokenPrice =
    getDexTokensPrices.find(
      (tokenInfo) =>
        tokenInfo.symbol === quoteTokenMintAddress ||
        tokenInfo.symbol === quoteSymbol
    )?.price || 10

  const swapTokens = ALL_TOKENS_MINTS.map((el) => el.address.toString())

  const baseTokenSwap =
    selectedTokens?.tokenA === baseTokenMintAddress ? 'tokenA' : 'tokenB'

  const [poolAmountTokenA, poolAmountTokenB] = [
    selectedTokens?.tvl.tokenA,
    selectedTokens?.tvl.tokenB,
  ]

  const {
    address: userTokenAccountA,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    baseTokenMintAddress,
    selectedBaseTokenAddressFromSeveral
  )

  const {
    address: userTokenAccountB,
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

    if (!!wallet?.publicKey) {
      fetchData()
    }
  }, [wallet?.publicKey, refreshAllTokensDataCounter])

  const mints = allTokensData.map((tokenInfo: TokenInfo) => tokenInfo.mint)

  // const filteredMints = [...new Set(mints)]

  // const isNativeSOLSelected =
  //   allTokensData[0]?.address === userTokenAccountA ||
  //   allTokensData[0]?.address === userTokenAccountB

  const reverseTokens = async () => {
    await setBaseTokenMintAddress(quoteTokenMintAddress)
    await setQuoteTokenMintAddress(baseTokenMintAddress)
    await setBaseAmount(quoteAmount)
    await setQuoteAmount(baseAmount)
  }

  const poolsAmountDiff =
    baseTokenSwap === 'tokenA'
      ? +poolAmountTokenA / +baseAmount
      : +poolAmountTokenA / +quoteAmount

  // price impact due to curve
  const rawSlippage = 100 / (poolsAmountDiff + 1)

  const sumFeesPercentages =
    REBALANCE_CONFIG.POOL_FEE + slippageTolerance + rawSlippage

  const totalWithFees = +quoteAmount - (+quoteAmount / 100) * sumFeesPercentages

  // const InsufficientBalance
  // console.log('poolAmountTokenA', poolAmountTokenA)
  return (
    <RowContainer direction={'column'} height={'100%'}>
      {!publicKey ? (
        <BtnCustom
          theme={theme}
          onClick={wallet.connect}
          needMinWidth={false}
          btnWidth="auto"
          height="auto"
          fontSize="1.4rem"
          padding="2rem 8rem"
          borderRadius="1.1rem"
          borderColor={theme.palette.blue.serum}
          btnColor={'#fff'}
          backgroundColor={theme.palette.blue.serum}
          textTransform={'none'}
          margin={'4rem 0 0 0'}
          transition={'all .4s ease-out'}
          style={{ whiteSpace: 'nowrap' }}
        >
          Connect wallet
        </BtnCustom>
      ) : (
        <>
          {' '}
          <BlockTemplate
            theme={theme}
            width={'50rem'}
            style={{ padding: '2rem', zIndex: '10' }}
          >
            <RowContainer margin={'1rem 2rem'} justify={'space-between'}>
              <Text>
                Slippage Tolerance: <strong>{slippageTolerance}%</strong>
              </Text>
              <Row>
                <ReloadTimer
                  marginRight={'1.5rem'}
                  callback={async () => {
                    await getDexTokensPricesQueryRefetch()
                    await getPoolsInfoQueryRefetch()
                  }}
                />
                {baseTokenMintAddress && quoteTokenMintAddress && (
                  <TimerButton
                    onClick={() => openTokensAddressesPopup(true)}
                    marginRight={'1.5rem'}
                  >
                    <SvgIcon src={Inform} width={'50%'} height={'50%'} />
                  </TimerButton>
                )}
                <SvgIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => openTransactionSettingsPopup(true)}
                  src={Gear}
                  width={'2.5rem'}
                  height={'2.5rem'}
                />
              </Row>
            </RowContainer>
            <RowContainer margin={'2rem 0 1rem 0'}>
              <InputWithSelectorForSwaps
                theme={theme}
                directionFrom={true}
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
            <RowContainer justify={'flex-start'} margin={'0 2rem'}>
              <SvgIcon
                style={{ cursor: 'pointer' }}
                src={Arrows}
                width={'2.5rem'}
                height={'2.5rem'}
                onClick={() => {
                  reverseTokens()
                }}
              />
            </RowContainer>
            <RowContainer margin={'1rem 0 2rem 0'}>
              <InputWithSelectorForSwaps
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

            {baseTokenMintAddress && quoteTokenMintAddress && (
              <RowContainer margin={'1rem 2rem'} justify={'space-between'}>
                <Text color={'#93A0B2'}>Price:</Text>
                <Text
                  fontSize={'1.5rem'}
                  color={'#A5E898'}
                  fontFamily={'Avenir Next Demi'}
                >
                  1{' '}
                  <Text fontSize={'1.5rem'} fontFamily={'Avenir Next Demi'}>
                    {baseSymbol}{' '}
                  </Text>
                  ={' '}
                  {isBaseTokenA
                    ? stripDigitPlaces(+poolAmountTokenB / +poolAmountTokenA, 8)
                    : stripDigitPlaces(
                        +(+poolAmountTokenA / +poolAmountTokenB),
                        8
                      )}{' '}
                  <Text fontSize={'1.5rem'} fontFamily={'Avenir Next Demi'}>
                    {quoteSymbol}{' '}
                  </Text>
                </Text>
              </RowContainer>
            )}

            <RowContainer>
              <BtnCustom
                btnWidth="100%"
                height="5.5rem"
                fontSize="1.4rem"
                padding="1rem 2rem"
                borderRadius=".8rem"
                borderColor={'none'}
                btnColor={'#fff'}
                backgroundColor={
                  'linear-gradient(90.62deg, #5EB6A8 0.11%, #3861C1 99.54%)'
                }
                textTransform={'none'}
                margin={'1rem 0 0 0'}
                transition={'all .4s ease-out'}
                disabled={}
                onClick={() => {
                  // swap func here
                }}
              >
                Swap
              </BtnCustom>
            </RowContainer>
          </BlockTemplate>
          {baseTokenMintAddress && quoteTokenMintAddress && (
            <Card
              style={{ padding: '2rem' }}
              theme={theme}
              width={'45rem'}
              height={'12rem'}
            >
              {baseAmount && quoteAmount ? (
                <>
                  <RowContainer margin={'0.5rem 0'} justify={'space-between'}>
                    <Text color={'#93A0B2'}>Minimum received</Text>
                    <Row style={{ flexWrap: 'nowrap' }}>
                      <Text
                        style={{ padding: '0 0.5rem 0 0.5rem' }}
                        fontFamily={'Avenir Next Bold'}
                        color={'#A5E898'}
                      >
                        {totalWithFees.toFixed(2)}{' '}
                      </Text>
                      <Text fontFamily={'Avenir Next Bold'}>{quoteSymbol}</Text>
                    </Row>
                  </RowContainer>
                  <RowContainer margin={'0.5rem 0'} justify={'space-between'}>
                    <Text color={'#93A0B2'}>Price Impact</Text>
                    <Row style={{ flexWrap: 'nowrap' }}>
                      <Text
                        style={{ padding: '0 0.5rem 0 0.5rem' }}
                        fontFamily={'Avenir Next Bold'}
                        color={'#A5E898'}
                      >
                        {stripDigitPlaces(rawSlippage, 2)}%
                      </Text>
                    </Row>
                  </RowContainer>{' '}
                </>
              ) : null}
              <RowContainer margin={'0.5rem 0'} justify={'space-between'}>
                <Text color={'#93A0B2'}>Liquidity provider fee</Text>
                <Row style={{ flexWrap: 'nowrap' }}>
                  <Text
                    style={{ padding: '0 0.5rem 0 0.5rem' }}
                    fontFamily={'Avenir Next Bold'}
                  >
                    {REBALANCE_CONFIG.POOL_FEE}%
                  </Text>
                </Row>
              </RowContainer>
            </Card>
          )}
        </>
      )}

      <TransactionSettingsPopup
        theme={theme}
        open={isTransactionSettingsPopupOpen}
        close={() => openTransactionSettingsPopup(false)}
        setSlippageTolerance={setSlippageTolerance}
      />
      <SelectCoinPopup
        theme={theme}
        // mints={swapTokens}
        mints={allTokensData.map((el) => el.mint)} //
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
