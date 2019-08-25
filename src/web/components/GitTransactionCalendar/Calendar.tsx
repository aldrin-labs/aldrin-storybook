import React, { Component } from 'react'
import moment from 'moment'

import CalendarHeatmap from 'react-calendar-heatmap'
import styled from 'styled-components'
import 'react-calendar-heatmap/dist/styles.css'
import { Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { getCalendarActions } from '@core/graphql/queries/portfolio/main/getCalendarActions'

const styles = (theme) => ({
  root: {
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
    lineHeight: '2rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  githubZero: { fill: '#E0E5EC' },
  githubOne: { fill: '#8FB4EC' },
  githubTwo: { fill: '#6FA0EB' },
  githubThree: { fill: '#5594F1' },
  githubFourth: { fill: '#357AE1' },
})

const HeatmapWrapper = styled.div`
  margin-bottom: 1.25rem;

  .react-calendar-heatmap-month-label,
  .react-calendar-heatmap .react-calendar-heatmap-small-text {
    font-family: 'DM Sans', sans-serif;
    fill: #16253d;
    font-size: 0.825rem;
  }

  .react-calendar-heatmap .react-calendar-heatmap-small-text {
    font-size: 0.575rem;
  }

  @media only screen and (min-width: 2560px) {
    .react-calendar-heatmap-month-label,
    .react-calendar-heatmap .react-calendar-heatmap-small-text {
      font-size: 0.45rem;
    }
  }
`
const LegendTypography = styled(Typography)`
  font-size: 0.925rem;
  color: #16253d;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'DM Sans';
  font-weight: 600;
  margin: 0 0.5rem;
`
const LegendHeatmapSquare = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  background-color: ${(props) => props.fill || 'black'};
  margin: 0 0.175rem;
`

class GitTransactionCalendar extends Component {
  shouldComponentUpdate(nextProps: any) {
    const { actions, refetch } = this.props

    if (
      actions &&
      actions.myPortfolios &&
      actions.myPortfolios[0].name !== nextProps.actions.myPortfolios[0].name &&
      nextProps.actions &&
      nextProps.actions.myPortfolios
    ) {
      refetch()
    }

    return true
    // if (
    //   actions &&
    //   actions.myPortfolios &&
    //   actions.myPortfolios[0].name !==
    //     nextProps.myTrades.myPortfolios[0].name &&
    //   nextProps.myTrades &&
    //   nextProps.myTrades.myPortfolios
    // ) {
    //   refetch()
    // }
  }

  render() {
    const { actions } = this.props

    const shiftDate = (date, numDays) => {
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate() + numDays)
      return newDate
    }

    const getRange = (count) => {
      return Array.from({ length: count }, (_, i) => i)
    }

    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    let lastDayOfYear = moment().dayOfYear(366)
    if (
      lastDayOfYear.year() ===
      Number(
        moment()
          .add(1, 'years')
          .format('YYYY')
      )
    ) {
      lastDayOfYear = 365
    } else {
      lastDayOfYear = 366
    }

    const mappedActionsArray = []
    const actionsByDate = actions.myPortfolios
      ? actions.myPortfolios[0].portfolioActionsByDay.actionsByDay
      : []
    for (let i = 0; i < lastDayOfYear; i++) {
      let actionByDay = null
      actionsByDate.forEach((action) => {
        if (action._id === i) {
          return (actionByDay = action)
        }
      })

      if (actionByDay) {
        mappedActionsArray.push({
          date: moment()
            .dayOfYear(actionByDay._id)
            .toDate(),
          count: actionByDay.transactionsCount,
        })
      } else {
        mappedActionsArray.push({
          date: moment()
            .dayOfYear(i)
            .toDate(),
          count: 0,
        })
      }
    }

    const maxTransactionsCount = actionsByDate.reduce(
      (max, { transactionsCount }) =>
        transactionsCount > max ? transactionsCount : max,
      0
    )
    const squareColorsRange = [
      {
        range: [0, 0],
        className: 'githubZero',
      },
      {
        range: [1, Math.floor(maxTransactionsCount / 4)],
        className: 'githubOne',
      },
      {
        range: [
          Math.ceil(maxTransactionsCount / 4),
          Math.floor(maxTransactionsCount / 2),
        ],
        className: 'githubTwo',
      },
      {
        range: [
          Math.ceil(maxTransactionsCount / 2),
          Math.floor(maxTransactionsCount / 1.33333),
        ],
        className: 'githubThree',
      },
      {
        range: [
          Math.ceil(maxTransactionsCount / 1.33333),
          maxTransactionsCount,
        ],
        className: 'githubFourth',
      },
    ]

    return (
      <HeatmapWrapper>
        <CalendarHeatmap
          className={this.props.classes.root}
          // startDate={'Wed Jul 24 2018 12:25:22 GMT+0500'}
          // endDate={'Wed Jul 24 2019 12:25:22 GMT+0500'}
          startDate={moment().startOf('year')}
          endDate={moment().endOf('year')}
          values={mappedActionsArray}
          classForValue={(value) => {
            const { classes } = this.props

            if (!value) {
              return 'color-empty'
            }

            for (let i = 0; i < squareColorsRange.length; i++) {
              const { range, className } = squareColorsRange[i]
              if (value.count >= range[0] && value.count <= range[1]) {
                return classes[className]
              }
            }
          }}
          tooltipDataAttrs={(value) => {
            return {
              'data-tip': `${value.date
                .toISOString()
                .slice(0, 10)} has count: ${value.count}`,
            }
          }}
          onClick={
            (value) => {}
            //alert(`Clicked on value with count: ${value.count}`)
          }
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
          //titleForValue={value => `Date is ${value.date}`}
          tooltipDataAttrs={(value) => {
            return { 'data-tooltip': 'Tooltip: ' + value.date }
          }}
          // showOutOfRangeDays={true}
        />

        <Grid
          container
          justify="flex-end"
          alignItems="center"
          style={{
            margin: '2rem 0 2.5rem',
            padding: '0 3rem',
          }}
        >
          <LegendTypography>Less</LegendTypography>
          <LegendHeatmapSquare fill={'#E0E5EC'} />
          <LegendHeatmapSquare fill={'#8FB4EC'} />
          <LegendHeatmapSquare fill={'#6FA0EB'} />
          <LegendHeatmapSquare fill={'#5594F1'} />
          <LegendHeatmapSquare fill={'#357AE1'} />
          <LegendTypography>More</LegendTypography>
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
      withOutSpinner={true}
      query={getCalendarActions}
      name={`actions`}
      fetchPolicy="network-only"
      variables={{
        input: {
          startDate,
          endDate,
        },
      }}
      {...props}
    />
  )
}

export default withStyles(styles)(CalendarDataWrapper)
