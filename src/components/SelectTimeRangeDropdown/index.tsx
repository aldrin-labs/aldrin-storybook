import React, { Component } from 'react'

import { daysFromNow } from '../Utils/dateUtils'
import Selector from '../SimpleDropDownSelector'
import { IProps } from './types'

class DropDownMenu extends Component<IProps> {
  optionsMap: { [id: string]: any } = {
    lastWeek: () => ({
      startDate: daysFromNow(-7),
      endDate: daysFromNow(0),
    }),
    lastDay: () => ({
      startDate: daysFromNow(-1),
      endDate: daysFromNow(0),
    }),
    lastMonth: () => ({
      startDate: daysFromNow(-31),
      endDate: daysFromNow(0),
    }),
    threeMonths: () => ({
      startDate: daysFromNow(-92),
      endDate: daysFromNow(0),
    }),
    sixMonths: () => ({
      startDate: daysFromNow(-184),
      endDate: daysFromNow(0),
    }),
    lastYear: () => ({
      startDate: daysFromNow(-356),
      endDate: daysFromNow(0),
    }),
    testDates: () => ({
      startDate: 1531441380,
      endDate: 1531873380,
    }),
  }
  componentDidMount() {
    this.setDates(this.props.period)
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setDates(event.target.value)
  }

  setDates = (period: string) => {
    const { startDate, endDate } = this.optionsMap[period]()
    this.props.setPeriodToStore({
      correlationPeriod: period,
      correlationStartDate: startDate,
      correlationEndDate: endDate,
    })
  }

  render() {
    const { period, style } = this.props

    return (
      <Selector
        style={{
          alignSelf: 'center',
          height: '100%',
          width: '100%',
          ...style,
        }}
        name="correlationPeriod"
        id="correlationPeriod"
        value={period}
        handleChange={this.handleChange}
        options={[
          { value: 'lastDay', label: 'Last 24h' },
          { value: 'lastWeek', label: 'Last Week' },
          { value: 'lastMonth', label: 'Last Month' },
          { value: 'threeMonths', label: 'Last 3 Months' },
          { value: 'sixMonths', label: 'Last 6 Months' },
          { value: 'lastYear', label: 'Last Year' },
          // { value: 'testDates', label: 'Test Dates' },
        ]}
      />
    )
  }
}

export default DropDownMenu
