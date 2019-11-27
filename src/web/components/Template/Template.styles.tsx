import React from 'react'
import styled from 'styled-components'
import { Grid, Card } from '@material-ui/core'
import { GridProps } from '@material-ui/core/Grid'
import { CardProps } from '@material-ui/core/Card'
import { Container, borderRadiusScrollBar } from '@sb/styles/cssUtils'

export const GridContainer = styled(Container as React.SFC<GridProps>)`
  position: relative;
  flex-wrap: nowrap;
  flex-direction: row;
  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
  && {
    height: calc(69vh - 2rem);
    margin: 0;
    margin-bottom: 2rem;
  }
`

export const ChartContainer = styled(Grid as React.SFC<GridProps>)`
  flex-basis: 51%;
  padding: 0 0 0 8px;
  @media (max-width: 960px) {
    flex-basis: 100%;
    padding: 0 0 0 8px;
  }
  && {
    padding-bottom: 0;
    min-height: 100%;
  }
`

export const TableWrapper = styled(Card as React.SFC<
  CardProps & { className?: string }
>)`
  ${borderRadiusScrollBar}
  && {
    position: relative;
    height: calc(68.2vh - 2rem);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    border: 1px solid #e0e5ec;
    border-radius: 1.5rem;
    box-shadow: 0px 0px 12px rgba(10, 19, 43, 0.1);
  }
`

// @media only screen and (min-width: 1025px) and (max-width: 1400px) {
//   height: 54rem;
// }

// @media only screen and (min-width: 2245px) and (max-width: 2560px) {
//   height: 54rem;
// }

export const TablesWrapper = styled(Grid as React.SFC<GridProps>)`
  height: 100%;
  flex-basis: inherit;
  padding: 0 !important;
  margin: 0;
`

// @media (max-width: 960px) {
//   max-height: inherit;
// }

export const GridTableContainer = styled(Grid as React.SFC<GridProps>)`
  position: relative;
  max-height: 100%;
`
