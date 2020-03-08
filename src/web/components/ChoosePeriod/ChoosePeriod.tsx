import React, { Component } from 'react'

import { DateRangePicker } from 'react-dates'
import { IProps } from './ChoosePeriod.types'
import {
  ChoosePeriodWrapper,
  ChoosePeriodTypography,
  ChoosePeriodButton,
  DatePickerWrapper,
} from './ChoosePeriod.styles'

const PERIODS = [
  { name: '1Day', label: '24H' },
  { name: '1Week', label: '7 days' },
  // { name: '2Weeks', label: '2W' },
  { name: '1Month', label: 'Month' },
  { name: '3Month', label: '3M' },
  { name: '6Months', label: '6M' },
]

class ChoosePeriod extends Component<IProps> {
  render() {
    const {
      focusedInput,
      onDatesChange,
      onFocusChange,
      onDateButtonClick,
      activeDateButton,

      startDate,
      endDate,
      minimumDate,
      maximumDate,

      // remove unneccessary styles if it's trade order history table calendar
      isTableCalendar,
      concreteDaySelected,
    } = this.props

    return (
      <ChoosePeriodWrapper
        isTableCalendar={isTableCalendar}
      >
        <DatePickerWrapper style={{ marginRight: '20px', background: '#fff' }}>
          <DateRangePicker
            withPortal={true}
            isOutsideRange={(date: any) =>
              date.isBefore(minimumDate, 'day') ||
              date.isAfter(maximumDate, 'day')
            }
            showDefaultInputIcon={true}
            customArrowIcon="-"
            inputIconPosition="after"
            startDate={startDate} // momentPropTypes.momentObj or null,
            startDateId="dateButtonId" // PropTypes.string.isRequired,
            endDate={endDate} // momentPropTypes.momentObj or null,
            endDateId="dateButtonId" // PropTypes.string.isRequired,
            onDatesChange={onDatesChange} // PropTypes.func.isRequired,
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={onFocusChange} // PropTypes.func.isRequired,
            displayFormat="MMM, DD, YYYY"
          />
        </DatePickerWrapper>

        {PERIODS.map(({ name, label }, index) => (
          <ChoosePeriodButton
            active={activeDateButton === name && !concreteDaySelected}
            key={index}
            onClick={() => {
              onDateButtonClick(name)
            }}
          >
            {label}
          </ChoosePeriodButton>
        ))}
      </ChoosePeriodWrapper>
    )
  }
}

export default ChoosePeriod
