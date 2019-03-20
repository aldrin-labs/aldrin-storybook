import React from 'react'
import styled from 'styled-components'
import { Card, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';


import { CardHeader } from '@sb/components/index'

const styles = {
  button: {
    borderRadius: 3,
    color: 'white',
    minWidth: 45,
    height: 10,
    padding: '0px',
  },
  input: {
    fontSize: '0.875rem',
    height: '0.5rem',
  },
};

export const PriceInput = styled(withStyles(styles)((props) =>
  <TextField
    type="number"
    defaultValue="12324"
    InputProps={{
      endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
    }}
  />))`
margin: 5px;
padding: 2px;
`

export const ButtonContainer = styled.div`
  padding: 0px;
  text-align: center;
`

export const PriceButton = withStyles(styles)((props) =>
  <Button
    className={props.classes.button}
    variant="outlined"
    size="small"
    >
      {props.children}
  </Button>
)

export const StyledCardHeader = styled(CardHeader)`
  margin-bottom: 15px;

  & > div {
    align-self: auto !important;
    margin-top: 0 !important;
    margin-right: 0 !important;
  }
`

export const HidingStyles = `
  filter: blur(1.5px);
  user-select: none;
  pointer-events: none;
`

export const HighlightStyles = `
  box-shadow: 1px 3px 9px 0px rgb(255, 129, 0), 0px 2px 3px 0px rgb(195, 171, 4), 2px 2px 6px 1px rgb(212, 107, 17);
`

export const Container = styled(({ minHeight, margin, hide, ...other }) => (
  <Card {...other} />
))`
  max-width: 100%;
`
export const GridContainer = styled.div`
  padding: 8px;
`

export const NameHeader = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: calc(100% - 16px);
  padding: 16px 8px;
`

export const TitleContainer = styled.div`
padding: 8px 0px;
`

export const InputContainer = styled.div`
  padding: 2px;
`

