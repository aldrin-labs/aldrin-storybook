import React from 'react'
import moment from 'moment'
import { withTheme } from '@material-ui/styles'
import { Tabs, Tab } from '@material-ui/core'
import { Table } from '@sb/components'
import { StyledWrapperForDateRangePicker } from '@sb/styles/cssUtils'

import { TitleSecondRowContainer, TitleButton } from './TradingTable.styles'
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
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

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

@withTheme()
export default class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabValue: 0,
    tab: 'openOrders',
    startDate: null,
    endDate: null,
    focusedInput: null,
  }

  onDatesChange = ({ startDate, endDate }) =>
    this.setState({ startDate, endDate })

  onFocusChange = (focusedInput) => this.setState({ focusedInput })

  handleTabChange = (e, tabValue) => {
    this.setState({
      tabValue,
      tab: tradingTableTabConfig[tabValue],
    })
  }

  render() {
    const { tab } = this.state
    const { theme } = this.props
    const textColor: string = theme.palette.text.primary
    const fontFamily = theme.typography.fontFamily
    const maximumDate = moment()
    const minimumDate = moment().subtract(3, 'years')

    return (
      <Table
        withCheckboxes={false}
        title={
          <div>
            <div>
              <Tabs
                value={this.state.tabValue}
                onChange={this.handleTabChange}
                indicatorColor="secondary"
                textColor="primary"
              >
                <Tab label="Open orders" />
                <Tab label="Order history" />
                <Tab label="Trade history" />
                <Tab label="Funds" />
              </Tabs>
            </div>
            {(tab === 'orderHistory' || tab === 'tradeHistory') && (
              <TitleSecondRowContainer>
                <TitleButton size={`small`} variant={`outlined`}>
                  1 Day
                </TitleButton>
                <TitleButton size={`small`} variant={`outlined`}>
                  1 Week
                </TitleButton>
                <TitleButton size={`small`} variant={`outlined`}>
                  1 Month
                </TitleButton>
                <TitleButton size={`small`} variant={`outlined`}>
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
                <TitleButton size={`small`} variant={`outlined`}>
                  Search
                </TitleButton>
                <TitleButton size={`small`} variant={`outlined`}>
                  Clear
                </TitleButton>
              </TitleSecondRowContainer>
            )}
          </div>
        }
        data={{ body: getTableBody(this.state.tab) }}
        columnNames={getTableHead(this.state.tab)}

        // actions={[
        //     {
        //       id: '1',
        //       icon: <MoreVertIcon />,
        //       onClick: action('1'),
        //       color: 'primary',
        //     },
        // ]}
        // actions={[
        //   {
        //     id: '1',
        //     icon: <MoreVertIcon />,
        //     onClick: action('1'),
        //     color: 'primary',
        //   },
        //   {
        //     id: '2',
        //     icon: <MoreVertIcon />,
        //     onClick: action('2'),
        //   },
        // ]}
      />
    )
  }
}
