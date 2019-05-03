import React from 'react'
import styled from 'styled-components'

import { withStyles } from '@material-ui/core/styles'

import SvgIcon from '@sb/components/SvgIcon/'

import {
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  ButtonBase,
  Fab,
} from '@material-ui/core'


export const StepsLogo = styled.img`
  z-index: 1;
  position: relative;
  margin: auto 0;
  height: 130px;
`

export const Logo = styled.img`
  z-index: 1;
  position: relative;
  margin: auto 0;
  height: 36px;
`

export const SocialSvgContainer = styled.div`
  transform: translateX(-10px) translateY(2px)
`

export const GoolgeSvgContainer = styled.div`
  transform: translateX(-10px) translateY(3px)
`

export const StepContainer = styled.div`
  background: linear-gradient(to top, #34DCBF, #2EC7CC);
  height: 646px;
`

export const MainWrapper = styled.div`
  margin-left: 67px;
`

export const LogoWrapper = styled.div`
  height: 130px;
  padding-top: 47px;
`

export const MainContainer = styled.div`
  height: 646px;
  width: 1054px;
  margin: 0px auto;
`

export const StyledTypography = styled(Typography)`
  color: white;
  font-weight: ${(props: { weight?: string }) => props.weight || 'normal'};
`

export const StyledLink = styled(Link)`
  padding-left: 4px;
  font-weight: ${(props: { weight?: string }) => props.weight || 'normal'};
`

export const InputContainer = styled.div`
  padding-top: 69px;
`

const styles = {
  input: {
    paddingBottom: '13px',
  },
  button: {
    color: 'white',
  },
  launchButton: {
    color: 'white',
    width: '160px',
    marginTop: '55px',
  },
  facebookButton: {
    color: 'white',
    borderWidth: '2px',
    width: '170px',
    textTransform: 'none',
    borderRadius: '24px',
    borderColor: '#43619C',
  },
  googleButton: {
    marginLeft: '14px',
    color: 'white',
    borderWidth: '2px',
    width: '170px',
    textTransform: 'none',
    borderRadius: '24px',
    borderColor: '#EA3E32',
  },
}

export const InputTextField = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <TextField
    InputProps={{
      className: classes.input,
    }}
    {...others}
  />
)


export const StyledButton = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <Button
    color="secondary"
    variant="extendedFab"
    size="small"
    className={classes.button}
    style={{
      height: 37,
    }}
    {...others}
  />
)

export const StyledLaunchButton = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <Button
    color="secondary"
    variant="extendedFab"
    size="small"
    style={{
      height: 37,
    }}
    className={classes.launchButton}
    {...others}
  />
)

export const FacebookButton = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <Button
    variant="outlined"
    size="small"
    style={{
      height: 37,
    }}
    className={classes.facebookButton}
    {...others}
  />
)

export const GoogleButton = withStyles(styles)(({classes, ...others}: {classes: any}) =>
  <Button
    variant="outlined"
    size="small"
    style={{
      height: 37,
    }}
    className={classes.googleButton}
    {...others}
  />
)

export const StepWrapper = styled.div`
  padding-top: 60px;
  padding-bottom: 190px;
`

export const BottomWrapper = styled.div`
  font-weight: ${(props: { weight?: string }) => props.weight || 'normal'};
`

export const SocialContainer = styled.div`
  padding-top: 22px;
`

export const TextContainer = styled.div`
  width: 300px;
`

export const StepTextContainer = styled.div`
  height: 92px;
`

export const StepTextWrapper = styled(Grid)`
  width: 173px;
`

export const ButtonsWrapper = styled(Grid)`
  padding-top: 46px;
  padding-bottom: 28px;
`

export const StepGrid = styled(Grid)`
  width: 487px;
`

export const ArrowGrid = styled(Grid)`
  width: 31px;
`

export const Arrow = styled.img`
  margin-top: ${(props: { step?: string }) => props.step === 'first' ? '275px' : '360px'};
  height: 45px;
`

export const StepIconGrid = styled(Grid)`
  width: 75px;
`

export const ContentGrid = styled(Grid)`
  padding-left: 182px;
  width: 536px;
`

export const ConfirmContainer = styled.div`
  padding-top: 132px;
`

export const ConfirmText = styled(StyledTypography)`
  font-size: 16px;
`

export const ConfirmTextContainer = styled.div`
  padding-top: 32px;
`
