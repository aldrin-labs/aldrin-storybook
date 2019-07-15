import React from 'react'
import { IProps } from './ProgressBarWrapper.types'
import { withStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {
  GridFlex,
  LinearProgressCustom,
  TypographyCustom,
  IconCircle,
} from './ProgressBar.styles'

import ProgressAccordion from '@sb/components/ProgressAccordion/ProgressAccordion'
import ProgressBarSection from './ProgressBarSection'
import ProgressBarCoins from './ProgressBarCoins'

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

function ProgressBarWrapper(props: IProps) {
  const {
    sectionDataProgress,
    coinData,
    otherCoinData,
    otherCoinsPercentage,
    isSectionChart,
    classes,
  } = props

  return isSectionChart ? (
    sectionDataProgress.map((datum) => {
      return <ProgressBarSection datum={datum} />
    })
  ) : (
    <>
      {coinData.map((datum, index) => {
        return <ProgressBarCoins datum={datum} index={index}/>
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
                value={0}
              />
            </Grid>

            <GridFlex item lg={3} md={3} style={{ paddingLeft: '43px' }}>
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
