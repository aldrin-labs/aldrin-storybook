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


  // TODO get rid of data after checking
  // const coinData = [
  //   {
  //     coinValue: 9,
  //     coinValueSnapshot: 13.24,
  //     deltaPrice: -4.24,
  //     exchange: 'Binance',
  //     id: 3,
  //     isCustomAsset: false,
  //     minimalPercentageValue: undefined,
  //     percentSnapshot: '50.00000000',
  //     portfolioPerc: '17.97033041',
  //     price: 29.0362,
  //     symbol: 'BNB',
  //     _id: '5c3ef4a29f3b7e3ed7w03de0demo',
  //   },
  //   {
  //     coinValue: 10,
  //     coinValueSnapshot: 13.24,
  //     deltaPrice: -4.24,
  //     exchange: 'Binance',
  //     id: 8,
  //     isCustomAsset: false,
  //     minimalPercentageValue: undefined,
  //     percentSnapshot: '10',
  //     portfolioPerc: '67.97033041',
  //     price: 29.0362,
  //     symbol: 'BTB',
  //     _id: '5c3ef4a39f3b7e3ed7503de0demo',
  //   },
  // ]

  return isSectionChart ? (
    sectionDataProgress.map((datum) => {
      return (
        <Grid container style={{ marginBottom: '8px' }}>
          <GridFlex item lg={3} md={3} padding="0">
            <TypographyCustom style={{ marginLeft: '12px' }}>
              {datum.label}
            </TypographyCustom>
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
              value={`${datum.percentage}`}
            />
          </Grid>
          <GridFlex item lg={3} md={3} style={{ paddingLeft: '57px' }}>
            <TypographyCustom>{datum.percentage}%</TypographyCustom>
          </GridFlex>
        </Grid>
      )
    })
  ) : (
    <>
      {coinData.map((datum, index) => {
        return (
          <Grid container style={{ marginBottom: '4px' }}>
            <GridFlex item lg={3} md={3} padding="0">
              <IconCircle
                className="fa fa-circle"
                style={{
                  justifySelf: 'flex-start',
                  fontSize: '0.625rem',
                  margin: 'auto 10px auto 12px',
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
              <TypographyCustom style={{ marginLeft: '1px' }}>
                {datum.symbol}
              </TypographyCustom>
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

            <GridFlex item lg={3} md={3}>
              <TypographyCustom style={{ paddingLeft: '57px' }}>
                {datum.portfolioPerc !== '0'
                  ? Math.floor(datum.portfolioPerc)
                  : '0'}{' '}
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
            style={{ marginBottom: '4px', marginTop: '-26px', padding: '0' }}
          >
            <GridFlex item lg={3} md={3} padding="0">
              <IconCircle
                className="fa fa-circle"
                style={{
                  justifySelf: 'flex-start',
                  color: `#97C15C`,
                  fontSize: '10px',
                  margin: 'auto 10px auto 12px',
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
                width={`${otherCoinsPercentage}%`}
                variant="determinate"
                value={20}
              />
            </Grid>

            <GridFlex item lg={3} md={3} style={{ paddingLeft: '57px' }}>
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
