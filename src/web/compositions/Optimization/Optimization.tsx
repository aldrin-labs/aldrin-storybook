import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'
import { Grow, Switch } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'


import * as Useractions from '@core/redux/user/actions'
import * as actions from '@core/redux/portfolio/actions'
import { getCoinsForOptimization } from '@core/graphql/queries/portfolio/optimization/getCoinsForOptimization'
import { GET_OPTIMIZATION_COUNT_OF_RUNS } from '@core/graphql/queries/portfolio/getOptimizationCountOfRuns'
import { UPDATE_OPTIMIZATION_COUNT_OF_RUNS } from '@core/graphql/mutations/portfolio/updateOptimizationCountOfRuns'

import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio,
  roundPercentage,
  filterDust,
} from '@core/utils/PortfolioTableUtils'

import {
  IState,
  IProps,
  RawOptimizedData,
} from './Optimization.types'
import { IData } from '@core/types/PortfolioTypes'
import {
  InnerChartContainer,
  ChartContainer,
} from './shared.styles.tsx'
import {
  ChartsContainer,
  Chart,
  MainArea,
  PTWrapper,
  Content,
  ContentInner,
  StyledCardHeader,
} from './Optimization.styles'

import { ChartPlaceholder } from './ChartPlaceholder/ChartPlaceholder'
import Import from './Import/Import'
import LoaderWrapperComponent from './LoaderWrapper/LoaderWrapper'
import ErrorDialog from './Dialog/Dialog'
import LineChart from '@sb/components/LineChart'
import EfficientFrontierChart from '@sb/components/EfficientFrontierChart/EfficientFrontierChart'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import { portfolioOptimizationSteps } from '@sb/config/joyrideSteps'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import config from '@core/utils/linkConfig'
import { sumSame } from '@core/utils/PortfolioOptimizationUtils'
import { DustFilterType } from '../../../../../core/src/types/PortfolioTypes'



class Optimization extends Component<IProps, IState> {
  state: IState = {
    optimizationData: [],
    loading: false,
    activeButton: 2,
    rawOptimizedData: [],
    openWarning: false,
    warningMessage: '',
    showAllLineChartData: true,
    isSystemError: false,
    run: true,
    key: 0,
  }

  updateData = (updatedData: any): void => {
    this.setState({
      optimizationData: updatedData,
    })
  }

  optimizedToState = (data: RawOptimizedData) => {
    const optimizedCoinsWeightsMap = data.reduce((accMap, el) => {
      el.weights.forEach((weight: number, index: number) => {
        const percentageWeight = Math.abs(Number(weight) * 100).toFixed(2)
        const currentCoinName = el.portfolio_coins_list[index]

        if (accMap.has(currentCoinName)) {
          accMap.set(currentCoinName, [
            ...accMap.get(currentCoinName),
            percentageWeight,
          ])
        } else {
          accMap.set(currentCoinName, [percentageWeight])
        }
      })

      return accMap
    }, new Map())

    this.updateData(
      [...this.state.optimizationData].map((el) => ({
        ...el,
        optimizedPercentageArray: optimizedCoinsWeightsMap.get(el.coin),
      }))
    )

    this.setState({ rawOptimizedData: data })
  }

  transformData = (assets: any[], dustFilter: DustFilterType): [IData[], number] => {
    const allSum = calcAllSumOfPortfolioAsset(assets)
    // TODO: Avoid mutations in array of objects
    const newAssets = assets.map((asset: IData) => ({
      coin: asset.coin,
      percentage: +roundPercentage(
        percentagesOfCoinInPortfolio(asset, allSum, true)
      ),
      price: asset.price * asset.quantity,
    }))
    const summedAssetsWithoutDuplicates = sumSame(
      newAssets,
      'coin',
      'percentage'
    )

    const filtredDustOptimizationAssets = filterDust(summedAssetsWithoutDuplicates, dustFilter, { usdKey: 'price', percentageKey: 'percentage' }, {disableFilteringKey: 'disableFiltering'})


    return [filtredDustOptimizationAssets, allSum]
  }

  onNewBtnClick = (index: number) => {
    this.setState({ activeButton: index })
  }

  showWarning = (message: string | JSX.Element, isSystemError = false) => {
    this.setState({isSystemError, openWarning: true, warningMessage: message })
  }

  hideWarning = () => {
    this.setState({ openWarning: false })
  }

  setActiveButtonToDefault = () => this.setState({ activeButton: 2 })

  toggleLoading = () =>
    this.setState((prevState) => ({ loading: !prevState.loading }))

  onToggleLineChartSwitch = (e, isChecked: boolean) => {
    this.setState({
      showAllLineChartData: isChecked,
    })
  }

  openLink = (link: string = '') => {
    this.hideWarning()
    window.open(link, 'CCAI Feedback')
  }

  renderInput = (
    showBlurOnSections: boolean,
    optimizationCountOfRuns: number,
    showCustomPlaceholder: boolean,
    placeholderElement: string
  ) => {
    // importing stuff from backend or manually bu user
    const { activeButton, rawOptimizedData, optimizationData } = this.state
    const {
      isShownMocks,
      baseCoin,
      theme,
      tab,
      updateOptimizationCountOfRuns,
      dustFilter,
    } = this.props
    const { updateData } = this

    return (
      <QueryRenderer
        component={Import}
        fetchPolicy="cache-and-network"
        query={getCoinsForOptimization}
        variables={{ baseCoin }}
        showWarning={this.showWarning}
        toggleLoading={this.toggleLoading}
        setActiveButtonToDefault={this.setActiveButtonToDefault}
        rawOptimizedData={rawOptimizedData}
        transformData={this.transformData}
        storeData={optimizationData}
        isShownMocks={isShownMocks}
        updateData={updateData}
        optimizedToState={this.optimizedToState}
        // buttons props
        onNewBtnClick={this.onNewBtnClick}
        activeButton={activeButton}
        theme={theme}
        tab={tab}
        showBlurOnSections={showBlurOnSections}
        updateOptimizationCountOfRuns={updateOptimizationCountOfRuns}
        optimizationCountOfRuns={optimizationCountOfRuns}
        showCustomPlaceholder={showCustomPlaceholder}
        placeholderElement={placeholderElement}
        dustFilter={dustFilter}
      />
    )
  }

  renderCharts = (showBlurOnSections: boolean, showCustomPlaceholder: boolean, placeholderElement: any) => {
    const { activeButton, rawOptimizedData, showAllLineChartData, optimizationData } = this.state
    const { theme } = this.props

    if (!optimizationData) return

    const arrayOfReturnedValues =
      rawOptimizedData && rawOptimizedData.map((el) => el.return_value)
    const arrayOfReturnedRisks =
      rawOptimizedData && rawOptimizedData.map((el) => el.risk_coefficient)

    const efficientFrontierData = {
      activeButton,
      percentages: arrayOfReturnedValues,
      risk: arrayOfReturnedRisks,
    }

    const riskProfileNames = ['min', 'low', 'med', 'high', 'max']

    // TODO: Make it better
    // for real data
    const lineChartData = showAllLineChartData
      ? rawOptimizedData &&
        rawOptimizedData.length &&
        rawOptimizedData.map((el, i) => {
          return {
            data: el.backtest_results.map((element) => ({
              label: riskProfileNames[i],
              x: element[0],
              y: +element[1].toFixed(2),
            })),
            color: CSS_CONFIG.colors[i],
          }
        })
      : rawOptimizedData &&
        rawOptimizedData.length && {
          data: rawOptimizedData[activeButton].backtest_results.map(
            (el, i) => ({
              label: 'Optimized',
              x: el[0],
              y: +el[1].toFixed(2),
            })
          ),
          color: CSS_CONFIG.colors[activeButton],
        }

    const itemsForChartLegend = riskProfileNames.map((el, i) => ({
      title: el,
      color: CSS_CONFIG.colors[i],
    }))

    return (
      <ChartsContainer id="BackTestOptimization">
        <ChartContainer
          hide={showBlurOnSections}
          className="BackTestOptimizationChart"
        >
          <StyledCardHeader
            title="Back-test Optimization"
            action={
              <>
                <TypographyWithCustomColor color={`secondary`} variant="button">
                  Show all risk profiles
                </TypographyWithCustomColor>
                <Switch
                  onChange={this.onToggleLineChartSwitch}
                  checked={this.state.showAllLineChartData}
                />
              </>
            }
          />
          <InnerChartContainer>
            <Chart background={theme.palette.background.default}>
              <LineChart
                showCustomPlaceholder={showCustomPlaceholder}
                placeholderElement={placeholderElement}
                theme={theme}
                additionalInfoInPopup={true}
                alwaysShowLegend={showAllLineChartData}
                data={
                  lineChartData === 0
                    ? undefined
                    : showAllLineChartData
                    ? lineChartData
                    : [lineChartData]
                }
                itemsForChartLegend={itemsForChartLegend}
              />
            </Chart>
          </InnerChartContainer>
        </ChartContainer>
        <ChartContainer
          hide={showBlurOnSections}
          className="EfficientFrontierChart"
        >
          <StyledCardHeader title="Efficient Frontier" />
          <InnerChartContainer>
            <Chart background={theme.palette.background.default}>
              <EfficientFrontierChart
                showCustomPlaceholder={showCustomPlaceholder}
                placeholderElement={placeholderElement}
                data={efficientFrontierData}
                theme={theme}
              />
            </Chart>
          </InnerChartContainer>
        </ChartContainer>
      </ChartsContainer>
    )
  }

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      this.props.hideToolTip('Optimization')
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      children,
      theme,
      theme: { palette },
      toolTip,
      data: { portfolioOptimization: { optimizationCountOfRuns } } = {
        portfolioOptimization: { optimizationCountOfRuns: 1 },
      },
    } = this.props

    const { loading, openWarning, warningMessage, isSystemError, rawOptimizedData } = this.state

    const showBlurOnSections = false
    const showCustomPlaceholder = !rawOptimizedData.length
    const placeholderElement = <ChartPlaceholder />
    const textColor: string = palette.getContrastText(palette.background.paper)


    return (
      <PTWrapper background={palette.background.default}>
        <Content>
          {children}
          <LoaderWrapperComponent textColor={textColor} open={loading} />
          <ContentInner loading={loading}>
            {this.renderInput(showBlurOnSections, optimizationCountOfRuns, showCustomPlaceholder, placeholderElement)}

            <MainArea background={palette.background.paper}>
                {this.renderCharts(showBlurOnSections, showCustomPlaceholder, placeholderElement)}
            </MainArea>
          </ContentInner>

          <ErrorDialog
            onReportButton={() => {
              this.openLink(config.bugLink)
            }}
            open={openWarning}
            isSystemError={isSystemError}
            warningMessage={warningMessage}
            onConfirmButton={this.hideWarning}
          />
        </Content>

        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioOptimizationSteps}
          run={toolTip.portfolioOptimization}
          callback={this.handleJoyrideCallback}
          key={this.state.key}
          styles={{
            options: {
              backgroundColor: theme.palette.common.white,
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.primary.main,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        />

      </PTWrapper>
    )
  }
}

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  toolTip: store.user.toolTip,
})

const mapDispatchToProps = (dispatch: any) => ({
  hideToolTip: (tab: string) => dispatch(Useractions.hideToolTip(tab)),
})
const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Optimization)

export default compose(
  withTheme(),
  queryRendererHoc({
    query: GET_OPTIMIZATION_COUNT_OF_RUNS,
  }),
  graphql(UPDATE_OPTIMIZATION_COUNT_OF_RUNS, {
    name: 'updateOptimizationCountOfRuns',
  })
)(storeComponent)
