import React from 'react'
import dayjs from 'dayjs'

import { getStartDate } from '../TradingTable.utils'
import { IProps, IState } from './OrderHistoryDataWrapper.types'
import OrderHistoryTable from './OrderHistoryTable'

export default class OrderHistoryDataWrapper extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {
    page: 0,
    perPage: 30,
    startDate: getStartDate('1Day'),
    endDate: dayjs().endOf('day'),
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
        startDate: getStartDate(stringDate),
        endDate: dayjs().endOf('day'),
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
    startDate: typeof dayjs | null
    endDate: typeof dayjs | null
  }) => this.setState({ startDate, endDate })

  onFocusChange = (focusedInput: string) => this.setState({ focusedInput })

  render() {
    const {
      tab,
      show,
      keys,
      handleTabChange,
      selectedKey,
      marketType,
      canceledOrders,
      currencyPair,
      arrayOfMarketIds,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
    } = this.props

    const {
      page,
      perPage,
      focusedInput,
      endDate,
      activeDateButton,
      startDate,
      allKeys,
      specificPair,
    } = this.state

    const maximumDate = dayjs().endOf('day')
    const minimumDate = dayjs().subtract(3, 'year')

    return (
      <OrderHistoryTable
        {...{
          tab,
          selectedKey,
          show,
          page,
          keys,
          perPage,
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
