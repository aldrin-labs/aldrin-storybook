import React from 'react'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'

import { getEndDate } from '@core/containers/TradeOrderHistory/TradeOrderHistory.utils'
import GitTransactionCalendar from '@sb/components/GitTransactionCalendar'

import { Grid } from '@material-ui/core'
import {
  GridItemContainer,
  GridTableContainer,
  TransactionsPageMediaQuery,
  GridCalendarContainer,
} from './TransactionPage.styles'

import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistoryWrapper'

import TransactionsActionsStatistic from './TransactionsActionsStatistic/TransactionsActionsStatistic'

import { withTheme } from '@material-ui/styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'

import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

import { graphql } from 'react-apollo'
import { finishJoyride } from '@core/utils/joyride'

import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import { transactionsPageSteps } from '@sb/config/joyrideSteps'
import GitCalendarChooseYear from '@sb/components/GitTransactionCalendar/ChooseYear'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { StyleForCalendar } from '@sb/components/GitTransactionCalendar/Calendar.styles'

const TransactionsSpotLink = (props: any) => (
  <Link to="/portfolio/transactions/spot" {...props} />
)
const TransactionsFuturesLink = (props: any) => (
  <Link to="/portfolio/transactions/futures" {...props} />
)

@withTheme()
@withRouter
class TransactionPage extends React.PureComponent {
  state = {
    filterCoin: '',
    inputValue: '',
    concreteDaySelected: false,
    key: 0,
    stepIndex: 0,
    gitCalendarDate: {
      startDate: moment().startOf('year'),
      endDate: moment().endOf('year'),
      activeDateButton: moment().format('YYYY'),
    },

    tradeOrderHistoryDate: {
      startDate: moment()
        .startOf('day')
        .subtract(7, 'days'),
      endDate: moment().endOf('day'),
      activeDateButton: '1Week',
      focusedInput: null,
    },
  }
  updateFilterCoin = (inputValue: string) => {
    this.setState({ filterCoin: inputValue })
  }

  onInputChange = (inputValue: string) => {
    this.setState({ inputValue })
  }

  onFocusChange = (focusedInput: string) =>
    this.setState((prevState) => ({
      ...prevState,
      tradeOrderHistoryDate: {
        ...prevState.tradeOrderHistoryDate,
        focusedInput,
      },
    }))

  onDateButtonClick = async (stringDate: string) => {
    this.setState({
      concreteDaySelected: false,
      tradeOrderHistoryDate: {
        activeDateButton: stringDate,
        startDate: getEndDate(stringDate),
        endDate: moment().endOf('day'),
      },
    })
  }

  onDatesChange = ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment | null
    endDate: moment.Moment | null
  }) =>
    this.setState((prevState) => ({
      ...prevState,
      tradeOrderHistoryDate: {
        ...prevState.tradeOrderHistoryDate,
        startDate,
        endDate,
      },
    }))

  onGitCalendarDateClick = async (stringDate: string) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        gitCalendarDate: {
          activeDateButton: moment(stringDate).format('YYYY'),
          startDate: moment(stringDate).startOf('year'),
          endDate: moment(stringDate).endOf('year'),
        },
      }),
      () => {
        // TODO: there should be mutation for search:
      }
    )
  }

  onHeatmapDateClick = (value) => {
    if (!value) {
      return
    }

    this.setState((prevState) => ({
      ...prevState,
      concreteDaySelected: true,
      tradeOrderHistoryDate: {
        ...prevState.tradeOrderHistoryDate,
        startDate: moment(value.date).startOf('day'),
        endDate: moment(value.date).endOf('day'),
      },
    }))
  }

  handleChangeShowHideOptions = (option) => (event) => {
    this.setState({ [option]: event.target.checked })
  }

  handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
      } = this.props

      finishJoyride({
        updateTooltipSettingsMutation,
        getTooltipSettings,
        name: 'transactionPage',
      })
    }

    switch (data.action) {
      case 'next': {
        if (data.lifecycle === 'complete') {
          this.setState((prev) => ({ stepIndex: prev.stepIndex + 1 }))
        }
        break
      }
      case 'prev': {
        if (data.lifecycle === 'complete') {
          this.setState((prev) => ({ stepIndex: prev.stepIndex - 1 }))
        }
        break
      }
    }

    if (
      data.status === 'finished' ||
      (data.status === 'stop' && data.index !== data.size - 1) ||
      data.status === 'reset'
    ) {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      location: { pathname },
      getTooltipSettingsQuery: {
        getTooltipSettings: { transactionPage },
      },
    } = this.props

    const {
      gitCalendarDate,
      tradeOrderHistoryDate,
      inputValue,
      filterCoin,
      concreteDaySelected,
    } = this.state

    const pageType = /spot/.test(pathname)
      ? 'SPOT'
      : /futures/.test(pathname)
      ? 'FUTURES'
      : ''

    return (
      <>
        <TransactionsPageMediaQuery />
        <StyleForCalendar />
        <Grid
          container
          justify="space-between"
          style={{
            padding: '2vh 5% 0 5px',
            overflow: 'hidden',
            flexWrap: 'nowrap',
            height: '84vh',
          }}
        >
          <GridItemContainer
            item
            lg={10}
            md={10}
            style={{
              boxShadow: 'none',
              border: 'none',
              paddingLeft: '1.5rem',
            }}
          >
            <Grid item style={{ height: '100%' }}>
              <Grid container style={{ height: '30%' }}>
                <GridCalendarContainer
                  item
                  xs={3}
                  id="choosePeriod"
                  style={{
                    background: 'none',
                    boxShadow: 'none',
                    border: 'none',
                    margin: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 2rem 2rem 0',
                  }}
                >
                  <Grid container style={{ padding: '0 0 2rem 0' }}>
                    <PillowButton
                      containerStyle={{ width: '100%', margin: 0 }}
                      buttonAdditionalStyle={{ width: '50%', height: '3rem' }}
                      firstHalfText={'spot'}
                      secondHalfText={'futures'}
                      firstHalfComponent={TransactionsSpotLink}
                      secondHalfComponent={TransactionsFuturesLink}
                      activeHalf={pageType === 'SPOT' ? 'first' : 'second'}
                      changeHalf={() => {}}
                    />
                  </Grid>
                  <GitCalendarChooseYear
                    {...{
                      ...gitCalendarDate,
                      onDateButtonClick: this.onGitCalendarDateClick,
                    }}
                  />
                </GridCalendarContainer>
                <GridCalendarContainer
                  item
                  xs={9}
                  id="calendarTransactions"
                  style={{ position: 'relative' }}
                >
                  <GitTransactionCalendar
                    {...{
                      ...gitCalendarDate,
                      tradeOrderHistoryDate,
                      concreteDaySelected,
                      pageType,
                      onDateButtonClick: this.onDateButtonClick,
                      onFocusChange: this.onFocusChange,
                      onDatesChange: this.onDatesChange,
                      onHeatmapDateClick: this.onHeatmapDateClick,
                      activeDateButton: tradeOrderHistoryDate.activeDateButton,
                    }}
                  />
                </GridCalendarContainer>
              </Grid>

              <Grid container style={{ height: '100%' }}>
                <GridTableContainer item xs={12} id="tableTransactions">
                  <TradeOrderHistory
                    includeExchangeTransactions={false}
                    includeTrades={pageType === 'SPOT'}
                    includeFutures={pageType === 'FUTURES'}
                    handleChangeShowHideOptions={
                      this.handleChangeShowHideOptions
                    }
                    inputValue={inputValue}
                    filterCoin={filterCoin}
                    onInputChange={this.onInputChange}
                    updateFilterCoin={this.updateFilterCoin}
                    startDate={tradeOrderHistoryDate.startDate}
                    endDate={tradeOrderHistoryDate.endDate}
                    {...{
                      tradeOrderHistoryDate,
                      concreteDaySelected,
                      pageType,
                      onDateButtonClick: this.onDateButtonClick,
                      onFocusChange: this.onFocusChange,
                      onDatesChange: this.onDatesChange,
                      onHeatmapDateClick: this.onHeatmapDateClick,
                      activeDateButton: tradeOrderHistoryDate.activeDateButton,
                    }}
                  />
                </GridTableContainer>
              </Grid>
            </Grid>
          </GridItemContainer>

          <GridItemContainer
            item
            lg={2}
            md={2}
            id="statisticTransactions"
            style={{
              boxShadow: 'none',
              border: 'none',
              paddingLeft: '1.5rem',
              paddingTop: '0',
            }}
          >
            <TransactionsActionsStatistic
              includeTrades={pageType === 'SPOT'}
              includeFutures={pageType === 'FUTURES'}
            />
            {/* <WinLossRatio /> */}
          </GridItemContainer>
        </Grid>

        <JoyrideOnboarding
          continuous={true}
          stepIndex={this.state.stepIndex}
          showProgress={true}
          showSkipButton={true}
          key={this.state.key}
          steps={transactionsPageSteps}
          open={transactionPage}
          handleJoyrideCallback={this.handleJoyrideCallback}
        />
      </>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  })
)(TransactionPage)
