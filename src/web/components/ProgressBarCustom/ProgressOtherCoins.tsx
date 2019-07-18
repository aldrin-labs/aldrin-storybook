import React from 'react'
import { Grid } from '@material-ui/core'
import {
  GridFlex,
  LinearProgressCustom,
  TypographyCustom,
  IconCircle,
} from './ProgressBar.styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import ProgressAccordion from '@sb/components/ProgressAccordion/ProgressAccordion'

export default function ProgressOtherCoins({
  otherCoinData,
  otherCoinsPercentage,
}) {
  return (
    <ProgressAccordion otherCoinData={otherCoinData}>
      <Grid
        container
        style={{
          marginBottom: '4px',
          marginTop: '-26px',
          padding: '0',
        }}
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
            value={0}
          />
        </Grid>

        <GridFlex item lg={3} md={3} style={{ paddingLeft: '43px' }}>
          <TypographyCustom>{otherCoinsPercentage}%</TypographyCustom>
        </GridFlex>
      </Grid>
    </ProgressAccordion>
  )
}
