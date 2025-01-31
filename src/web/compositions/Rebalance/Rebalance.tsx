import { withTheme } from '@material-ui/core/styles'
import { Connection } from '@solana/web3.js'
import React, { useEffect, useState, useCallback } from 'react'
import debounceRender from 'react-debounce-render'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import DonutChartWithLegend from '@sb/components/AllocationBlock/index'
import { Button } from '@sb/components/Button'
import { ConnectWalletScreen } from '@sb/components/ConnectWalletScreen'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useConnection } from '@sb/dexUtils/connection'
import { MarketsMap, useAllMarketsList } from '@sb/dexUtils/markets'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { withPublicKey } from '@sb/hoc/withPublicKey'

import { getAllTokensData } from '@core/solana'

import BalanceDistributedComponent from './components/BalanceDistributed'
import RebalanceHeaderComponent from './components/Header'
import { MeetRebalancePopup } from './components/MeetRebalancePopup/MeetRebalancePopup'
import { RebalancePopup } from './components/RebalancePopup/RebalancePopup'
import RebalanceTable from './components/Tables'
import { TokensMapType, Colors } from './Rebalance.types'
import {
  getPricesForTokens,
  getTokenValuesForTokens,
  getTotalTokenValue,
} from './utils'
import {
  generateLegendColors,
  generateChartColors,
} from './utils/colorGenerating'
import { filterDuplicateTokensByAmount } from './utils/filterDuplicateTokensByAmount'
import { getTokensToBuy } from './utils/getTokensToBuy'
import { getTokensToSell } from './utils/getTokensToSell'
import { processAllTokensData } from './utils/processAllTokensData'
import { resetTargetAllocation } from './utils/resetTargetAllocation'

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
  1500,
  { leading: false }
)

const DebouncedMemoizedTargetValueChartWithLegend = debounceRender(
  DonutChartWithLegend,
  1500,
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

const RebalanceComposition = ({ publicKey }: { publicKey: string }) => {
  const theme = useTheme()
  const { wallet } = useWallet()
  const connection: Connection = useConnection()
  const allMarketsMap = useAllMarketsList()

  const [isRebalancePopupOpen, changeRebalancePopupState] = useState(false)
  const [isMeetRebalancePopupOpen, setIsMeetRebalancePopupOpen] =
    useLocalStorageState('isMeetRebalancePopupOpen', true)

  const isWalletConnected = wallet.connected

  const [tokensMap, setTokensMap] = useState<TokensMapType>({})
  const [totalTokensValue, setTotalTokensValue] = useState(0)
  const [leftToDistributeValue, setLeftToDistributeValue] = useState(0)
  const [rebalanceState, setRefreshStateRebalance] = useState(false)
  const [loadingRebalanceData, setLoadingRebalanceData] = useState(false)

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

        const filteredAllTokensData =
          filterDuplicateTokensByAmount(allTokensData)

        // console.log('filteredAllTokensData', filteredAllTokensData)
        const tokensWithPrices = await getPricesForTokens(filteredAllTokensData)
        // console.log('tokensWithPrices', tokensWithPrices)
        const tokensWithTokenValue = getTokenValuesForTokens(tokensWithPrices)
        // console.log('tokensWithTokenValue', tokensWithTokenValue)
        const totalTokenValue = getTotalTokenValue(tokensWithTokenValue)

        const availableTokensForRebalanceMap = processAllTokensData({
          allMarketsMap,
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
        setLeftToDistributeValue(0)
        console.timeEnd('rebalance initial data set time')
      } catch (e) {
        // set error
        console.log('e: ', e)
      }
      setLoadingRebalanceData(false)
    }

    if (isWalletConnected) {
      fetchData()
    }
  }, [wallet.publicKey, rebalanceState])

  const softRefresh = useCallback(
    async ({
      tokensMap,
      allMarketsMap,
    }: {
      tokensMap: TokensMapType
      allMarketsMap: MarketsMap
    }) => {
      // new tokens + new amounts
      const allTokensData = await getAllTokensData(wallet.publicKey, connection)
      const filteredAllTokensData = filterDuplicateTokensByAmount(allTokensData)

      // add new coins
      const allTokensDataWithValues = filteredAllTokensData.map((token) => ({
        ...token,
        // set amount to snapshot value, doing nothing for new coins
        ...(tokensMap[token.symbol] ? tokensMap[token.symbol] : {}),
      }))

      const tokensWithPrices = await getPricesForTokens(allTokensDataWithValues)

      const availableTokensForRebalanceMap = processAllTokensData({
        allMarketsMap,
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

  const resetTargetAllocationFunc = useCallback((tokensMap: TokensMapType) => {
    const resettedTokensMap = resetTargetAllocation(tokensMap)
    setTokensMap(resettedTokensMap)
    setLeftToDistributeValue(0)
  }, [])

  const tokensToSell = getTokensToSell(tokensMap)
  const tokensToBuy = getTokensToBuy(tokensMap)

  const isButtonDisabled =
    (tokensToSell.length === 0 && tokensToBuy.length === 0) ||
    +leftToDistributeValue.toFixed(2) !== 0

  return (
    <RowContainer
      height="calc(100vh - 120px)"
      style={{
        background: theme.colors.white6,
        minWidth: '1000px',
        overflow: 'auto',
        minHeight: '500px',
        fontSize: '16px',
      }}
    >
      {!isWalletConnected ? (
        <ConnectWalletScreen />
      ) : (
        <RowContainer height="100%" padding="6rem 0">
          <Row
            height="100%"
            direction="column"
            width="60%"
            margin="0 2rem 0 0"
            justify="space-between"
            style={{ flexWrap: 'nowrap' }}
          >
            <DebouncedMemoizedRebalanceHeaderComponent
              totalTokensValue={totalTokensValue}
              leftToDistributeValue={leftToDistributeValue}
            />
            <RebalanceTable
              data={Object.values(tokensMap)}
              theme={theme}
              tokensMap={tokensMap}
              setTokensMap={setTokensMap}
              softRefresh={() => softRefresh({ allMarketsMap, tokensMap })}
              leftToDistributeValue={leftToDistributeValue}
              setLeftToDistributeValue={setLeftToDistributeValue}
              totalTokensValue={totalTokensValue}
              loadingRebalanceData={loadingRebalanceData}
              resetTargetAllocation={() => resetTargetAllocationFunc(tokensMap)}
            />
          </Row>
          <Row
            height="100%"
            width="35%"
            direction="column"
            justify="space-between"
            style={{ flexWrap: 'nowrap' }}
          >
            <RowContainer height="calc(85% - 2rem)">
              <DebouncedMemoizedCurrentValueChartWithLegend
                data={tokensMap}
                colors={colors}
                colorsForLegend={colorsForLegend}
                id="current"
              />

              <DebouncedMemoizedTargetValueChartWithLegend
                data={tokensMap}
                colors={colors}
                colorsForLegend={colorsForLegend}
                id="target"
              />
            </RowContainer>
            <RowContainer justify="space-between" align="flex-end" height="16%">
              <Row align="flex-end" height="100%" width="calc(45% - 1rem)">
                <DebouncedBalanceDistributedComponent
                  totalTokensValue={totalTokensValue}
                  leftToDistributeValue={leftToDistributeValue}
                  theme={theme}
                />
              </Row>
              <Button
                onClick={() => {
                  changeRebalancePopupState(true)
                }}
                disabled={isButtonDisabled}
                $variant="primary"
                style={{ width: 'calc(55% - 1rem)', height: '100%' }}
              >
                Rebalance Now
              </Button>
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
          open={isRebalancePopupOpen}
          close={() => changeRebalancePopupState(false)}
        />
      )}
      <MeetRebalancePopup
        open={isMeetRebalancePopupOpen}
        onClose={() => setIsMeetRebalancePopupOpen(false)}
      />
    </RowContainer>
  )
}

export default compose(withTheme(), withPublicKey)(RebalanceComposition)
