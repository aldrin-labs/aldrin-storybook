import React from 'react'
import { Button } from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'
import {CSS_CONFIG} from '@sb/config/cssConfig'

const styles = {
  button: {
    borderRadius: 3,
    minWidth: 45,
    width: '100%',
    padding: '0px',
    minHeight: 30,
    fontSize: CSS_CONFIG.chart.content.fontSize,
  },
  input: {
    fontSize: CSS_CONFIG.chart.content.fontSize,
  },
};

export const TradeButton = withStyles(styles)(
  ({ classes, children, ...others }: { children: any; classes: any }) => (
    <Button
      className={classes.button}
      size="small"
      {...others}
    >
      {children}
    </Button>
  )
)
