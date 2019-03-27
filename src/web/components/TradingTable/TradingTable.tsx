import React, { ChangeEvent } from 'react'
// MOVE THIS TO APP -_>
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// <-- MOVE THIS TO APP
import moment from 'moment'
import { withTheme } from '@material-ui/styles'
import { Tabs, Tab } from '@material-ui/core'
import { Table } from '@sb/components'
import { StyledWrapperForDateRangePicker } from '@sb/styles/cssUtils'

import {
  TitleSecondRowContainer,
  TitleButton,
  TitleTab,
} from './TradingTable.styles'
import { IProps, IState } from './TradingTable.types'
import {
  tradingTableTabConfig,
  openOrdersBody,
  openOrdersColumnNames,
  orderHistoryBody,
  orderHistoryColumnNames,
  tradeHistoryBody,
  tradeHistoryColumnNames,
  fundsBody,
  fundsColumnNames,
} from './TradingTable.mocks'
import { DateRangePicker } from 'react-dates'

const getTableBody = (tab: string) =>
  tab === 'openOrders'
    ? openOrdersBody
    : tab === 'orderHistory'
    ? orderHistoryBody
    : tab === 'tradeHistory'
    ? tradeHistoryBody
    : tab === 'funds'
    ? fundsBody
    : []

const getTableHead = (tab: string) =>
  tab === 'openOrders'
    ? openOrdersColumnNames
    : tab === 'orderHistory'
    ? orderHistoryColumnNames
    : tab === 'tradeHistory'
    ? tradeHistoryColumnNames
    : tab === 'funds'
    ? fundsColumnNames
    : []

const getEmptyTextPlaceholder = (tab: string) =>
  tab === 'openOrders'
    ? 'You have no open orders.'
    : tab === 'orderHistory'
    ? 'You have no order history'
    : tab === 'tradeHistory'
    ? 'You have no trades.'
    : tab === 'funds'
    ? 'You have no Funds'
    : []

const getEndDate = (stringDate: string) =>
  stringDate === '1Day'
    ? moment().subtract(1, 'days')
    : stringDate === '1Week'
    ? moment().subtract(1, 'weeks')
    : stringDate === '1Month'
    ? moment().subtract(1, 'months')
    : moment().subtract(3, 'months')

@withTheme()
export default class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabIndex: 0,
    tab: 'openOrders',
    startDate: null,
    endDate: null,
    focusedInput: null,
    activeDateButton: null,
  }

  onClearDateButtonClick = () => {
    this.setState({
      startDate: null,
      endDate: null,
      focusedInput: null,
      activeDateButton: null,
    })
  }

  onDateButtonClick = (stringDate: string) => {
    this.setState({
      activeDateButton: stringDate,
      startDate: moment(),
      endDate: getEndDate(stringDate),
    })
  }

  onDatesChange = ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment | null
    endDate: moment.Moment | null
  }) => this.setState({ startDate, endDate })

  onFocusChange = (focusedInput: string) => this.setState({ focusedInput })

  handleTabChange = (e: ChangeEvent<{}>, tabIndex: number | any) => {
    this.setState({
      tabIndex,
      tab: tradingTableTabConfig[tabIndex],
    })
  }

  render() {
    const { tab, activeDateButton } = this.state
    const { theme } = this.props
    const textColor: string = theme.palette.text.primary
    const secondary = theme.palette.secondary.main
    const fontFamily = theme.typography.fontFamily
    const maximumDate = moment()
    const minimumDate = moment().subtract(3, 'years')

    return (
      <Table
        emptyTableText={getEmptyTextPlaceholder(tab)}
        withCheckboxes={false}
        title={
          <div>
            <div>
              <Tabs
                value={this.state.tabIndex}
                onChange={this.handleTabChange}
                indicatorColor="secondary"
                textColor="primary"
              >
                <TitleTab label="Open orders" primary={textColor} />
                <TitleTab label="Order history" primary={textColor} />
                <TitleTab label="Trade history" primary={textColor} />
                <TitleTab label="Funds" primary={textColor} />
              </Tabs>
            </div>
            {(tab === 'orderHistory' || tab === 'tradeHistory') && (
              <TitleSecondRowContainer>
                <TitleButton
                  size="small"
                  variant={`outlined`}
                  isActive={activeDateButton === '1Day'}
                  secondary={secondary}
                  onClick={() => this.onDateButtonClick('1Day')}
                >
                  1 Day
                </TitleButton>
                <TitleButton
                  size="small"
                  variant={`outlined`}
                  isActive={activeDateButton === '1Week'}
                  secondary={secondary}
                  onClick={() => this.onDateButtonClick('1Week')}
                >
                  1 Week
                </TitleButton>
                <TitleButton
                  size="small"
                  variant={`outlined`}
                  isActive={activeDateButton === '1Month'}
                  secondary={secondary}
                  onClick={() => this.onDateButtonClick('1Month')}
                >
                  1 Month
                </TitleButton>
                <TitleButton
                  size="small"
                  variant={`outlined`}
                  isActive={activeDateButton === '3Month'}
                  secondary={secondary}
                  onClick={() => this.onDateButtonClick('3Month')}
                >
                  3 Month
                </TitleButton>
                <StyledWrapperForDateRangePicker
                  color={textColor}
                  background={theme.palette.primary.light}
                  fontFamily={fontFamily}
                  style={{ marginLeft: '18px' }}
                  zIndexPicker={200}
                  dateInputHeight={`24px`}
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
                <TitleButton size="small" variant={`outlined`}>
                  Search
                </TitleButton>
                <TitleButton
                  size="small"
                  variant={`outlined`}
                  onClick={this.onClearDateButtonClick}
                >
                  Clear
                </TitleButton>
              </TitleSecondRowContainer>
            )}
          </div>
        }
        data={{ body: getTableBody(this.state.tab) }}
        columnNames={getTableHead(this.state.tab)}
      />
    )
  }
}
