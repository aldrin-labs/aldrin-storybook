import React from 'react'

import {
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
} from '@material-ui/core'

import styled from 'styled-components'
import { withStyles } from '@material-ui/styles'

import Done from '@material-ui/icons/Done'


import { Paper, Grid, Input } from '@material-ui/core'

const exchangeButton = {
  width: '132px',
  height: '36px',
  paddingTop: '9px',
  borderRadius: '2px',

}


const styles = theme => ({
  underline: {
		color: theme.palette.common.black,
		borderBottom: 'rgba(0,0,0,.42)',
		'&:after': {
			borderBottom: `1px solid ${theme.palette.common.black}`,
		},
		'&:focused::after': {
			borderBottom: `1px solid ${theme.palette.common.black}`,
		},
		'&:before': {
			borderBottom: `1px solid rgba(0,0,0,.42)`,
		},
		'&:hover:not($disabled):not($focused):not($error):before': {
			borderBottom: `1px solid ${theme.palette.common.black} !important`,
		},
		'&$disabled:before': {
			borderBottom: `1px dotted ${theme.palette.common.black}`,
    },
    paddingBottom: '13px',
	},
  input: {
    paddingBottom: '13px',
    color: theme.palette.primary.main,
  },
  inputLabel: {
    color: theme.palette.primary.main,
  },
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
    boxShadow: 'none',
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

export const InputTextField = withStyles(styles)(({classes, label, ...others}: {classes: any}) =>
<FormControl fullWidth>
  <InputLabel className={classes.inputLabel}>{label}</InputLabel>
  <Input
    classes={{underline: classes.underline}}
    {...others}
  />
</FormControl>
)


export const ExhangeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  cursor: pointer;
  width: 132px;
  height: 36px;
  border-radius: 3px;
  background: ${(props: { active: boolean, addButton: boolean}) => props.active
    ? '#2B3245'
    : props.addButton
    ? '#EFF3FF'
    :'#377C8A'
  };
  border: ${(props: { active: boolean, addButton: boolean}) => props.addButton
  ? '1.5px dotted'
  : ''
};
`

export const AddContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const FormContainer = styled.form`
  width: 100%;
`



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

export const ImportContent = styled.div`
  width: 610px;
`

export const HelpContent = styled.div`
  width: 610px;
  padding: 0px 58px;
`

export const HelpStepContainer = styled.div`
  padding-bottom: 48px;
`

export const WelcomeTextContainer = styled.div`
  width: 504px;
`

export const LaunchContainer = styled.div`
  width: 450px;
`

export const LogoContainer = styled.div`
  display: block;
  position: relative;
  overflow: hidden;
`

export const StyledLogo = styled.img`
  position: relative;
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
