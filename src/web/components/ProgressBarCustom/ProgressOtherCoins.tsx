import React from 'react'
import { Grid } from '@material-ui/core'
import {
  GridFlex,
  TypographyCustom,
} from './ProgressBar.styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import ProgressAccordion from '@sb/components/ProgressAccordion/ProgressAccordion'
import * as UTILS from '@core/utils/PortfolioRebalanceUtils'
import { GridProgressBarContainer, IconCircle, LinearProgressCustom} from '@sb/styles/cssUtils'

function ProgressOtherCoins({
  otherCoinData,
  otherCoinsPercentage,
  isPanelExpanded,
  onChangeExpandedPanel,
  width,
}) {
  return (
    <ProgressAccordion
      otherCoinData={otherCoinData}
      isPanelExpanded={isPanelExpanded}
      onChangeExpandedPanel={onChangeExpandedPanel}
    >
      <Grid
        container
        style={{
          marginBottom: '.75rem',
          padding: '0',
        }}
      >
        <GridFlex item lg={3} md={3} padding="0">
          <IconCircle
            className="fa fa-circle"
            style={{
              justifySelf: 'flex-start',
              color: `#97C15C`,
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
              transform: `rotate(${isPanelExpanded ? '180deg' : '0'})`
            }}
          />
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
            color="#97C15C"
            marginTop="2px"
            width={`${otherCoinsPercentage}%`}
            variant="determinate"
            value={0}
          />
        </GridProgressBarContainer>

        <GridFlex item lg={3} md={3} padding={'0 0 0 45px'} style={{ justifyContent: 'center' }} >
          <TypographyCustom>
            {UTILS.preparePercentage(+otherCoinsPercentage)}
          </TypographyCustom>
        </GridFlex>
      </Grid>
    </ProgressAccordion>
  )
}

export default ProgressOtherCoins
