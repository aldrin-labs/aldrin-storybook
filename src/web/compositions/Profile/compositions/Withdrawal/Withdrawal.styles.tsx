import React from 'react'
import styled from 'styled-components'
import { OutlinedInput, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

const styles = theme => ({
  root: {
    "&:not(hover):not($disabled):not($focused):not($error) $notchedOutline": {
      borderColor: theme.palette.grey.border,
    },
    "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
      borderColor: theme.palette.blue.main,
    },
    "&$focused:not($disabled):not($error) $notchedOutline": {
      borderColor: theme.palette.blue.main,
    }
  },
  notchedOutline: {
    borderRadius: ".4rem",
    borderWidth: ".1rem"
  },
  disabled: {},
  focused: {},
  error: {}
});

export const OutlinedInputMUI = (props: any) => <OutlinedInput InputProps={{ classes: props.classes }} {...props} />

export const Outlined = withStyles(styles)(OutlinedInputMUI)

export const StyledInput = styled(Outlined)`
  height: 5rem;
  width: 80%;
  
  & input {
    font-size: 1.4rem;
    font-weight: bold;
    color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.dark &&
      props.theme.palette.dark.main) ||
    '#16253D'};
    text-align: left;
  }
`

export const StyledTypography = styled(Typography)`
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: bold;
`

export const StyledTypographyCaption = styled(Typography)`
  color: rgba(65, 73, 94, 0.69);
  font-size: 0.9rem;
  font-weight: bold;
`
