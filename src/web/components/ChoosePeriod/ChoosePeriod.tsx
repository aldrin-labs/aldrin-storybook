import React, { Component } from 'react'

import { DateRangePicker } from 'react-dates'
import {
  ChoosePeriodWrapper,
  ChoosePeriodButton,
  DatePickerWrapper,
} from './ChoosePeriod.styles'

const PERIODS = [
  { name: '1Day', label: '24H' },
  { name: '1Week', label: 'Week' },
  { name: '2Weeks', label: '2W' },
  { name: '1Month', label: 'Month' },
  { name: '3Months', label: '3MO' },
  { name: '6Monts', label: '6MO' },
]
class ChoosePeriod extends Component {
  render() {
    const {
      focusedInput,
      activeDateButton,
      onDateButtonClick,
      onDatesChange,
      onFocusChange,

      startDate,
      endDate,
      minimumDate,
      maximumDate,
    } = this.props

    return (
      <ChoosePeriodWrapper>
        {PERIODS.map(({ name, label }, index) => (
          <ChoosePeriodButton
            active={activeDateButton === name}
            key={index}
            onClick={() => onDateButtonClick(name)}
          >
            {label}
          </ChoosePeriodButton>
        ))}

        <DatePickerWrapper>
          <DateRangePicker
            withPortal={true}
            isOutsideRange={(date: any) =>
              date.isBefore(minimumDate, 'day') ||
              date.isAfter(maximumDate, 'day')
            }
            startDate={startDate} // momentPropTypes.momentObj or null,
            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
            endDate={endDate} // momentPropTypes.momentObj or null,
            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
            onDatesChange={onDatesChange} // PropTypes.func.isRequired,
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={onFocusChange} // PropTypes.func.isRequired,
            displayFormat="MM-DD-YYYY"
          />
        </DatePickerWrapper>
      </ChoosePeriodWrapper>
    )
  }
}

export default ChoosePeriod
