import React from 'react'
import styled from 'styled-components'
import { Typography, Button,  DialogTitle } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  button: {
    fontSize: '12px',
    borderRadius: '32px',
  },
  selected: {
    color: theme.palette.text.light,
    backgroundColor: theme.palette.blue.light,
    '&:hover': {
      backgroundColor: theme.palette.blue.light,
    },
  },
})

export const TabButton = withStyles(styles)(({classes, children, isSelected, ...others}: {isSelected: boolean, children: any, classes: any}) =>
  <Button
    className={isSelected ? `${classes.selected} ${classes.button}` : classes.button}
    variant={isSelected ? 'contained' : 'outlined'}
    size="large"
    {...others}
  >
    {children}
  </Button>
)

export const ButtonShare = styled(Button)`
  font-size: 12px;
  width: 200px;
  height: 48px;
  background: #165be0;
  color: #fff;
  border: 1px solid #e0e5ec;
  box-sizing: border-box;
  border-radius: 32px;
`

export const TypographySectionTitle = styled(Typography)`
  font-style: normal;
  font-weight: 700;
  font-size: 0.5625rem;
  line-height: 23px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #16253d;
`
export const TypographySubTitle = styled(Typography)`
  font-style: normal;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 31px;
  color: #7284a0;
`

export const DialogFooter = styled(DialogTitle)`
  text-align: center;
  color: #fff;
  background: #2f7619;
  border-radius: 0px 0px 20px 20px;
`
