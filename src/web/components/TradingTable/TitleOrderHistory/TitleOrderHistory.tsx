import React from 'react'
import moment from 'moment'


import { getEndDate } from '../TradingTable.utils'
import { IState, IProps } from './TitleOrderHistory.types'
import TradingTitle from '../TradingTitle/TradingTitle'

export default class TitleOrderHistory extends React.PureComponent<
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
        startDate: moment(),
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
    const { activeDateButton, startDate, endDate, focusedInput } = this.state

    const {
      minimumDate,
      maximumDate,
    } = this.props

    return (
      <TradingTitle
        {...{
          startDate,
          endDate,
          focusedInput,
          activeDateButton,
          minimumDate,
          maximumDate,
          onDateButtonClick: this.onDateButtonClick,
          onDatesChange: this.onDatesChange,
          onFocusChange: this.onFocusChange,
          onSearchDateButtonClick: this.onSearchDateButtonClick,
          onClearDateButtonClick: this.onClearDateButtonClick,
        }}
      />
    )
  }
}
