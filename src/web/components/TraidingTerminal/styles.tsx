import React from 'react'
import styled from 'styled-components'
import { Card, Button, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'


import { CardHeader } from '@sb/components/index'

const styles = {
  button: {
    borderRadius: 3,
    minWidth: 45,
    width: '100%',
    padding: '0px',
  },
  input: {
    fontSize: '0.875rem',
  },
};



export const ButtonContainer = styled.div`
  padding: 0px;
  text-align: center;
`

export const ByButtonContainer = styled.div`
  padding-top: 10px;
  text-align: center;
`

export const InputTextField = withStyles(styles)(({classes, endAdornment, ...others}: {classes: any}) =>
  <TextField
    InputProps={{
      className: classes.input,
      endAdornment: endAdornment,
    }}
    fullWidth
    {...others}
  />
)


export const PriceButton = withStyles(styles)(({classes, children, ...others}: {children: any, classes: any}) =>
  <Button
    className={classes.button}
    variant="outlined"
    size="small"
    {...others}
    >
      {children}
  </Button>
)

export const Container = styled.div`
  && {
    background-color: ${(props: { background?: string }) => props.background};
  }
`

export const GridContainer = styled.div`
  padding: 8px;
`

export const NameHeader = styled.div`
  background: ${(props: { background?: string }) => props.background};
  padding: 6px 8px;
`

export const TitleContainer = styled.div`
  padding: 4px 0px;
`

export const InputContainer = styled.div`
  padding: 0px;
`
