import React from 'react'
import { Grid } from '@material-ui/core'
import {
  GridFlex,
  LinearProgressCustom,
  TypographyCustom,
  IconCircle,
} from './ProgressBar.styles'

import * as UTILS from '@core/utils/PortfolioRebalanceUtils'

export default function ProgressBarCoins({ datum, index }) {
  return (
    <Grid
      container
      style={{
        marginBottom: '4px',
      }}
    >
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
        <TypographyCustom
          style={{
            marginLeft: '1px',
          }}
        >
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
          value={0}
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
        <TypographyCustom
          style={{
            paddingLeft: '43px',
          }}
        >
          {datum.portfolioPerc !== '0'
            ? UTILS.preparePercentage(+datum.portfolioPerc)
            : '0 %'}
        </TypographyCustom>
      </GridFlex>
    </Grid>
  )
}
