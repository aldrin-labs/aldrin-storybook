import React from 'react'
import dayjs from 'dayjs'

import { getStartDate } from '@sb/components/TradingTable/TradingTable.utils'
import { IProps, IState } from './StrategiesHistoryDataWrapper.types'
import StrategiesHistoryTable from './StrategiesHistoryTable'

export default class StrategiesHistoryDataWrapper extends React.PureComponent<
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
      theme,
      tabIndex,
      show,
      keys,
      allKeys,
      specificPair,
      handleTabChange,
      selectedKey,
      currencyPair,
      marketType,
      canceledOrders,
      handlePairChange,
      arrayOfMarketIds,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      handleToggleSpecificPair,
      handleToggleAllKeys,
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
    } = this.state

    const maximumDate = dayjs().endOf('day')
    const minimumDate = dayjs().subtract(3, 'year')

    return (
      <StrategiesHistoryTable
        {...{
          tab,
          tabIndex,
          page,
          keys,
          theme,
          perPage,
          selectedKey,
          show,
          marketType,
          canceledOrders,
          currencyPair,
          arrayOfMarketIds,
          handlePairChange,
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
          handleToggleSpecificPair,
          handleToggleAllKeys,
        }}
      />
    )
  }
}
