import React, { PureComponent } from 'react'
import moment from 'moment'
import { isEqual } from 'lodash-es'
import { ApolloConsumer } from 'react-apollo'
import MdReplay from '@material-ui/icons/Replay'
import { Fab, Button as ButtonMUI, Typography, Grow } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { DateRangePicker } from 'react-dates'

import { RebalancePeriod } from './config'
import { OPTIMIZE_PORTFOLIO } from '@core/graphql/queries/portfolio/optimization/optimizePortfolio'
import { sliceCoinName } from '@core/utils/PortfolioTableUtils'
import { systemError } from '@core/utils/errorsConfig'
import Table from '../Table/Table'
import { BarChart, SwitchButtons } from '@storybook/components/index'
import { IProps, IData } from './Import.types'
import {
  InnerChartContainer,
  ChartContainer,
} from '../shared.styles.tsx'
import {
  SwitchButtonsWrapper,
  InputContainer,
  TableContainer,
  Chart,
  ImportData,
  FlexWrapper,
  InputElementWrapper,
  InputInnerContainer,
  SelectOptimization,
  STextField,
  StyledInputLabel,
  StyledSwitch,
  StyledWrapperForDateRangePicker,
  TableSelectsContaienr,
} from './Import.styles'
import { StyledCardHeader } from '../Optimization.styles'

export default class Import extends PureComponent<IProps> {
  state = {
    baseCoin: 'USDT',
    rebalancePeriod: null,
    isRiskFreeAssetEnabled: true,
    focusedInput: null,
    startDate: null,
    endDate: null,
    percentages: ['min', 'low', 'med', 'high', 'max'],
    totalPriceOfAllAssets: 0,
    initialPortfolio: [],
    isUSDTInInitialPortfolioExists: false,
  }

  componentDidMount() {
    this.importPortfolio()
  }
  importPortfolio = () => {
    const assets =
      this.props.data &&
      this.props.data.myPortfolios[0] &&
      this.props.transformData(this.props.data.myPortfolios[0].portfolioAssets)

    this.props.updateData(assets[0])
    const isUSDTInInitialPortfolioExists = assets[0].some(
      (elem) => elem.coin === 'USDT'
    )
    this.setState({
      isUSDTInInitialPortfolioExists,
      initialPortfolio: assets[0],
      totalPriceOfAllAssets: assets[1],
    })
  }

  newOptimizeButtonClick = async (
    client: any,
    storeData: IData[],
    baseCoin: string,
    rebalancePeriod: number,
    isRiskFreeAssetEnabled: boolean,
    startDate: object,
    endDate: object
  ) => {
    const { totalPriceOfAllAssets, isUSDTInInitialPortfolioExists } = this.state
    const {
      showWarning,
      optimizedToState,
      activeButton,
      updateOptimizationCountOfRuns,
      optimizationCountOfRuns,
    } = this.props

    // TODO: Should create another function to remove USDT first, and then optimize
    // should double check for if we have USDT
    if (
      !isUSDTInInitialPortfolioExists &&
      !isRiskFreeAssetEnabled &&
      storeData.some((el) => el.coin === 'USDT')
    ) {
      this.deleteRowByCoinName('USDT')
      storeData = storeData.filter((el) => el.coin !== 'USDT')
    }

    await updateOptimizationCountOfRuns({
      variables: {
        count: optimizationCountOfRuns + 1,
      },
    })

    this.props.toggleLoading()

    const myObj = {
      coinList: storeData.map((el: IData) => el.coin),
      initialCapital: +totalPriceOfAllAssets.toFixed(2),
      baseCurrency: baseCoin,
      rebalancePeriod: +rebalancePeriod,
      riskFree: +isRiskFreeAssetEnabled,
      startDate: startDate.unix(),
      endDate: endDate.unix() - (endDate.unix() % 43200),
    }

    let backendResult

    try {
      backendResult = await client.query({
        query: OPTIMIZE_PORTFOLIO,
        variables: {
          ...myObj,
        },
        fetchPolicy: 'network-only',
      })
    } catch (e) {
      showWarning(systemError, true)
      this.onReset()
      this.props.toggleLoading()
      console.log('ERROR IN AWAIT FUNC:', e)
      return
    }

    const backendResultParsed = JSON.parse(
      backendResult.data.portfolioOptimization
    )

    if (backendResultParsed === '') {
      showWarning(systemError, true)
      this.onReset()
      this.props.toggleLoading()

      return
    }

    if (
      backendResultParsed.error ||
      backendResultParsed.error_message.length ||
      backendResultParsed.status === 1
    ) {
      const isUserError = backendResultParsed.error_message
      //TODO: Should be another function

      if (isUserError && isUserError.length) {
        const userErrorMessage = (
          <div>
            <Typography variant="h6">Info:</Typography>
            {backendResultParsed.error_message.map((el: string, i: number) => (
              <Typography key={i} variant="subtitle1">
                {el}
              </Typography>
            ))}
          </div>
        )

        showWarning(userErrorMessage, false)

        if (backendResultParsed.new_start) {
          this.setState({
            startDate: moment.unix(backendResultParsed.new_start),
          })
          this.setDataFromResponse(backendResultParsed)
        }
        if (backendResultParsed.status === 0) {
          this.setDataFromResponse(backendResultParsed)
        }

        if (backendResultParsed.status !== 0) {
          this.onResetOnlyOptimizationData()
        }

        this.props.toggleLoading()
        console.log('USER ERROR', backendResultParsed.error_message)

        return
      }

      showWarning(systemError, true)
      this.onReset()
      this.props.toggleLoading()
      console.log('ERROR', backendResultParsed.error)

      return
    }

    this.props.toggleLoading()
    this.props.setActiveButtonToDefault()

    this.setDataFromResponse(backendResultParsed)
  }

  setDataFromResponse = (backendResultParsed: object) => {
    const { optimizedToState } = this.props
    const { isRiskFreeAssetEnabled } = this.state

    const optimizedData = backendResultParsed.returns

    if (isRiskFreeAssetEnabled) {
      this.addRow('USDT', 0)
    }

    optimizedToState(optimizedData)
  }

  addRow = (name: string, value: number) => {
    if (this.props.storeData.some((el) => el.coin === name)) {
      return
    }

    if (this.props.filterValueSmallerThenPercentage >= 0) {
      this.props.showWarning('Disable Dust filter first to see added coins')
    }

    if (name) {
      this.props.updateData([
        ...this.props.storeData,
        { coin: name, percentage: value },
      ])
    }
  }

  deleteRow = (i: number) =>
    this.props.updateData(
      [...this.props.storeData].filter((el, index) => i !== index)
    )
  deleteRowByCoinName = (name: string) =>
    this.props.updateData(
      [...this.props.storeData].filter((el) => el.coin !== name)
    )

  renderBarChart = () => {
    const {
      storeData,
      activeButton,
      theme,
      rawOptimizedData,
      tab,
      showBlurOnSections,
    } = this.props

    if (!storeData) {
      return
    }

    const formatedData = storeData.map((el: IData) => ({
      x: sliceCoinName(el.coin),
      y: Number(Number(el.percentage).toFixed(2)),
    }))

    const formatedOptimizedData = rawOptimizedData.length
      ? storeData.map((el, i) => ({
          x: sliceCoinName(el.coin),
          y: Number(
            (el.optimizedPercentageArray &&
              el.optimizedPercentageArray[activeButton]) ||
              0
          ),
        }))
      : []

    const barChartData = [
      {
        data: formatedData,
        title: 'Original',
        color: '#fff',
      },
      {
        data: formatedOptimizedData,
        title: 'Optimized',
        color: '#4ed8da',
      },
    ]

    return (
      <ChartContainer
        hide={showBlurOnSections}
        minHeight={'400px'}
        margin={'0 0 0 2rem'}
        id="PortfolioDistribution"
        className="PortfolioDistributionChart"
      >
        <StyledCardHeader title="Portfolio Distribution" />
        <InnerChartContainer>
          <Chart background={theme.palette.background.default}>
            <Grow
              timeout={0}
              in={tab === 'optimization'}
              mountOnEnter
              unmountOnExit
            >
              <BarChart
                bottomMargin={75}
                theme={theme}
                height={340}
                showPlaceholder={formatedData.length === 0}
                charts={barChartData}
                alwaysShowLegend={true}
                hideDashForToolTip={true}
                xAxisVertical={true}
              />
            </Grow>
          </Chart>
        </InnerChartContainer>
      </ChartContainer>
    )
  }

  onDatesChange = ({ startDate, endDate }) =>
    this.setState({ startDate, endDate })

  onFocusChange = (focusedInput) => this.setState({ focusedInput })

  onToggleRiskSwitch = (e, che) => {
    this.setState({ isRiskFreeAssetEnabled: che })
  }

  onSelectChange = (
    name: string,
    optionSelected?: { label: string; value: string } | null
  ) => {
    const value =
      optionSelected && !Array.isArray(optionSelected)
        ? optionSelected.value
        : ''
    this.setState({ [name]: value })
  }

  onReset = () => {
    const { optimizedToState } = this.props

    optimizedToState([])
    this.importPortfolio()
  }

  onResetOnlyOptimizationData = () => {
    const { optimizedToState, updateData, storeData } = this.props

    optimizedToState([])

    updateData(
      [...storeData].map((el) => ({
        ...el,
        optimizedPercentageArray: [],
      }))
    )
  }

  render() {
    const {
      storeData, // data from redux (data from portfolio and mannualy added)
      onNewBtnClick,
      filterValueSmallerThenPercentage,
      activeButton,
      theme,
      showBlurOnSections,
    } = this.props

    const {
      baseCoin,
      rebalancePeriod,
      isRiskFreeAssetEnabled,
      startDate,
      endDate,
      initialPortfolio,
    } = this.state

    if (!storeData) {
      return (
        <Typography variant="h4" color="error">
          Erorr during download. Please Refresh the page.{' '}
        </Typography>
      )
    }

    const textColor: string = this.props.theme.palette.getContrastText(
      this.props.theme.palette.background.paper
    )

    const fontFamily = theme.typography.fontFamily

    // move it to the state
    const maximumDate = moment()
    const minimumDate = moment().subtract(3, 'years')

    const isAllOptionsFilled =
      baseCoin && rebalancePeriod && startDate && endDate

    return (
      <ApolloConsumer>
        {(client) => (
          <ImportData>
            <TableSelectsContaienr>
              <InputContainer
                showHighlightShadows={showBlurOnSections}
                id="Back-test"
                className="OptimizationInput"
              >
                <StyledCardHeader title="Back-test Input" />
                <InputInnerContainer>
                  <InputElementWrapper>
                    <StyledInputLabel color={textColor}>
                      Base coin
                    </StyledInputLabel>
                    <STextField
                      color={textColor}
                      value={this.state.baseCoin}
                      disabled={true}
                    />
                  </InputElementWrapper>
                  <InputElementWrapper>
                    <StyledInputLabel color={textColor}>
                      Rebalance period
                    </StyledInputLabel>
                    <SelectOptimization
                      id="RebalancePeriod"
                      options={RebalancePeriod}
                      isClearable={true}
                      singleValueStyles={{
                        fontSize: '0.875rem',
                      }}
                      placeholderStyles={{
                        fontSize: '0.875rem',
                      }}
                      optionStyles={{
                        fontSize: '0.875rem',
                      }}
                      onChange={(
                        optionSelected: { label: string; value: string } | null
                      ) =>
                        this.onSelectChange('rebalancePeriod', optionSelected)
                      }
                    />
                  </InputElementWrapper>
                  <InputElementWrapper>
                    <StyledInputLabel color={textColor}>
                      Date range
                    </StyledInputLabel>
                    <StyledWrapperForDateRangePicker
                      color={textColor}
                      background={theme.palette.background.paper}
                      fontFamily={fontFamily}
                    >
                      <DateRangePicker
                        isOutsideRange={(date) =>
                          date.isBefore(minimumDate, 'day') ||
                          date.isAfter(maximumDate, 'day')
                        }
                        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                        onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
                        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
                        displayFormat="MM-DD-YYYY"
                      />
                    </StyledWrapperForDateRangePicker>
                  </InputElementWrapper>
                  <InputElementWrapper>
                    <StyledInputLabel color={textColor}>
                      Stable coin
                    </StyledInputLabel>
                    <FlexWrapper>
                      <StyledSwitch
                        id="RiskFreeAssetsSwitch"
                        onChange={this.onToggleRiskSwitch}
                        checked={this.state.isRiskFreeAssetEnabled}
                      />
                    </FlexWrapper>
                  </InputElementWrapper>
                  <ButtonMUI
                    id="ButtonMUI"
                    color={'secondary'}
                    variant={'outlined'}
                    disabled={!isAllOptionsFilled}
                    onClick={() => {
                      this.newOptimizeButtonClick(
                        client,
                        storeData,
                        baseCoin,
                        rebalancePeriod,
                        isRiskFreeAssetEnabled,
                        startDate,
                        endDate
                      )
                    }}
                  >
                    Optimize Portfolio
                  </ButtonMUI>
                </InputInnerContainer>
              </InputContainer>

              <TableContainer
                id="RiskProfile"
                className="RiskProfileTable"
                hide={showBlurOnSections}
              >
                <StyledCardHeader title="Risk Profile" />

                <SwitchButtonsWrapper>
                  <SwitchButtons
                    id="SwitchRiskButtons"
                    btnClickProps={client}
                    onBtnClick={onNewBtnClick}
                    values={this.state.percentages}
                    show={this.props.rawOptimizedData.length > 1}
                    activeButton={activeButton}
                  />
                  <Tooltip
                    title={`Reset to initial portfolio`}
                    enterDelay={250}
                    leaveDelay={200}
                  >
                    <Fab
                      id="ResetPortfolio"
                      disabled={isEqual(initialPortfolio, storeData)}
                      color="secondary"
                      style={{
                        alignSelf: 'center',
                      }}
                      onClick={this.onReset}
                    >
                      <MdReplay />
                    </Fab>
                  </Tooltip>
                </SwitchButtonsWrapper>
                <Table
                  onPlusClick={this.addRow}
                  data={storeData}
                  optimizedData={
                    this.props.rawOptimizedData.length > 1
                      ? this.props.rawOptimizedData[activeButton].weights
                      : []
                  }
                  activeButton={activeButton}
                  withInput={true}
                  onClickDeleteIcon={this.deleteRow}
                  filterValueSmallerThenPercentage={
                    filterValueSmallerThenPercentage
                  }
                  theme={this.props.theme}
                />
              </TableContainer>
            </TableSelectsContaienr>
            {this.renderBarChart()}
          </ImportData>
        )}
      </ApolloConsumer>
    )
  }
}
