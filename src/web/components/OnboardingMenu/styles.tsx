import React from 'react'

import {
  Typography,
  Button
} from '@material-ui/core'

import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'

import { Paper } from '@material-ui/core'

const styles = theme => ({
  root: {
    background: '#FFFFFF',
    width: '592px',
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
})

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
