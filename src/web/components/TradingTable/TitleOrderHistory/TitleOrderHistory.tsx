import React from 'react'
import moment from 'moment'
import { DateRangePicker } from 'react-dates'

import { StyledWrapperForDateRangePicker } from '@sb/styles/cssUtils'

import { getEndDate } from '../TradingTable.utils'
import { TitleSecondRowContainer, TitleButton } from '../TradingTable.styles'

import { IState, IProps } from './TitleOrderHistory.types'

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
      secondary,
      fontFamily,
      textColor,
      primaryLight,
      show,
    } = this.props

    if (!show) {
      return null
    }

    return (
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
          background={primaryLight}
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
            startDate={startDate} // momentPropTypes.momentObj or null,
            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
            endDate={endDate} // momentPropTypes.momentObj or null,
            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
            onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
            displayFormat="MM-DD-YYYY"
          />
        </StyledWrapperForDateRangePicker>
        <TitleButton
          size="small"
          variant={`outlined`}
          onClick={this.onSearchDateButtonClick}
        >
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
    )
  }
}
