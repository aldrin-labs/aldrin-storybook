import React from 'react'
import moment from 'moment'

import { getEndDate } from '../TradingTable.utils'
import { IProps, IState } from './TradeHistoryDataWrapper.types'
import TradeHistoryTable from './TradeHistoryTable'

export default class OrderHistoryDataWrapper extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {
    startDate: null,
    endDate: null,
    focusedInput: null,
    activeDateButton: null,
  }

  onSearchDateButtonClick = async () => {
    // TODO: there should be mutation for search
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
        startDate: moment().endOf('day'),
        endDate: getEndDate(stringDate),
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
    const { tab, tabIndex, show, handleTabChange } = this.props
    const { focusedInput, endDate, activeDateButton, startDate } = this.state

    const maximumDate = moment().endOf('day')
    const minimumDate = moment().subtract(3, 'years')

    return (
      <TradeHistoryTable
        {...{
          tab,
          tabIndex,
          show,
          handleTabChange,
          focusedInput,
          endDate,
          activeDateButton,
          startDate,
          maximumDate,
          minimumDate,
          onSearchDateButtonClick: this.onSearchDateButtonClick,
          onClearDateButtonClick: this.onClearDateButtonClick,
          onDateButtonClick: this.onDateButtonClick,
          onDatesChange: this.onDatesChange,
          onFocusChange: this.onFocusChange,
        }}
      />
    )
  }
}
