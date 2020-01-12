import React from 'react'
import { Button } from '@material-ui/core'

import { withStyles } from '@material-ui/styles'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import { fade } from '@material-ui/core/styles/colorManipulator'


export const TradeButton = withStyles((theme) => ({
  button: {
    borderRadius: 3,
      minWidth: 45,
      width: '100%',
      padding: '0px',
      minHeight: 30,
      fontSize: CSS_CONFIG.chart.content.fontSize,
  },
  hoverButton: {
    '$:hover': {
      backgroundColor: 'black',
    },
  },
  red: {
      backgroundColor: fade(theme.customPalette.red.main, 0.85),
  },
  green: {
      backgroundColor: fade(theme.customPalette.green.main, 0.85),
  },
}))(
  ({
    classes,
    children,
    typeIsBuy,
    buyButton = false,
    ...others
  }: {
    typeIsBuy?: boolean
    buyButton: boolean
    children: any
    classes: any
  }) => (
    <Button className={`${classes.button} ${classes.hoverButton} ${typeIsBuy ? classes.green : classes.red}`} size="small" {...others}>
      {children}
    </Button>
  )
)
