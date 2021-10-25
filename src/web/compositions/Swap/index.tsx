import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { Theme } from '@material-ui/core'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import {
  ReloadTimer,
  TimerButton,
} from '@sb/compositions/Rebalance/components/ReloadTimer'
import { InputWithSelectorForSwaps } from './components/Inputs/index'
import { Card } from './styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { SelectCoinPopup } from './components/SelectCoinPopup'
import { notify } from '@sb/dexUtils/notifications'

import { TransactionSettingsPopup } from './components/TransactionSettingsPopup'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
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
  getTokenMintAddressByName,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { getTokenDataByMint } from '../Pools/utils'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { REBALANCE_CONFIG } from '../Rebalance/Rebalance.config'
import { PublicKey } from '@solana/web3.js'
import { WarningPopup } from '../Chart/components/WarningPopup'
import { swap } from '@sb/dexUtils/pools/swap'
import { usePoolBalances } from '@sb/dexUtils/pools/usePoolBalances'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { SLIPPAGE_PERCENTAGE } from './config'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

const DEFAULT_BASE_TOKEN = 'RIN'
const DEFAULT_QUOTE_TOKEN = 'SOL'

const SwapPage = ({
  theme,
  publicKey,
  getPoolsInfoQuery,
  getDexTokensPricesQuery,
  getDexTokensPricesQueryRefetch,
}: {
  theme: Theme
  publicKey: string
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getDexTokensPricesQueryRefetch: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts({
    wallet,
    connection,
  })

  const urlParams = new URLSearchParams(window.location.search)
  const baseFromPoolsRedirect = urlParams.get('base')
  const quoteFromPoolsRedirect = urlParams.get('quote')

  const defaultBaseTokenMint = baseFromPoolsRedirect
    ? getTokenMintAddressByName(baseFromPoolsRedirect) || ''
    : getTokenMintAddressByName(DEFAULT_BASE_TOKEN) || ''

  const defaultQuoteTokenMint = quoteFromPoolsRedirect
    ? getTokenMintAddressByName(quoteFromPoolsRedirect) || ''
    : getTokenMintAddressByName(DEFAULT_QUOTE_TOKEN) || ''

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>(
    defaultBaseTokenMint
  )

  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>(
    defaultQuoteTokenMint
  )

  const selectedPool = getPoolsInfoQuery.getPoolsInfo.find(
    (pool) =>
      (pool?.tokenA === baseTokenMintAddress ||
        pool?.tokenA === quoteTokenMintAddress) &&
      (pool?.tokenB === baseTokenMintAddress ||
        pool?.tokenB === quoteTokenMintAddress)
  )

  const [poolBalances, refreshPoolBalances] = usePoolBalances({
    connection,
    pool: {
      poolTokenAccountA: selectedPool?.poolTokenAccountA,
      poolTokenAccountB: selectedPool?.poolTokenAccountB,
    },
  })

  // update entered value on every pool ratio change
  useEffect(() => {
    if (!selectedPool) return

    const isSwapBaseToQuote = selectedPool?.tokenA === baseTokenMintAddress
    const newRatio = isSwapBaseToQuote
      ? poolAmountTokenB / poolAmountTokenA
      : poolAmountTokenA / poolAmountTokenB

    const newQuote = stripDigitPlaces(+baseAmount * newRatio, 8)

    if (baseAmount && newQuote) {
      setQuoteAmount(newQuote)
    }
  }, [poolBalances.baseTokenAmount, poolBalances.quoteTokenAmount])

  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3)
  const [isTokensAddressesPopupOpen, openTokensAddressesPopup] = useState(false)
  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isWarningPopupOpen, openWarningPopup] = useState(true)

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

  const { getDexTokensPrices = [] } = getDexTokensPricesQuery || {
    getDexTokensPrices: [],
  }
  const isBaseTokenA = selectedPool?.tokenA === baseTokenMintAddress

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
    : 'RIN'

  const quoteSymbol = quoteTokenMintAddress
    ? getTokenNameByMintAddress(quoteTokenMintAddress)
    : 'SOL'

  const isSwapBaseToQuote = selectedPool?.tokenA === baseTokenMintAddress

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

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

  const mints = allTokensData.map((tokenInfo: TokenInfo) => tokenInfo.mint)

  // const filteredMints = [...new Set(mints)]

  // const isNativeSOLSelected =
  //   allTokensData[0]?.address === userBaseTokenAccount ||
  //   allTokensData[0]?.address === userQuoteTokenAccount

  const reverseTokens = () => {
    setBaseTokenMintAddress(quoteTokenMintAddress)
    setQuoteTokenMintAddress(baseTokenMintAddress)
    setBaseAmount(quoteAmount)
    setQuoteAmount(baseAmount)
  }

  const poolsAmountDiff = isSwapBaseToQuote
    ? +poolAmountTokenA / +baseAmount
    : +poolAmountTokenA / +quoteAmount

  // price impact due to curve
  const rawSlippage = 100 / (poolsAmountDiff + 1)
  const sumFeesPercentages = slippageTolerance + rawSlippage
  const totalWithFees = +quoteAmount - (+quoteAmount / 100) * sumFeesPercentages

  const isTokenABalanceInsufficient = baseAmount > +maxBaseAmount

  const InsufficientLiquidiy =
    baseSymbol !== 'Select token' &&
    quoteSymbol !== 'Select token' &&
    !selectedPool

  const isButtonDisabled =
    isTokenABalanceInsufficient || !selectedPool || !selectedPool.supply

  return (
    <RowContainer
      direction={'column'}
      height={'100%'}
      style={{
        background: theme.palette.grey.additional,
      }}
    >
      <>
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
                margin={'0 1.5rem 0 0'}
                callback={async () => {
                  getDexTokensPricesQueryRefetch()
                  refreshPoolBalances()
                  refreshAllTokensData()
                }}
              />
              {baseTokenMintAddress && quoteTokenMintAddress && (
                <TimerButton
                  onClick={() => openTokensAddressesPopup(true)}
                  margin={'0 1.5rem 0 0'}
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
              wallet={wallet}
              publicKey={publicKey}
              placeholder={'0.00'}
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
              wallet={wallet}
              publicKey={publicKey}
              placeholder={'0.00'}
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

          {selectedPool && (
            <RowContainer margin={'1rem 2rem'} justify={'space-between'}>
              <Text color={'#93A0B2'}>Price:</Text>
              <Text
                fontSize={'1.5rem'}
                color={'#53DF11'}
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
              <BtnCustom
                btnWidth="100%"
                height="5.5rem"
                fontSize="1.4rem"
                padding="1rem 2rem"
                borderRadius=".8rem"
                borderColor={'none'}
                btnColor={'#fff'}
                backgroundColor={
                  isButtonDisabled
                    ? '#3A475C'
                    : 'linear-gradient(91.8deg, #651CE4 15.31%, #D44C32 89.64%)'
                }
                textTransform={'none'}
                margin={'1rem 0 0 0'}
                transition={'all .4s ease-out'}
                disabled={isButtonDisabled}
                onClick={async () => {
                  if (!selectedPool) return

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

                  const result = await swap({
                    wallet,
                    connection,
                    poolPublicKey: new PublicKey(selectedPool.swapToken),
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

                  notify({
                    type: result ? 'success' : 'error',
                    message:
                      result === 'success'
                        ? 'Swap executed successfully.'
                        : result === 'failed'
                        ? 'Swap operation failed. Please, try to increase slippage tolerance or try a bit later.'
                        : 'Swap cancelled',
                  })

                  refreshPoolBalances()
                  refreshAllTokensData()
                }}
              >
                {isTokenABalanceInsufficient
                  ? `Insufficient ${
                      isTokenABalanceInsufficient ? baseSymbol : quoteSymbol
                    } Balance`
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
              width={'45rem'}
              height={'12rem'}
            >
              <RowContainer margin={'0.5rem 0'} justify={'space-between'}>
                <Text color={'#93A0B2'}>Minimum received</Text>
                <Row style={{ flexWrap: 'nowrap' }}>
                  <Text
                    style={{ padding: '0 0.5rem 0 0.5rem' }}
                    fontFamily={'Avenir Next Bold'}
                    color={'#53DF11'}
                  >
                    {totalWithFees.toFixed(5)}{' '}
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
                    color={'#53DF11'}
                  >
                    {stripDigitPlaces(rawSlippage, 2)}%
                  </Text>
                </Row>
              </RowContainer>{' '}
              <RowContainer margin={'0.5rem 0'} justify={'space-between'}>
                <Text color={'#93A0B2'}>Liquidity provider fee</Text>
                <Row style={{ flexWrap: 'nowrap' }}>
                  <Text
                    style={{ padding: '0 0.5rem 0 0.5rem' }}
                    fontFamily={'Avenir Next Bold'}
                  >
                    {stripByAmountAndFormat(
                      +baseAmount * (SLIPPAGE_PERCENTAGE / 100)
                    )}{' '}
                    {baseSymbol}
                  </Text>
                </Row>
              </RowContainer>
            </Card>
          )}
      </>

      <TransactionSettingsPopup
        theme={theme}
        slippageTolerance={slippageTolerance}
        open={isTransactionSettingsPopupOpen}
        close={() => openTransactionSettingsPopup(false)}
        setSlippageTolerance={setSlippageTolerance}
      />

      <SelectCoinPopup
        poolsInfo={getPoolsInfoQuery.getPoolsInfo}
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
)(SwapPage)
