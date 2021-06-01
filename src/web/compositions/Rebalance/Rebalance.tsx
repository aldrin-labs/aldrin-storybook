import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core/styles'
import { isEqual } from 'lodash'
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
} from './utils'
import { useConnection } from '@sb/dexUtils/connection'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { PoolInfo, TokensMapType, TokenType } from './Rebalance.types'
import RebalanceTable from './components/Tables'
import RebalanceHeaderComponent from './components/Header'
import DonutChartWithLegend from '@sb/components/AllocationBlock/index'
import BalanceDistributedComponent from './components/BalanceDistributed'
import { RebalancePopup } from './components/RebalancePopup/RebalancePopup'

import { getPoolsInfoMockData } from './Rebalance.mock'

const MemoizedDonutChartWithLegend = React.memo(
  DonutChartWithLegend,
  (prevProps, nextProps) => {
    return isEqual(prevProps.data, nextProps.data)
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
  getPoolsInfoQuery: { getPoolsInfo },
}: {
  publicKey: string
  theme: Theme
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
}) => {
  const { wallet } = useWallet()
  const [isRebalancePopupOpen, changeRebalancePopupState] = useState(false)
  const [rebalanceStep, changeRebalanceStep] =
    useState<'initial' | 'pending' | 'done'>('initial')

  const connection: Connection = useConnection()
  const isWalletConnected = !!wallet?.publicKey

  const [tokensMap, setTokensMap] = useState<TokensMapType>({})
  const [totalTokensValue, setTotalTokensValue] = useState(0)
  const [leftToDistributeValue, setLeftToDistributeValue] = useState(0)
  const [rebalanceState, setRefreshStateRebalance] = useState(false)
  const [loadingRebalanceData, setLoadingRebalanceData] = useState(false)


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
        const sortedTokensByTokenValue =
          getSortedTokensByValue(tokensWithTokenValue)

        const totalTokenValue = getTotalTokenValue(sortedTokensByTokenValue)

        const tokensWithPercentages = getPercentageAllocationForTokens(
          sortedTokensByTokenValue,
          totalTokenValue
        )

        const tokensWithSliderSteps = getSliderStepForTokens(
          tokensWithPercentages,
          totalTokenValue
        )

        // TODO: Can be splitted and move up
        const availableTokensForRebalance = getAvailableTokensForRebalance(
          // getPoolsInfoMockData,
          getPoolsInfo,
          tokensWithSliderSteps
        )
        const availableTokensForRebalanceMap = getTokensMap(
          availableTokensForRebalance
        )

        // console.log(
        //   'availableTokensForRebalanceMap: ',
        //   availableTokensForRebalanceMap
        // )

        setTokensMap(availableTokensForRebalanceMap)
        setTotalTokensValue(totalTokenValue)

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
      style={{ background: theme.palette.grey.additional }}
    >
      {!publicKey ? (
        <>
          {/* connect wallet */}
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
          >
            <RowContainer height={'calc(85% - 2rem)'}>
              <DebouncedMemoizedDonutChartWithLegend
                data={Object.values(tokensMap).map((el) => ({
                  symbol: el.symbol,
                  value: el.percentage,
                }))}
                id={'current'}
              />
              <DebouncedMemoizedDonutChartWithLegend
                data={Object.values(tokensMap).map((el) => ({
                  symbol: el.symbol,
                  value: el.targetPercentage,
                }))}
                id={'target'}
              />
            </RowContainer>
            <RowContainer
              justify={'space-between'}
              align={'flex-end'}
              height={'16%'}
            >
              {' '}
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
        // getPoolsInfo={getPoolsInfoMockData}
        getPoolsInfo={getPoolsInfo}
        theme={theme}
        open={isRebalancePopupOpen}
        rebalanceStep={rebalanceStep}
        changeRebalanceStep={changeRebalanceStep}
        close={() => changeRebalancePopupState(false)}
      />
    </RowContainer>
  )
}

export default compose(
  withTheme(),
  withPublicKey,
  queryRendererHoc({
    query: getPoolsInfo,
    name: 'getPoolsInfoQuery',
    fetchPolicy: 'cache-and-network',
  })
)(RebalanceComposition)
