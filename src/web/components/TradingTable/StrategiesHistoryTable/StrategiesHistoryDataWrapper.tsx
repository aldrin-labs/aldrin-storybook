import React from 'react'
import moment from 'moment'

import { getEndDate } from '../TradingTable.utils'
import { IProps, IState } from './TradeHistoryDataWrapper.types'
import StrategiesHistoryTable from './StrategiesHistoryTable'

export default class StrategiesHistoryDataWrapper extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {
    page: 0,
    perPage: 30,
    startDate: getEndDate('1Day'),
    endDate: moment().endOf('day'),
    focusedInput: null,
    activeDateButton: '1Day',
    allKeys: true,
    specificPair: false,
  }

  handleToggleAllKeys = () => {
    this.setState((prev) => ({ allKeys: !prev.allKeys }))
  }

  handleToggleSpecificPair = () => {
    const { currencyPair } = this.props

    this.setState((prev) => ({
      specificPair: !prev.specificPair ? currencyPair : false,
    }))
  }

  handleChangePage = (page: number) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ perPage: +event.target.value })
  }

  onClearDateButtonClick = () => {
    this.setState({
      startDate: null,
      endDate: null,
      focusedInput: null,
      activeDateButton: null,
    })
  }

  onDateButtonClick = async (stringDate: string) => {
    this.setState(
      {
        activeDateButton: stringDate,
        startDate: getEndDate(stringDate),
        endDate: moment().endOf('day'),
      },
      () => {
        // TODO: there should be mutation for search:
      }
    )
  }

  onDatesChange = ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment | null
    endDate: moment.Moment | null
  }) => this.setState({ startDate, endDate })

  onFocusChange = (focusedInput: string) => this.setState({ focusedInput })

  render() {
    const {
      tab,
      tabIndex,
      show,
      handleTabChange,
      selectedKey,
      currencyPair,
      marketType,
      canceledOrders,
      arrayOfMarketIds,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
    } = this.props

    const {
      focusedInput,
      endDate,
      activeDateButton,
      startDate,
      page,
      perPage,
      allKeys,
      specificPair,
    } = this.state

    const maximumDate = moment().endOf('day')
    const minimumDate = moment().subtract(3, 'years')

    return (
      <StrategiesHistoryTable
        {...{
          tab,
          tabIndex,
          page,
          perPage,
          selectedKey,
          show,
          marketType,
          canceledOrders,
          currencyPair,
          arrayOfMarketIds,
          handleTabChange,
          focusedInput,
          endDate,
          activeDateButton,
          startDate,
          maximumDate,
          minimumDate,
          allKeys,
          specificPair,
          showAllPositionPairs,
          showAllOpenOrderPairs,
          showAllSmartTradePairs,
          showPositionsFromAllAccounts,
          showOpenOrdersFromAllAccounts,
          showSmartTradesFromAllAccounts,
          handleChangePage: this.handleChangePage,
          handleChangeRowsPerPage: this.handleChangeRowsPerPage,
          onClearDateButtonClick: this.onClearDateButtonClick,
          onDateButtonClick: this.onDateButtonClick,
          onDatesChange: this.onDatesChange,
          onFocusChange: this.onFocusChange,
          handleToggleAllKeys: this.handleToggleAllKeys,
          handleToggleSpecificPair: this.handleToggleSpecificPair,
        }}
      />
    )
  }
}
