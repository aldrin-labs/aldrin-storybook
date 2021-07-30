import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core/styles'
import { Connection } from '@solana/web3.js'
import debounceRender from 'react-debounce-render'

import { withPublicKey } from '@core/hoc/withPublicKey'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  getPricesForTokens,
  getTokenValuesForTokens,
  getSortedTokensByValue,
  getTotalTokenValue,
  getPercentageAllocationForTokens,
  getAvailableTokensForRebalance,
  getTokensMap,
  getAllTokensData,
  getSliderStepForTokens,
  getMarketsData,
} from './utils'
import { useConnection } from '@sb/dexUtils/connection'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import {
  PoolInfo,
  TokensMapType,
  Colors,
  RebalancePopupStep,
  TokenInfo,
  MarketData,
} from './Rebalance.types'
import RebalanceTable from './components/Tables'
import RebalanceHeaderComponent from './components/Header'
import DonutChartWithLegend from '@sb/components/AllocationBlock/index'
import BalanceDistributedComponent from './components/BalanceDistributed'
import { RebalancePopup } from './components/RebalancePopup/RebalancePopup'

import { getPoolsInfoMockData } from './Rebalance.mock'

import {
  generateLegendColors,
  generateChartColors,
} from './utils/colorGenerating'
import { useCallback } from 'react'
import { processAllTokensData } from './utils/processAllTokensData'
import { useAllMarketsList } from '@sb/dexUtils/markets'
import { filterDuplicateTokensByAmount } from './utils/filterDuplicateTokensByAmount'

// const MemoizedCurrentValueChartWithLegend = React.memo(
//   DonutChartWithLegend,
//   (prevProps, nextProps) => {
//     return (
//       isEqual(
//         Object.values(prevProps.data)?.map((el) => el.percentage),
//         Object.values(nextProps.data)?.map((el) => el.percentage)
//       ) &&
//       isEqual(prevProps.colors, nextProps.colors) &&
//       isEqual(prevProps.colorsForLegend, nextProps.colorsForLegend)
//     )
//   }
// )

// const MemoizedTargetValueChartWithLegend = React.memo(
//   DonutChartWithLegend,
//   (prevProps, nextProps) => {
//     return (
//       isEqual(
//         Object.values(prevProps.data)?.map((el) => el.targetPercentage),
//         Object.values(nextProps.data)?.map((el) => el.targetPercentage)
//       ) &&
//       isEqual(prevProps.colors, nextProps.colors) &&
//       isEqual(prevProps.colorsForLegend, nextProps.colorsForLegend)
//     )
//   }
// )

const MemoizedRebalancePopup = React.memo(
  RebalancePopup,
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.rebalanceStep === nextProps.rebalanceStep &&
      prevProps.softRefresh === nextProps.softRefresh
    )
  }
)

const DebouncedMemoizedCurrentValueChartWithLegend = debounceRender(
  DonutChartWithLegend,
  100,
  { leading: false }
)

const DebouncedMemoizedTargetValueChartWithLegend = debounceRender(
  DonutChartWithLegend,
  100,
  { leading: false }
)

const DebouncedMemoizedRebalanceHeaderComponent = debounceRender(
  RebalanceHeaderComponent,
  100,
  { leading: false }
)

const DebouncedBalanceDistributedComponent = debounceRender(
  BalanceDistributedComponent,
  100,
  { leading: false }
)

const RebalanceComposition = ({
  publicKey,
  theme,
}: {
  publicKey: string
  theme: Theme
}) => {
  const { wallet } = useWallet()
  const connection: Connection = useConnection()
  const allMarketsMap = useAllMarketsList()

  const [isRebalancePopupOpen, changeRebalancePopupState] = useState(false)
  const [rebalanceStep, changeRebalanceStep] = useState<RebalancePopupStep>(
    'initial'
  )

  const isWalletConnected = !!wallet?.publicKey

  const [tokensMap, setTokensMap] = useState<TokensMapType>({})
  const [totalTokensValue, setTotalTokensValue] = useState(0)
  const [leftToDistributeValue, setLeftToDistributeValue] = useState(0)
  const [rebalanceState, setRefreshStateRebalance] = useState(false)
  const [loadingRebalanceData, setLoadingRebalanceData] = useState(false)

  const [marketsData, setMarketsData] = useState<MarketData[]>([])

  const [colors, setColors] = useState<Colors>({})
  const [colorsForLegend, setColorsForLegend] = useState<Colors>({})

  const refreshRebalance = () => {
    setRefreshStateRebalance(!rebalanceState)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoadingRebalanceData(true)
      try {
        console.time('rebalance initial data set time')
        const allTokensData = await getAllTokensData(
          wallet.publicKey,
          connection
        )

        const filteredAllTokensData = filterDuplicateTokensByAmount(
          allTokensData
        )

        // console.log('filteredAllTokensData', filteredAllTokensData)
        const tokensWithPrices = await getPricesForTokens(filteredAllTokensData)
        // console.log('tokensWithPrices', tokensWithPrices)
        const tokensWithTokenValue = getTokenValuesForTokens(tokensWithPrices)
        // console.log('tokensWithTokenValue', tokensWithTokenValue)
        const totalTokenValue = getTotalTokenValue(tokensWithTokenValue)

        const marketsData = await getMarketsData(allMarketsMap)

        const availableTokensForRebalanceMap = processAllTokensData({
          marketsData,
          tokensWithPrices,
        })

        const chartColors = generateChartColors({
          data: availableTokensForRebalanceMap,
        })
        const legendColors = generateLegendColors({
          data: availableTokensForRebalanceMap,
        })

        setTokensMap(availableTokensForRebalanceMap)
        setColors(chartColors)
        setColorsForLegend(legendColors)
        setTotalTokensValue(totalTokenValue)
        setMarketsData(marketsData)
        console.timeEnd('rebalance initial data set time')
      } catch (e) {
        // set error
        console.log('e: ', e)
      }
      setLoadingRebalanceData(false)
    }

    console.log('isWalletConnected', isWalletConnected)
    if (isWalletConnected) {
      fetchData()
    }
  }, [wallet.publicKey, rebalanceState])

  const softRefresh = useCallback(
    async ({
      tokensMap,
      marketsData,
    }: {
      tokensMap: TokensMapType
      marketsData: MarketData[]
    }) => {
      console.log('marketsData', marketsData)

      const allTokensData = await getAllTokensData(wallet.publicKey, connection)
      const filteredAllTokensData = filterDuplicateTokensByAmount(allTokensData)

      const allTokensDataWithValues = filteredAllTokensData.map((token) => ({
        ...token,
        ...(tokensMap[token.symbol] ? tokensMap[token.symbol] : {}),
      }))

      console.log('allTokensDataWithValues', allTokensDataWithValues)

      const tokensWithPrices = await getPricesForTokens(allTokensDataWithValues)

      const availableTokensForRebalanceMap = processAllTokensData({
        marketsData,
        tokensWithPrices,
      })

      const chartColors = generateChartColors({
        data: availableTokensForRebalanceMap,
      })

      const legendColors = generateLegendColors({
        data: availableTokensForRebalanceMap,
      })

      setTokensMap(availableTokensForRebalanceMap)
      setColors(chartColors)
      setColorsForLegend(legendColors)
    },
    [wallet, connection]
  )

  return (
    <RowContainer
      theme={theme}
      height="100%"
      style={{
        background: theme.palette.grey.additional,
        minWidth: '1000px',
        overflow: 'auto',
        minHeight: '500px',
      }}
    >
      {!publicKey ? (
        <>
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
        </>
      ) : (
        <RowContainer theme={theme} height="100%" padding={'6rem 0'}>
          <Row
            height="100%"
            direction={'column'}
            width={'60%'}
            margin={'0 2rem 0 0'}
            justify={'space-between'}
            style={{ flexWrap: 'nowrap' }}
          >
            <DebouncedMemoizedRebalanceHeaderComponent
              totalTokensValue={totalTokensValue}
              leftToDistributeValue={leftToDistributeValue}
            />
            <RebalanceTable
              data={Object.values(tokensMap).map((el) => el)}
              theme={theme}
              tokensMap={tokensMap}
              setTokensMap={setTokensMap}
              softRefresh={() => softRefresh({ marketsData, tokensMap })}
              leftToDistributeValue={leftToDistributeValue}
              setLeftToDistributeValue={setLeftToDistributeValue}
              totalTokensValue={totalTokensValue}
              loadingRebalanceData={loadingRebalanceData}
              allTokensData={Object.values(tokensMap)}
            />
          </Row>
          <Row
            height={'100%'}
            width={'35%'}
            direction="column"
            justify="space-between"
            style={{ flexWrap: 'nowrap' }}
          >
            <RowContainer height={'calc(85% - 2rem)'}>
              <DebouncedMemoizedCurrentValueChartWithLegend
                data={tokensMap}
                colors={colors}
                colorsForLegend={colorsForLegend}
                id={'current'}
              />
              <DebouncedMemoizedTargetValueChartWithLegend
                data={tokensMap}
                colors={colors}
                colorsForLegend={colorsForLegend}
                id={'target'}
              />
            </RowContainer>
            <RowContainer
              justify={'space-between'}
              align={'flex-end'}
              height={'16%'}
            >
              <Row
                align={'flex-end'}
                height={'100%'}
                width={'calc(45% - 1rem)'}
              >
                <DebouncedBalanceDistributedComponent
                  totalTokensValue={totalTokensValue}
                  leftToDistributeValue={leftToDistributeValue}
                  theme={theme}
                />
              </Row>
              <BtnCustom
                theme={theme}
                onClick={() => {
                  // refreshRebalance()
                  changeRebalancePopupState(true)
                }}
                needMinWidth={false}
                btnWidth="calc(55% - 1rem)"
                height="100%"
                fontSize="1.4rem"
                borderRadius="1.6rem"
                borderColor={theme.palette.blue.serum}
                btnColor={'#fff'}
                backgroundColor={theme.palette.blue.serum}
                textTransform={'none'}
                transition={'all .4s ease-out'}
                padding={'2rem'}
                style={{ whiteSpace: 'nowrap' }}
              >
                Rebalance Now
              </BtnCustom>
            </RowContainer>
          </Row>
        </RowContainer>
      )}

      {isRebalancePopupOpen && (
        <MemoizedRebalancePopup
          wallet={wallet}
          connection={connection}
          tokensMap={tokensMap}
          refreshRebalance={refreshRebalance}
          setLoadingRebalanceData={setLoadingRebalanceData}
          marketsData={marketsData}
          theme={theme}
          open={isRebalancePopupOpen}
          rebalanceStep={rebalanceStep}
          changeRebalanceStep={changeRebalanceStep}
          close={() => {
            changeRebalanceStep('initial')
            changeRebalancePopupState(false)
          }}
        />
      )}
    </RowContainer>
  )
}

export default compose(withTheme(), withPublicKey)(RebalanceComposition)
