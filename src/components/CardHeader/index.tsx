import React from 'react'
import { withStyles, CardHeader, createStyles, Theme } from '@material-ui/core'
import { CardHeaderProps } from '@material-ui/core/CardHeader'
import { fade } from '@material-ui/core/styles/colorManipulator'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: theme.spacing.unit * 8.5,
      padding: theme.spacing.unit * 2.875,
      width: '100%',
      backgroundColor:
        theme.palette.type === 'dark'
          ? theme.palette.primary.light
          : fade(theme.palette.primary.main, 0.5),
    },
    action: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

const Header = (props: CardHeaderProps) => (
  <CardHeader
    titleTypographyProps={{ variant: 'body1', color: 'default' }}
    classes={{
      root: props && props.classes && props.classes.root,
      action: props && props.classes && props.classes.action,
    }}
    {...props}
  />
)

export default withStyles(styles, { withTheme: true })(Header)
