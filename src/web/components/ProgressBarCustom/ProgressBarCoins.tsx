import React from 'react'
import { Grid, withWidth } from '@material-ui/core'
import {
  GridFlex,
  TypographyCustom,
} from './ProgressBar.styles'

import { GridProgressBarContainer, IconCircle, LinearProgressCustom } from '@sb/styles/cssUtils'

import * as UTILS from '@core/utils/PortfolioRebalanceUtils'

function ProgressBarCoins({ datum, index }) {
  return (
    <Grid
      container
      style={{
        marginBottom: '.75rem',
      }}
    >
      <GridFlex item lg={3} md={3} padding="0">
        <IconCircle
          className="fa fa-circle"
          style={{
            justifySelf: 'flex-start',
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
      <GridProgressBarContainer
        item
        lg={6}
        md={6}
        style={{
          background: '#E7ECF3',
          borderRadius: '35px',
          marginTop: '2px',
        }}
      >
        <LinearProgressCustom
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
      </GridProgressBarContainer>

      <GridFlex item lg={3} md={3} style={{ justifyContent: 'center' }}>
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

export default ProgressBarCoins
