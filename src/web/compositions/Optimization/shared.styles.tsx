import React from 'react'
import styled from 'styled-components'
import { Card } from '@material-ui/core'

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
  width: 49%;
  min-height: ${(props: { minHeight: string }) =>
    props.minHeight ? props.minHeight : ''};
  margin: ${(props: { margin: string }) => (props.margin ? props.margin : '')};

  ${(props: { hide: boolean }) => (props.hide ? HidingStyles : '')};
`

export const InnerChartContainer = styled.div`
  padding: 0 15px 15px 15px;
`


