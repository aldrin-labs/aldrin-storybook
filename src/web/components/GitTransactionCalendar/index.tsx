import React, { Component } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    //width: '100%',
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
    lineHeight: '23px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    //padding: '0 0 10px 40px'
  },
  githubZero: { fill: '#EEE' },
  githubOne: { fill: '#E0E5EC' },
  githubTwo: { fill: '#B3C8EE' },
  githubThree: { fill: '#7EA3EA' },
  githubFourth: { fill: '#165BE0' },
})

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

    console.log('Date: ', today)
    return (
      <CalendarHeatmap
        className={this.props.classes.root}
        // startDate={'Wed Jul 24 2018 12:25:22 GMT+0500'}
        // endDate={'Wed Jul 24 2019 12:25:22 GMT+0500'}
        startDate={shiftDate(today, -200)}
        endDate={today}
        values={
          randomValues
          // [
          //   { date: '2016-01-01' },
          //   { date: '2016-01-22' },
          //   { date: '2016-01-30' },
          // ]
        }
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
        onClick={(value) =>
          alert(`Clicked on value with count: ${value.count}`)
        }
        horizontal={false}
        // gutterSize={255}
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
        // showOutOfRangeDays={true}
        titleForValue={(value) => `Date is ${value.date}`}
        tooltipDataAttrs={(value) => {
          return { 'data-tooltip': 'Tooltip: ' + value.date }
        }}
      />
    )
  }
}

export default withStyles(styles)(GitTransactionCalendar)
