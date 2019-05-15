import React from 'react'

import {
  Typography,
  Button
} from '@material-ui/core'

import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'

import Done from '@material-ui/icons/Done'


import { Paper, Grid } from '@material-ui/core'

const exchangeButton = {
  width: '132px',
  height: '36px',
  paddingTop: '9px',
  borderRadius: '2px',

}

const styles = theme => ({
  root: {
    background: '#FFFFFF',
    zIndex: '200',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'fixed',
    paddingTop: '14px',
    paddingLeft: '69px',
    paddingRight: '69px',
    paddingBottom: '52px',
    textAlign: 'center',
  },
  beginButton: {
    color: 'white',
    width: '201px',
    textTransform: 'none',
  },
  active: {
    background: '#2B3245',
    ...exchangeButton,
  },
  notActive: {
    background: '#377C8A',
    ...exchangeButton,
  },
})

export const ExhangeButton = styled.div`
  cursor: pointer;
  width: 132px;
  height: 36px;
  padding-top: 9px;
  border-radius: 2px;
  background: ${(props: { active: boolean}) => props.active ? '#2B3245' : '#377C8A'};
`

/*
export const ExhangeButton = withStyles(styles)(({classes, active, ...others}: {classes: any}) =>
  <Button
    variant="extendedFab"
    style={{
      height: 37,
    }}
    className={active ? classes.active : classes.notActive}
    {...others}
  />
)*/


export const ExhangeTypography = styled(Typography)`
  width: 132px;
`

export const Selected = styled.img`
  position: absolute;
  top: 7px;
  left: -10px;
  height: 18px;
`

export const SelectedContainer = styled.div`
  position: relative;
  background: #38BDA9;
`

export const ExchangeContainer = styled.div`
  width: 600px;
  padding: 0px 70px;
`

export const WelcomeTextContainer = styled.div`
  width: 504px;
`


export const StyledLogo = styled.img`
  position: relative;
  height: 18px;
`

export const StyledBeginButton = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <Button
    color="secondary"
    variant="extendedFab"
    style={{
      height: 37,
    }}
    className={classes.beginButton}
    {...others}
  />
)

export const ButtonContainer = styled.div`
  padding-bottom: 12px;
`

export const ContentContainer = styled.div`
  padding: 43px 0px;
`

export const SubHeader = styled.div`
  padding-top: 36px;
`

export const StyledTypography = styled(Typography)`
  font-size: 16px;
`

export const Wrapper = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <Paper
    className={classes.root}
    {...others}
  />
)
