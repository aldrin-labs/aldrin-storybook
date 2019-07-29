import React from 'react'
import styled from 'styled-components'
import { Card, CardContent } from '@material-ui/core'

export const ChartContainer = styled(({ ...props }) => <Card {...props} />)`
  && {
    height: 100%;
    width: 100%;
  }
`

//  minus card header height
export const Chart = styled(({ background, ...rest }) => (
  <CardContent {...rest} />
))`
  background: ${(props: { background: string }) => props.background};
  width: 100%;
  height: calc(100% - 68px);
  && {
    padding: 0.8rem 0.8rem 0 0.8rem;
  }
`
