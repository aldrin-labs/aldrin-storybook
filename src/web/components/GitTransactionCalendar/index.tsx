import React, { Component } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import styled from 'styled-components'
import 'react-calendar-heatmap/dist/styles.css'
import { Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
    lineHeight: '2rem',
    letterSpacing: '1px',
    textTransform: 'uppercase'
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
      font-size: .45rem;
    }
  }
`
const LegendTypography = styled(Typography)`
  font-size: .925rem;
  color: #16253d;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'DM Sans';
  font-weight: 600;
  margin: 0 .5rem;
`
const LegendHeatmapSquare = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  background-color: ${props => props.fill || 'black'};
  margin: 0 .175rem;
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
    const randomValues = getRange(366).map((index) => {
      return {
        date: shiftDate(today, -index),
        count: getRandomInt(0, 2),
      }
    })
    console.log(randomValues)

    return (
      <HeatmapWrapper>
        <CalendarHeatmap
          className={this.props.classes.root}
          // startDate={'Wed Jul 24 2018 12:25:22 GMT+0500'}
          // endDate={'Wed Jul 24 2019 12:25:22 GMT+0500'}
          startDate={shiftDate(today, -366)}
          endDate={today}
          values={randomValues}
          classForValue={(value) => {
            const { classes } = this.props

            if (!value) {
              return 'color-empty'
            }
            // return `color-github-${value.count}`
            switch(value.count) {
              case 0: return classes.githubZero
              case 1: return classes.githubOne
              case 2: return classes.githubTwo
              case 3: return classes.githubThree
              case 4: return classes.githubFourth
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

        <Grid container justify="flex-end" alignItems="center" style={{
          margin: '2rem 0 2.5rem',
          padding: '0 3rem'
        }}>
            <LegendTypography>Less</LegendTypography>
            <LegendHeatmapSquare fill={'#E0E5EC'}/>
            <LegendHeatmapSquare fill={'#8FB4EC'}/>
            <LegendHeatmapSquare fill={'#6FA0EB'}/>
            <LegendHeatmapSquare fill={'#5594F1'}/>
            <LegendHeatmapSquare fill={'#357AE1'}/>
            <LegendTypography>More</LegendTypography>
        </Grid>
      </HeatmapWrapper>
    )
  }
}

export default withStyles(styles)(GitTransactionCalendar)
