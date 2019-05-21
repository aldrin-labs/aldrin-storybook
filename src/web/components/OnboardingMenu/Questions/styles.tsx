import React from 'react'

import {
  Typography,
  Button,
  Input,
  Paper,
} from '@material-ui/core'

import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'




const styles = theme => ({
  root: {
    background: '#FFFFFF',
    zIndex: '200',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'fixed',
    paddingTop: '14px',
    paddingLeft: '25px',
    paddingRight: '25px',
    paddingBottom: '28px',
    textAlign: 'center',
  },
  beginButton: {
    boxShadow: 'none',
  },
  optionButton: {
    color: 'black',
    width: '286px',
    textTransform: 'none',
    marginBottom: '20px',
  },
  primary: {
    background: 'white',
    '&:hover': {
      background: '#fafafa',
    },
  },
  input: {
    color: 'black',
  }
})

export const WelcomeTextContainer = styled.div`
  padding-top: 48px;
  padding-bottom: 36px;
`

export const StyledBeginButton = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <Button
    color="secondary"
    style={{
      height: 37,
    }}
    className={classes.beginButton}
    {...others}
  />
)

export const OptionButton = withStyles(styles)(({classes, selected,  ...others}: {classes: any}) =>
  <Button
    variant="contained"
    color={selected ? 'secondary' : 'primary'}
    style={{
      height: 43,
    }}
    classes={{
      root: classes.optionButton, // class name, e.g. `root-x`
      containedPrimary: classes.primary, // class name, e.g. `disabled-x`
    } }
    {...others}
  />
)

export const InputContainer = styled.div`
  color: black;
  width: 286px;
  box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
  padding: 6px 16px;
  font-size: 0.875rem;
  min-width: 64px;
  box-sizing: border-box;
  border-radius: 4px;
`

export const StyledInput = withStyles(styles)(({classes,  ...others}: {classes: any}) =>
  <Input
    fullWidth
    className={classes.input}
    {...others}
  />
)


export const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const ContentContainer = styled.div`
  height: 330px;
  width: 720px;
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
