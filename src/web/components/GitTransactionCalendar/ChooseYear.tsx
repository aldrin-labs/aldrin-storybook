import React, { PureComponent } from 'react'
import moment from 'moment'

import { IProps } from './ChooseYear.types'

import {
  ChoosePeriodWrapper,
  ChoosePeriodButton,
  ChoosePeriodArrow,
} from '@sb/components/ChoosePeriod/ChoosePeriod.styles'

import SvgIcon from '@sb/components/SvgIcon'
import LongArrow from '@icons/LongArrow.svg'

class ChooseYear extends PureComponent<IProps> {
  render() {
    const { activeDateButton, onDateButtonClick } = this.props

    return (
      <ChoosePeriodWrapper>
        <ChoosePeriodArrow
          onClick={() =>
            onDateButtonClick(
              moment(`${activeDateButton}-01-01`)
                .subtract(1, 'years')
                .toDate()
            )
          }
        >
          <SvgIcon src={LongArrow} />
        </ChoosePeriodArrow>
        <ChoosePeriodButton>{activeDateButton}</ChoosePeriodButton>
        <ChoosePeriodArrow
          onClick={() => {
            if (moment().year() !== Number(activeDateButton)) {
              onDateButtonClick(
                moment(`${activeDateButton}-01-01`)
                  .add(1, 'years')
                  .toDate()
              )
            }
          }}
        >
          <SvgIcon
            src={LongArrow}
            style={{
              transform: 'rotate(180deg)',
            }}
          />
        </ChoosePeriodArrow>
      </ChoosePeriodWrapper>
    )
  }
}

export default ChooseYear
