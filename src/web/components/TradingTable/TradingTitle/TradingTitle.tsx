import React from 'react'
import { withTheme } from '@material-ui/styles'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { DateRangePicker } from 'react-dates'

import { StyledWrapperForDateRangePicker } from '@sb/styles/cssUtils'

import { TitleSecondRowContainer, TitleButton } from '../TradingTable.styles'

import { IProps } from './TradingTitle.types'
import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme()
export default class TradingTitle extends React.PureComponent<IProps> {
  render() {
    const {
      startDate,
      endDate,
      focusedInput,
      activeDateButton,
      minimumDate,
      maximumDate,
      onDateButtonClick,
      onDatesChange,
      onFocusChange,
      theme: {
        palette: {
          text: { primary },
        },
        typography: { fontFamily },
      },
    } = this.props

    return (
      <TitleSecondRowContainer>
        <TitleButton
          size="small"
          variant={`outlined`}
          isActive={activeDateButton === '1Day'}
          onClick={() => onDateButtonClick('1Day')}
        >
          24h
        </TitleButton>
        <TitleButton
          size="small"
          variant={`outlined`}
          isActive={activeDateButton === '1Week'}
          onClick={() => onDateButtonClick('1Week')}
        >
          week
        </TitleButton>
        <TitleButton
          size="small"
          variant={`outlined`}
          isActive={activeDateButton === '1Month'}
          onClick={() => onDateButtonClick('1Month')}
        >
          month
        </TitleButton>
        <TitleButton
          size="small"
          variant={`outlined`}
          isActive={activeDateButton === '3Month'}
          onClick={() => onDateButtonClick('3Month')}
          style={{ marginRight: '2rem' }}
        >
          3m
        </TitleButton>
        <StyledWrapperForDateRangePicker
          color={primary}
          fontFamily={fontFamily}
          fontSize={CSS_CONFIG.chart.content.fontSize}
          style={{
            paddingLeft: '2rem',
            borderLeft: '1px solid #e0e5ec',
            paddingRight: '2rem',
            borderRight: '1px solid #e0e5ec',
          }}
          zIndexPicker={200}
          dateInputHeight={`2.4rem`}
          dateInputPadding={`0 .5rem`}
          dateRangePadding={`0px`}
        >
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
            displayFormat="ll"
          />
        </StyledWrapperForDateRangePicker>
      </TitleSecondRowContainer>
    )
  }
}
