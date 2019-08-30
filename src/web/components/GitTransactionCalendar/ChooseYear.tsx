import React, { PureComponent } from 'react'
import moment from 'moment'

import {
  ChoosePeriodWrapper,
  ChoosePeriodButton,
} from '@sb/components/ChoosePeriod/ChoosePeriod.styles'

const PERIODS = ['2017', '2018', '2019', '2020'].map((num) => {
  return {
    name: moment([num]),
    label: num,
  }
})

class ChooseYear extends PureComponent {
  render() {
    const { activeDateButton, onDateButtonClick } = this.props

    return (
      <ChoosePeriodWrapper style={{ height: '6%' }}>
        {PERIODS.map(({ name, label }, index) => (
          <ChoosePeriodButton
            active={activeDateButton === label}
            key={index}
            onClick={() => onDateButtonClick(name)}
          >
            {label}
          </ChoosePeriodButton>
        ))}
      </ChoosePeriodWrapper>
    )
  }
}

export default ChooseYear
