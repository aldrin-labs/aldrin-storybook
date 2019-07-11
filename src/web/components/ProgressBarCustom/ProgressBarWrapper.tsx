import React from 'react'
import ProgressBar from './ProgressBar'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import {
  GridFlex,
  LinearProgressCustom,
  TypographyCustom,
  IconCircle,
} from './ProgressBar.styles'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import ProgressAccordion from '../ProgressAccordion/ProgressAccordion'
import { getCircleSymbol } from '../AddCircleIcon/AddCircleIcon'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: '#00695c',
  },
  linearColorPrimary: {
    backgroundColor: '#b2dfdb',
  },
})

function ProgressBarWrapper(props) {
  const {
    sectionDataProgress,
    coinData,
    otherCoinData,
    otherCoinsPercentage,
    isSectionChart,
    classes,
  } = props

  // const sectionData = false

  // return null
  // return coinData.map(coin => {
  //   <TypographyCustom>{coin.id}</TypographyCustom>
  // })

  return isSectionChart ? (
    sectionDataProgress.map((datum) => {
      return (
        <Grid container style={{ marginBottom: '8px' }}>
          <GridFlex item lg={3} md={3} padding="0 0 0 20px">
            <TypographyCustom>{datum.label}</TypographyCustom>
          </GridFlex>
          <Grid
            item
            lg={6}
            md={6}
            style={{ background: '#E7ECF3', borderRadius: '35px' }}
          >
            <LinearProgressCustom
              color={datum.color}
              height="20px"
              width={`${datum.percentage}%`}
              variant="determinate"
              value={20}
            />
          </Grid>
          <GridFlex item lg={3} md={3} justify="center">
            <TypographyCustom>{datum.percentage}%</TypographyCustom>
          </GridFlex>
        </Grid>
      )
    })
  ) : (
    <>
      {coinData.map((datum, index) => {
        return (
          <Grid container style={{ marginBottom: '8px' }}>
            <GridFlex item lg={3} md={3} padding="0 0 0 20px">
              {/*<TypographyCustom> {getCircleSymbol(datum.coin, data)} </TypographyCustom> */}
              <IconCircle
                className="fa fa-circle"
                style={{
                  justifySelf: 'flex-start',
                  fontSize: '10px',
                  margin: 'auto 3px auto 12px',
                  color: `${
                    index === 0
                      ? '#F29C38'
                      : index === 1
                      ? '#4152AF'
                      : index === 2
                      ? '#DEDB8E'
                      : '#97C15C'
                  }`,
                }}
              />
              <TypographyCustom>{datum.symbol}</TypographyCustom>
            </GridFlex>
            <Grid
              item
              lg={6}
              md={6}
              style={{
                background: '#E7ECF3',
                borderRadius: '35px',
                height: '12px',
                marginTop: '2px',
              }}
            >
              <LinearProgressCustom
                height="12px"
                marginTop="2px"
                width={`${datum.portfolioPerc}%`}
                variant="determinate"
                value={20}
                color={
                  index === 0
                    ? '#F29C38'
                    : index === 1
                    ? '#4152AF'
                    : index === 2
                    ? '#DEDB8E'
                    : '#97C15C'
                }
              />
            </Grid>

            <GridFlex item lg={3} md={3} justify="center">
              <TypographyCustom>
                {datum.portfolioPerc !== '0'
                  ? datum.portfolioPerc.substr(
                      0,
                      datum.portfolioPerc.indexOf('.')
                    )
                  : '0'}
                %
              </TypographyCustom>
            </GridFlex>
          </Grid>
        ) // end of return
      })}
      {otherCoinData ? (
        <ProgressAccordion otherCoinData={otherCoinData}>
          <Grid
            container
            style={{ marginBottom: '8px', marginTop: '-26px', padding: '0' }}
          >
            <GridFlex item lg={3} md={3} padding="0 0 0 20px">
              <IconCircle
                className="fa fa-circle"
                style={{
                  justifySelf: 'flex-start',
                  color: `#97C15C`,
                  fontSize: '10px',
                  margin: 'auto 3px auto 12px',
                }}
              />
              <TypographyCustom> other </TypographyCustom>
              <ExpandMoreIcon
                style={{
                  color: '#ABBAD1',
                  padding: '0',
                  width: '20px',
                  height: '20px',
                }}
              />
            </GridFlex>
            <Grid
              item
              lg={6}
              md={6}
              style={{
                background: '#E7ECF3',
                borderRadius: '35px',
                height: '12px',
                marginTop: '2px',
              }}
            >
              <LinearProgressCustom
                color="#97C15C"
                height="12px"
                marginTop="2px"
                width={`${20}%`} //{`${otherCoinsPercentage}%`}
                variant="determinate"
                value={20}
              />
            </Grid>

            <GridFlex item lg={3} md={3} justify="center">
              <TypographyCustom>{otherCoinsPercentage}%</TypographyCustom>
            </GridFlex>
          </Grid>
        </ProgressAccordion>
      ) : (
        ' '
      )}
    </>
  )
}

export default withStyles(styles)(ProgressBarWrapper)
