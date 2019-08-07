import React, { Component } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import styled from 'styled-components'
import 'react-calendar-heatmap/dist/styles.css'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
    lineHeight: '23px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  githubZero: { fill: '#EEE' },
  githubOne: { fill: '#E0E5EC' },
  githubTwo: { fill: '#B3C8EE' },
  githubThree: { fill: '#7EA3EA' },
  githubFourth: { fill: '#165BE0' },
})

const HeatmapWrapper = styled.div`
  .react-calendar-heatmap-month-label,
  .react-calendar-heatmap .react-calendar-heatmap-small-text {
    font-family: 'DM Sans', sans-serif;
    text-transform: uppercase;
    fill: #7284a0;
    font-size: 0.75rem;
  }

  .react-calendar-heatmap .react-calendar-heatmap-small-text {
    font-size: 0.575rem;
  }
`

class GitTransactionCalendar extends Component {
  render() {
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

    const today = new Date()
    const randomValues = getRange(200).map((index) => {
      return {
        date: shiftDate(today, -index),
        count: getRandomInt(1, 3),
      }
    })
    console.log(randomValues)

    return (
      <HeatmapWrapper>
        <CalendarHeatmap
          className={this.props.classes.root}
          // startDate={'Wed Jul 24 2018 12:25:22 GMT+0500'}
          // endDate={'Wed Jul 24 2019 12:25:22 GMT+0500'}
          startDate={shiftDate(today, -200)}
          endDate={today}
          values={randomValues}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty'
            }
            // return `color-github-${value.count}`
            return value.count === 1
              ? this.props.classes.githubOne
              : value.count === 2
              ? this.props.classes.githubTwo
              : value.count === 3
              ? this.props.classes.githubThree
              : this.props.classes.githubThree
          }}
          tooltipDataAttrs={(value) => {
            return {
              'data-tip': `${value.date
                .toISOString()
                .slice(0, 10)} has count: ${value.count}`,
            }
          }}
          showWeekdayLabels={true}
          onClick={
            (value) => {}
            //alert(`Clicked on value with count: ${value.count}`)
          }
          horizontal={false}
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
      </HeatmapWrapper>
    )
  }
}

export default withStyles(styles)(GitTransactionCalendar)
