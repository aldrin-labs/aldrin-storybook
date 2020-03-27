import React, { PureComponent } from 'react'
import { Grid } from '@material-ui/core'
import dayjs from 'dayjs'

import { IProps } from './ChooseYear.types'

import {
  ChoosePeriodButton,
  ChoosePeriodArrow,
  ChooseYearWrapper,
  ChooseYearTypography,
} from '@sb/components/ChoosePeriod/ChoosePeriod.styles'

import SvgIcon from '@sb/components/SvgIcon'
import LongArrow from '@icons/LongArrow.svg'

class ChooseYear extends PureComponent<IProps> {
  render() {
    const { activeDateButton, onDateButtonClick } = this.props

    return (
      <ChooseYearWrapper container alignItems="center" justify="center" direction="column">
        <ChooseYearTypography>calendar show data for</ChooseYearTypography>
        <Grid container justify="center" alignItems="center">
          <ChoosePeriodArrow
            onClick={() =>
              onDateButtonClick(
                dayjs(`${activeDateButton}-01-01`)
                  .subtract(1, 'year')
                  .toDate()
              )
            }
          >
            <SvgIcon src={LongArrow} />
          </ChoosePeriodArrow>
          <ChoosePeriodButton
            style={{
              width: '30%',
              borderColor: '#165be0',
              color: '#165be0',
              fontWeight: 'bold',
            }}
          >
            {activeDateButton}
          </ChoosePeriodButton>
          <ChoosePeriodArrow
            onClick={() => {
              if (dayjs().year() !== Number(activeDateButton)) {
                onDateButtonClick(
                  dayjs(`${activeDateButton}-01-01`)
                    .add(1, 'year')
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
        </Grid>
      </ChooseYearWrapper>
    )
  }
}

export default ChooseYear
