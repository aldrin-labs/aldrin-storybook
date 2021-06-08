import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core/styles'
import { isEqual } from 'lodash'
import { Connection } from '@solana/web3.js'
import debounceRender from 'react-debounce-render'

import { client } from '@core/graphql/apolloClient'
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
  getPoolsInfo,
} from './utils'
import { useConnection } from '@sb/dexUtils/connection'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import {
  PoolInfo,
  TokensMapType,
  TokenType,
  RebalancePopupStep,
} from './Rebalance.types'
import RebalanceTable from './components/Tables'
import RebalanceHeaderComponent from './components/Header'
import DonutChartWithLegend from '@sb/components/AllocationBlock/index'
import BalanceDistributedComponent from './components/BalanceDistributed'
import { RebalancePopup } from './components/RebalancePopup/RebalancePopup'
import {
  fixedColors,
  fixedColorsForLegend,
  getRandomBlueColor,
} from '@sb/components/AllocationBlock/DonutChart/utils'

import { getPoolsInfoMockData } from './Rebalance.mock'

const MemoizedDonutChartWithLegend = React.memo(
  DonutChartWithLegend,
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.data, nextProps.data) &&
      isEqual(prevProps.colors, nextProps.colors) &&
      isEqual(prevProps.colorsForLegend, nextProps.colorsForLegend)
    )
  }
)

const MemoizedRebalancePopup = React.memo(
  RebalancePopup,
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.rebalanceStep === nextProps.rebalanceStep
    )
  }
)

const DebouncedMemoizedDonutChartWithLegend = debounceRender(
  MemoizedDonutChartWithLegend,
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
  const [isRebalancePopupOpen, changeRebalancePopupState] = useState(false)
  const [rebalanceStep, changeRebalanceStep] = useState<RebalancePopupStep>(
    'initial'
  )

  const connection: Connection = useConnection()
  const isWalletConnected = !!wallet?.publicKey

  const [tokensMap, setTokensMap] = useState<TokensMapType>({})
  const [totalTokensValue, setTotalTokensValue] = useState(0)
  const [leftToDistributeValue, setLeftToDistributeValue] = useState(0)
  const [rebalanceState, setRefreshStateRebalance] = useState(false)
  const [loadingRebalanceData, setLoadingRebalanceData] = useState(false)

  const [poolsInfoData, setPoolsInfoData] = useState<PoolInfo[]>([])

  const [colors, setColors] = useState([])
  const [colorsForLegend, setColorsForLegend] = useState([])

  const currentData = Object.values(tokensMap)
    .map((el) => ({
      symbol: el.symbol,
      value: el.percentage,
    }))
    .sort((a, b) => b.value - a.value)

  const targetData = Object.values(tokensMap)
    .map((el) => ({
      symbol: el.symbol,
      value: el.targetPercentage,
    }))
    .sort((a, b) => b.value - a.value)

  console.log(
    'targetData',
    targetData,
    targetData.map(
      (el) => colors.find((item) => item.symbol === el.symbol)?.color
    )
  )

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

        const tokensWithPrices = await getPricesForTokens(allTokensData)
        const tokensWithTokenValue = getTokenValuesForTokens(tokensWithPrices)
        const sortedTokensByTokenValue = getSortedTokensByValue(
          tokensWithTokenValue
        )

        const totalTokenValue = getTotalTokenValue(sortedTokensByTokenValue)

        const tokensWithPercentages = getPercentageAllocationForTokens(
          sortedTokensByTokenValue,
          totalTokenValue
        )

        const tokensWithSliderSteps = getSliderStepForTokens(
          tokensWithPercentages,
          totalTokenValue
        )

        const poolsInfo = await getPoolsInfo()

        // TODO: Can be splitted and move up
        const availableTokensForRebalance = getAvailableTokensForRebalance(
          // getPoolsInfoMockData,
          poolsInfo,
          tokensWithSliderSteps
        )
        const availableTokensForRebalanceMap = getTokensMap(
          availableTokensForRebalance
        )

        const currentTargetData = Object.values(
          availableTokensForRebalanceMap
        ).map((el) => ({
          symbol: el.symbol,
          value: el.percentage,
        }))

        const generatedColors = currentTargetData.map((el, i) => ({
          symbol: el.symbol,
          color: i < fixedColors.length ? fixedColors[i] : getRandomBlueColor(),
        }))

        const generatedColorsForLegend = currentTargetData.map((el, i) => ({
          symbol: el.symbol,
          color:
            i < fixedColorsForLegend.length
              ? fixedColorsForLegend[i]
              : getRandomBlueColor(),
        }))
        console.log(
          'currentTargetData',
          generatedColors,
          generatedColorsForLegend
        )
        setColors(generatedColors)
        setColorsForLegend(generatedColorsForLegend)

        // console.log(
        //   'availableTokensForRebalanceMap: ',
        //   availableTokensForRebalanceMap
        // )

        setTokensMap(availableTokensForRebalanceMap)
        setTotalTokensValue(totalTokenValue)
        setPoolsInfoData(poolsInfo)

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
              leftToDistributeValue={leftToDistributeValue}
              setLeftToDistributeValue={setLeftToDistributeValue}
              totalTokensValue={totalTokensValue}
              loadingRebalanceData={loadingRebalanceData}
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
              <DebouncedMemoizedDonutChartWithLegend
                data={currentData}
                colors={colors.map((el) => el.color)}
                colorsForLegend={colorsForLegend.map((el) => el.color)}
                id={'current'}
              />
              <DebouncedMemoizedDonutChartWithLegend
                data={targetData}
                colors={targetData.map(
                  (el) =>
                    colors.find((item) => item.symbol === el.symbol)?.color
                )}
                colorsForLegend={targetData.map(
                  (el) =>
                    colorsForLegend.find((item) => item.symbol === el.symbol)
                      ?.color
                )}
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

      <MemoizedRebalancePopup
        wallet={wallet}
        connection={connection}
        tokensMap={tokensMap}
        refreshRebalance={refreshRebalance}
        setLoadingRebalanceData={setLoadingRebalanceData}
        // getPoolsInfo={getPoolsInfoMockData}
        getPoolsInfo={poolsInfoData}
        theme={theme}
        open={isRebalancePopupOpen}
        rebalanceStep={rebalanceStep}
        changeRebalanceStep={changeRebalanceStep}
        close={() => changeRebalancePopupState(false)}
      />
    </RowContainer>
  )
}

export default compose(withTheme(), withPublicKey)(RebalanceComposition)
