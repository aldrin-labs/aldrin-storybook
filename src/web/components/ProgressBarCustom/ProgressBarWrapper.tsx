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

import ProgressBarSection from './ProgressBarSection'
import ProgressBarCoins from './ProgressBarCoins'
import ProgressOtherCoins from './ProgressOtherCoins'

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
        return <ProgressBarCoins datum={datum} index={index} />
      })}
      {otherCoinData ? (
        <ProgressOtherCoins
          otherCoinData={otherCoinData}
          otherCoinsPercentage={otherCoinsPercentage}
        />
      ) : (
        ' '
      )}
    </>
  )
}

export default withStyles(styles)(ProgressBarWrapper)
