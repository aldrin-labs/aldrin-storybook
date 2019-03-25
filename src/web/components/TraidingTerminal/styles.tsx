import React from 'react'
import styled from 'styled-components'
import { Card, Button, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';


import { CardHeader } from '@sb/components/index'

const styles = {
  button: {
    borderRadius: 3,
    minWidth: 45,
    width: '100%',
    height: 10,
    padding: '0px',
  },
};



export const ButtonContainer = styled.div`
  padding: 0px;
  text-align: center;
`

export const ByButtonContainer = styled.div`
  padding-top: 20px;
  text-align: center;
`

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

export const StyledCardHeader = styled(CardHeader)`
  margin-bottom: 15px;
  background: rgb(31, 31, 36);
  & > div {
    align-self: auto !important;
    margin-top: 0 !important;
    margin-right: 0 !important;
  }
`


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
padding: 8px 0px;
`

export const InputContainer = styled.div`
  padding: 2px;
`
