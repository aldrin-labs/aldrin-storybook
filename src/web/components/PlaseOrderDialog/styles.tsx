import React from 'react'
import { Button } from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

const styles = {
  button: {
    borderRadius: 3,
    minWidth: 45,
    width: '100%',
    padding: '0px',
    minHeight: 30,
  },
  input: {
    fontSize: '0.875rem',
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
