import React, { PureComponent } from 'react'
import moment from 'moment'
import { createGlobalStyle } from 'styled-components'
import { client } from '@core/graphql/apolloClient'

import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import ChoosePeriod from '@sb/components/ChoosePeriod/ChoosePeriod'

import QueryRenderer from '@core/components/QueryRenderer'
import { getCalendarActions } from '@core/graphql/queries/portfolio/main/getCalendarActions'
import { IProps } from './Calendar.types'
import { getCalendarData, getMaxTransactions } from './Calendar.utils'
import {
  LEGEND_COLORS,
  HeatmapWrapper,
  LegendHeatmapSquare,
  LegendTypography,
  SquarePopup,
} from './Calendar.styles'

const StyleForCalendar = createGlobalStyle`
  // color dark #16253D
  // color grey #7284A0

  .DateRangePicker_picker.DateRangePicker_picker__portal {
    z-index: 1008;
  }

  .DateRangePicker_picker {
    font-family: DM Sans;

    .DayPicker__withBorder {
      border-radius: 1rem;
    }
    
    .DayPicker_weekHeader {
      color: #7284A0;
    }

    .DayPicker, .CalendarMonthGrid, .CalendarMonth {
      background: #F9FBFD;
    }

    .CalendarDay__default {
      border: 1px solid #e0e5ec;
    }

    .CalendarDay__default, 
    .CalendarMonth_caption {
      color: #16253D;
    }

    .CalendarDay__selected_span {
      color: #fff;
      background: #5c8cea;
      border: 1px solid #e0e5ec;
    }

    .CalendarDay__hovered_span,
    .CalendarDay__hovered_span:hover, 
    .CalendarDay__hovered_span:active {
      color: #fff;
      background: #A1BFF9;
      border: 1px solid #e0e5ec;
    }

    .CalendarDay__selected_span:hover, 
    .CalendarDay__selected_span:active {
      color: #fff;
      background: #4152AF;
      border: 1px solid #e0e5ec;
      border: 1px solid #e0e5ec;
    }

    & .CalendarDay__selected,
    .CalendarDay__selected:active,
    .CalendarDay__selected:hover {
      color: #fff;
      background: #0b1fd1;
      border: 1px solid #e0e5ec;
    }

    .CalendarDay__blocked_out_of_range,
     .CalendarDay__blocked_out_of_range:active,
      .CalendarDay__blocked_out_of_range:hover {
      color: #7284A0;
    }

    .DayPickerKeyboardShortcuts_show__bottomRight::before {
      border-right-color: #0b1fd1;
    }

    .DayPickerKeyboardShortcuts_show__bottomRight:hover::before {
      border-right-color: #4152AF;
    }

    .DayPickerNavigation_svg__horizontal {
      fill: #7284A0;
    }

    .DayPickerNavigation_button__default {
      border: 1px solid #e0e5ec;
    }
  }
`

const styles = (theme) => ({
  root: {
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
    lineHeight: '2rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  legendZero: { fill: LEGEND_COLORS.zero },
  legendOne: { fill: LEGEND_COLORS.one },
  legendTwo: { fill: LEGEND_COLORS.two },
  legendThree: { fill: LEGEND_COLORS.three },
  legendFour: { fill: LEGEND_COLORS.four },
})

class GitTransactionCalendar extends PureComponent<IProps> {
  constructor(props) {
    super(props)

    this.popupRef = React.createRef()
  }

  componentDidMount() {
    this.props.getCalendarActionsQueryRefetch()
  }

  render() {
    const {
      getCalendarActionsQuery,
      startDate,
      endDate,
      tradeOrderHistoryDate,
      onDatesChange,
      onFocusChange,
      onHeatmapDateClick,
      onDateButtonClick,
      activeDateButton,
      classes,
      wrapperRef,
      concreteDaySelected,
    } = this.props
    const maxTransactionsCount = getMaxTransactions(
      getCalendarActionsQuery.myPortfolios[0]
    )

    const { mappedActionsArray } = getCalendarData(
      getCalendarActionsQuery.myPortfolios[0],
      maxTransactionsCount,
      startDate
    )

    const maximumDate = moment().endOf('day')
    const minimumDate = moment().subtract(3, 'years')

    return (
      <HeatmapWrapper
        style={{
          paddingTop: '15px',
          paddingBottom: '5px',
        }}
      >
        <SquarePopup ref={this.popupRef} />

        <CalendarHeatmap
          className={classes.root}
          startDate={moment(+startDate).subtract(1, 'seconds')}
          endDate={moment(+endDate)}
          values={mappedActionsArray}
          gutterSize={3}
          classForValue={(value) => {
            return value ? classes[value.className] : 'empty-value'
          }}
          showWeekdayLabels={true}
          monthLabels={[
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ]}
          onClick={onHeatmapDateClick}
          onMouseOver={(e, value) => {
            const popupRef = this.popupRef.current
            const { x, y } = e.target.getBoundingClientRect()
            popupRef.style.display = 'block'
            popupRef.style.zIndex = 999
            popupRef.style.top = `${y - wrapperRef.current.offsetTop - 30}px`
            popupRef.style.left = `${x - wrapperRef.current.offsetLeft + 15}px`

            popupRef.textContent = value
              ? `${value.count} ${
                  value.count === 1 ? `action` : 'actions'
                } on ${moment(value.date).format('DD MMM, YYYY')}`
              : 'No data'
          }}
          onMouseLeave={() => {
            const popupRef = this.popupRef.current
            popupRef.style.display = 'none'
          }}
        />

        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          className="ChoosePeriodsBlock"
          style={{
            margin: '.75rem 0 2.5rem',
            padding: '0 1rem 0 0',
            marginTop: '-4%',
          }}
        >
          <Grid item>
            <ChoosePeriod
              isTableCalendar={true}
              {...{
                ...tradeOrderHistoryDate,
                concreteDaySelected,
                maximumDate,
                minimumDate,
                onFocusChange,
                onDatesChange,
                onDateButtonClick,
                activeDateButton,
              }}
            />
          </Grid>
          <Grid
            item
            alignItems="center"
            style={{
              width: 'auto',
              display: 'flex',
            }}
          >
            <LegendTypography>Less</LegendTypography>
            <LegendHeatmapSquare fill={LEGEND_COLORS.zero} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.one} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.two} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.three} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.four} />
            <LegendTypography>More</LegendTypography>
          </Grid>
        </Grid>
        <StyleForCalendar />
      </HeatmapWrapper>
    )
  }
}

const CalendarDataWrapper = ({ ...props }) => {
  let { startDate, endDate } = props
  const timezone = moment().format('ZZ')

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={GitTransactionCalendar}
      query={getCalendarActions}
      name={`getCalendarActionsQuery`}
      fetchPolicy="network-only"
      variables={{
        input: {
          timezone,
          startDate,
          endDate,
        },
      }}
      {...props}
      startDate={startDate}
      endDate={endDate}
    />
  )
}

export default withStyles(styles)(CalendarDataWrapper)
