import React from 'react'
import styled from 'styled-components'
import { OutlinedInput, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

const styles = theme => ({
  root: {
    "&:not(hover):not($disabled):not($focused):not($error) $notchedOutline": {
      borderColor: "#E0E5EC"
    },
    "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
      borderColor: "#165BE0"
    },
    "&$focused:not($disabled):not($error) $notchedOutline": {
      borderColor: "#165BE0"
    }
  },
  notchedOutline: {
    borderRadius: "8px",
    borderWidth: "2px"
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
    color: #16253d;
    text-align: center;
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
