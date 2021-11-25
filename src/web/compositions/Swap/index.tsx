import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import SvgIcon from '@sb/components/SvgIcon'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { withRegionCheck } from '@core/hoc/withRegionCheck'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
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
import withTheme from '@material-ui/core/styles/withTheme'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import {
  getTokenMintAddressByName,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { getTokenDataByMint } from '../Pools/utils'
import { TokenAddressesPopup } from './components/TokenAddressesPopup'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { PublicKey } from '@solana/web3.js'
import { swap } from '@sb/dexUtils/pools/actions/swap'
import { usePoolBalances } from '@sb/dexUtils/pools/hooks/usePoolBalances'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { SLIPPAGE_PERCENTAGE } from './config'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import {
  costOfAddingToken,
  TRANSACTION_COMMON_SOL_FEE,
} from '@sb/components/TraidingTerminal/utils'
import { getMinimumReceivedAmountFromSwap } from '@sb/dexUtils/pools/swap/getMinimumReceivedAmountFromSwap'

import ScalesIcon from '@icons/scales.svg'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

const DEFAULT_BASE_TOKEN = 'SOL'
const DEFAULT_QUOTE_TOKEN = 'RIN'

const SwapPage = ({
  theme,
  publicKey,
  getPoolsInfoQuery,
}: {
  theme: Theme
  publicKey: string
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts()

  const nativeSOLTokenData = allTokensData[0]

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
    // pool?.curveType === 1 // TODO: remove
  )

  const isStablePool = selectedPool?.curveType === 1

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

  const isSwapBaseToQuote = selectedPool?.tokenA === baseTokenMintAddress

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const setQuoteAmountWithBase = (newQuoteAmount: string | number) => {
    const poolsAmountDiff = isSwapBaseToQuote
      ? +poolAmountTokenB / +newQuoteAmount
      : +poolAmountTokenA / +newQuoteAmount

    const priceImpact = 100 / (poolsAmountDiff + 1)
    const newBaseAmount = isSwapBaseToQuote
      ? +newQuoteAmount * (+poolAmountTokenA / +poolAmountTokenB)
      : +newQuoteAmount * (+poolAmountTokenB / +poolAmountTokenA)

    const newBaseAmountWithPriceImpact =
      newBaseAmount - (newBaseAmount / 100) * priceImpact
    const strippedBaseAmount = stripDigitPlaces(newBaseAmountWithPriceImpact, 8)

    setBaseAmount(strippedBaseAmount)
    setQuoteAmount(newQuoteAmount)
  }

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)

  const setBaseAmountWithQuote = (newBaseAmount: string | number) => {
    const poolsAmountDiff = isSwapBaseToQuote
      ? +poolAmountTokenA / +newBaseAmount
      : +poolAmountTokenB / +newBaseAmount

    const priceImpact = 100 / (poolsAmountDiff + 1)
    const newQuoteAmount = isSwapBaseToQuote
      ? +newBaseAmount * (+poolAmountTokenB / +poolAmountTokenA)
      : +newBaseAmount * (+poolAmountTokenA / +poolAmountTokenB)

    const newQuoteAmountWithPriceImpact =
      newQuoteAmount - (newQuoteAmount / 100) * priceImpact
    const strippedQuoteAmount = stripDigitPlaces(
      newQuoteAmountWithPriceImpact,
      8
    )

    setBaseAmount(newBaseAmount)
    setQuoteAmount(strippedQuoteAmount)
  }

  const baseSymbol = baseTokenMintAddress
    ? getTokenNameByMintAddress(baseTokenMintAddress)
    : DEFAULT_BASE_TOKEN

  const quoteSymbol = quoteTokenMintAddress
    ? getTokenNameByMintAddress(quoteTokenMintAddress)
    : DEFAULT_QUOTE_TOKEN

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

  let {
    address: userBaseTokenAccount,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(
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

  const {
    address: userQuoteTokenAccount,
    decimals: quoteTokenDecimals,
    amount: maxQuoteAmount,
  } = getTokenDataByMint(
    allTokensData,
    quoteTokenMintAddress,
    selectedQuoteTokenAddressFromSeveral
  )

  const reverseTokens = () => {
    setBaseTokenMintAddress(quoteTokenMintAddress)
    setQuoteTokenMintAddress(baseTokenMintAddress)

    setBaseTokenAddressFromSeveral(selectedQuoteTokenAddressFromSeveral)
    setQuoteTokenAddressFromSeveral(selectedBaseTokenAddressFromSeveral)

    setBaseAmount(quoteAmount)
    setQuoteAmount(baseAmount)
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
    quoteAmount == 0

  // for cases with SOL token
  const isBaseTokenSOL = baseSymbol === 'SOL'
  const isQuoteTokenSOL = quoteSymbol === 'SOL'

  const isPoolWithSOLToken = isBaseTokenSOL || isQuoteTokenSOL

  const isNativeSOLSelected =
    nativeSOLTokenData?.address === userBaseTokenAccount ||
    nativeSOLTokenData?.address === userQuoteTokenAccount

  const userPoolBaseTokenAccount = isSwapBaseToQuote
    ? userBaseTokenAccount
    : userQuoteTokenAccount

  const userPoolQuoteTokenAccount = isSwapBaseToQuote
    ? userQuoteTokenAccount
    : userBaseTokenAccount

  useEffect(() => {
    if (wallet.publicKey && selectedPool) {
      const minimumReceivedAmountFromSwap = getMinimumReceivedAmountFromSwap({
        wallet,
        connection,
        pool: selectedPool,
        isSwapBaseToQuote,
        swapAmountIn: +baseAmount,
        allTokensData,
        userBaseTokenAccount: userPoolBaseTokenAccount
          ? new PublicKey(userPoolBaseTokenAccount)
          : null,
        userQuoteTokenAccount: userPoolQuoteTokenAccount
          ? new PublicKey(userPoolQuoteTokenAccount)
          : null,
        transferSOLToWrapped: isPoolWithSOLToken && isNativeSOLSelected,
      })
    }
  }, [wallet.publicKey, allTokensData, baseAmount])

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
          <RowContainer justify={'space-between'} margin={'0 2rem'}>
            <SvgIcon
              style={{ cursor: 'pointer' }}
              src={Arrows}
              width={'2rem'}
              height={'2rem'}
              onClick={() => {
                reverseTokens()
              }}
            />
            {isStablePool ? (
              <DarkTooltip
                title={
                  'This pool uses the stable curve, which provides better rates for swapping stablecoins.'
                }
              >
                <div>
                  <SvgIcon src={ScalesIcon} width={'2rem'} height={'2rem'} />
                </div>
              </DarkTooltip>
            ) : null}
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
                {isSwapBaseToQuote
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

                  const result = await swap({
                    wallet,
                    connection,
                    poolPublicKey: new PublicKey(selectedPool.swapToken),
                    userBaseTokenAccount: userPoolBaseTokenAccount
                      ? new PublicKey(userPoolBaseTokenAccount)
                      : null,
                    userQuoteTokenAccount: userPoolQuoteTokenAccount
                      ? new PublicKey(userPoolQuoteTokenAccount)
                      : null,
                    swapAmountIn,
                    swapAmountOut,
                    isSwapBaseToQuote,
                    transferSOLToWrapped:
                      isPoolWithSOLToken && isNativeSOLSelected,
                    curveType: selectedPool.curveType,
                  })

                  notify({
                    type: result === 'success' ? 'success' : 'error',
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
                  : !selectedPool
                  ? 'No pools available'
                  : needEnterAmount
                  ? 'Enter amount'
                  : 'Swap'}
              </BtnCustom>
            )}
          </RowContainer>
        </BlockTemplate>
        {selectedPool && baseAmount && quoteAmount && (
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
        <RowContainer>f</RowContainer>
      </>

      <TransactionSettingsPopup
        theme={theme}
        slippageTolerance={slippageTolerance}
        open={isTransactionSettingsPopupOpen}
        close={() => {
          if (slippageTolerance >= 0.01) {
            openTransactionSettingsPopup(false)
          }
        }}
        setSlippageTolerance={setSlippageTolerance}
      />

      <SelectCoinPopup
        poolsInfo={getPoolsInfoQuery.getPoolsInfo}
        theme={theme}
        // mints={[...new Set(mints)]}
        mints={[
          ...new Set(
            getPoolsInfoQuery.getPoolsInfo
              .map((i) => [i.tokenA, i.tokenB])
              .flat()
          ),
        ]}
        baseTokenMintAddress={baseTokenMintAddress}
        quoteTokenMintAddress={quoteTokenMintAddress}
        allTokensData={allTokensData}
        open={isSelectCoinPopupOpen}
        isBaseTokenSelecting={isBaseTokenSelecting}
        setBaseTokenAddressFromSeveral={setBaseTokenAddressFromSeveral}
        setQuoteTokenAddressFromSeveral={setQuoteTokenAddressFromSeveral}
        selectTokenMintAddress={(address: string) => {
          const select = isBaseTokenSelecting
            ? () => {
                if (quoteTokenMintAddress === address) {
                  setQuoteTokenMintAddress('')
                }

                if (selectedBaseTokenAddressFromSeveral) {
                  setBaseTokenAddressFromSeveral('')
                }

                setBaseTokenMintAddress(address)
                setIsSelectCoinPopupOpen(false)
              }
            : () => {
                if (baseTokenMintAddress === address) {
                  setBaseTokenMintAddress('')
                }

                if (selectedQuoteTokenAddressFromSeveral) {
                  setQuoteTokenAddressFromSeveral('')
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
  withRegionCheck,
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
  })
)(SwapPage)
