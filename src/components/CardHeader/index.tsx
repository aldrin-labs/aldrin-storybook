import React from 'react'
import { withStyles, CardHeader, createStyles, Theme } from '@material-ui/core'
import { CardHeaderProps } from '@material-ui/core/CardHeader'
import { fade } from '@material-ui/core/styles/colorManipulator'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: '34px',
      padding: '6px',
      width: '100%',
      backgroundColor:
        theme.palette.type === 'dark'
          ? theme.palette.primary.light
          : fade(theme.palette.primary.main, 0.5),
    },
    title: {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.02857em',
      fontSize: '16px',
    },
    action: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

const Header = (props: CardHeaderProps) => (
  <CardHeader
    style={props.style}
    titleTypographyProps={{ variant: 'body1', color: 'default' }}
    classes={{
      root: props && props.classes && props.classes.root,
      action: props && props.classes && props.classes.action,
    }}
    {...props}
  />
)

export default withStyles(styles, { withTheme: true })(Header)
