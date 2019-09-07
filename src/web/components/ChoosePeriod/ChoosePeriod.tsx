import React, { Component } from 'react'

import { DateRangePicker } from 'react-dates'
import {
  ChoosePeriodWrapper,
  ChoosePeriodTypography,
  DatePickerWrapper,
} from './ChoosePeriod.styles'

class ChoosePeriod extends Component {
  render() {
    const {
      focusedInput,
      onDatesChange,
      onFocusChange,

      startDate,
      endDate,
      minimumDate,
      maximumDate,

      // remove unneccessary styles if it's trade order history table calendar
      isTableCalendar
    } = this.props

    return (
      <ChoosePeriodWrapper isTableCalendar={isTableCalendar} style={{ height: '10%' }}>
        <ChoosePeriodTypography>Selected period</ChoosePeriodTypography>

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
