import React from 'react'
import styled from 'styled-components'
import { Card, withStyles } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'

import { CardHeader } from '@sb/components/index'



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

export const ChartContainer = styled(({ minHeight, margin, hide, ...other }) => (
  <Card {...other} />
))`
  max-width: 100%;
  min-height: ${(props: { minHeight: string }) =>
    props.minHeight ? props.minHeight : ''};
  margin: ${(props: { margin: string }) => (props.margin ? props.margin : '')};

  ${(props: { hide: boolean }) => (props.hide ? HidingStyles : '')};
`

export const NameHeader = styled.div`
align-items: center;
display: flex;
flex-wrap: wrap;
justify-content: space-between;
width: calc(100% - 32px);
padding: 16px;
`

export const TitleContainer = styled.div`
padding: 7px;
`

export const InputContainer = styled.div`
padding: 5px;
`

