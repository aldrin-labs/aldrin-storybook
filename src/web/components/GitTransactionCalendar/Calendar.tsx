import React, { PureComponent } from 'react'
import moment from 'moment'

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
} from './Calendar.styles'

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
  render() {
    const {
      getCalendarActionsQuery,
      startDate,
      endDate,
      tradeOrderHistoryDate,
      onDatesChange,
      onFocusChange,
      onHeatmapDateClick,
      focusedInput,
      classes
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
      <HeatmapWrapper>
        <CalendarHeatmap
          className={classes.root}
          startDate={moment(+startDate).subtract(1, 'seconds')}
          endDate={moment(+endDate)}
          values={mappedActionsArray}
          gutterSize={3}
          classForValue={(value) =>
            value ? classes[value.className] : 'empty-value'
          }
          onClick={onHeatmapDateClick}
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
          titleForValue={(value) =>
            value
              ? `${value.count} ${
                  value.count === 1 ? `action` : 'actions'
                } on ${moment(value.date).format('DD MMM, YYYY')}`
              : 'No data'
          }
          tooltipDataAttrs={(value) =>
            value
              ? {
                  'data-tooltip': `${value.count} ${
                    value.count === 1 ? `action` : 'actions'
                  } on ${moment(value.date).format('DD MMM, YYYY')}`,
                }
              : { 'data-tooltip': 'No data' }
          }
        />

        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          style={{
            margin: '.75rem 0 2.5rem',
            padding: '0 3rem 0 0',
          }}
        >
          <Grid item>
            <ChoosePeriod
              isTableCalendar={true}
              {...{
                ...tradeOrderHistoryDate,
                maximumDate,
                minimumDate,
                onFocusChange,
                onDatesChange
              }}
            />
          </Grid>
          <Grid item alignItems="center" style={{
            width: 'auto',
            display: 'flex'
          }}>
            <LegendTypography>Less</LegendTypography>
            <LegendHeatmapSquare fill={LEGEND_COLORS.zero} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.one} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.two} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.three} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.four} />
            <LegendTypography>More</LegendTypography>
          </Grid>
        </Grid>
      </HeatmapWrapper>
    )
  }
}

const CalendarDataWrapper = ({ ...props }) => {
  let { startDate, endDate } = props

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
