import React from 'react'
import moment from 'moment'

import { getEndDate } from '../TradingTable.utils'
import { IProps, IState } from './OrderHistoryDataWrapper.types'
import OrderHistoryTable from './OrderHistoryTable'

export default class OrderHistoryDataWrapper extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {
    startDate: getEndDate('1Day'),
    endDate: moment().endOf('day'),
    focusedInput: null,
    activeDateButton: '1Day',
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
      marketType,
      canceledOrders,
      arrayOfMarketIds,
    } = this.props
    const { focusedInput, endDate, activeDateButton, startDate } = this.state

    const maximumDate = moment().endOf('day')
    const minimumDate = moment().subtract(3, 'years')

    return (
      <OrderHistoryTable
        {...{
          tab,
          tabIndex,
          selectedKey,
          show,
          marketType,
          canceledOrders,
          arrayOfMarketIds,
          handleTabChange,
          focusedInput,
          endDate,
          activeDateButton,
          startDate,
          maximumDate,
          minimumDate,
          onClearDateButtonClick: this.onClearDateButtonClick,
          onDateButtonClick: this.onDateButtonClick,
          onDatesChange: this.onDatesChange,
          onFocusChange: this.onFocusChange,
        }}
      />
    )
  }
}
