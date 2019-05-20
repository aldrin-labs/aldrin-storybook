import React from 'react'

import {
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Input,
  Paper,
  Grid,
} from '@material-ui/core'

import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'

import Done from '@material-ui/icons/Done'

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
    color={selected ? 'secondary' : 'default'}
    style={{
      height: 43,
    }}
    className={classes.optionButton}
    {...others}
  />
)

export const StyledInput = withStyles(styles)(({classes,  ...others}: {classes: any}) =>
  <Input
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
