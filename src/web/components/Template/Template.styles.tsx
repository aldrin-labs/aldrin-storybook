import React from 'react'
import styled from 'styled-components'
import { Grid, Card } from '@material-ui/core'
import { GridProps } from '@material-ui/core/Grid'
import { CardProps } from '@material-ui/core/Card'
import { Container } from '@sb/styles/cssUtils'

export const GridContainer = styled(Container as React.SFC<GridProps>)`
  position: relative;
  flex-wrap: nowrap;
  flex-direction: row;
  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
  && {
    height: auto;
    margin: 0;
  }
`

export const ChartContainer = styled(Grid as React.SFC<GridProps>)`
  flex-basis: 51%;
  padding: 0 8px;
  @media (max-width: 960px) {
    flex-basis: 100%;
    padding: 0 8px;
  }
  && {
    height: 40%;
  }
`

export const TableWrapper = styled(Card as React.SFC<
  CardProps & { className?: string }
>)`
  max-height: 27.5rem;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: 2560px) {
    max-height: 37rem;
  }
`

export const TablesWrapper = styled(Grid as React.SFC<GridProps>)`
  max-height: 50%;
  flex-basis: inherit;
  padding: 0 !important;
  margin: 0;
  @media (max-width: 960px) {
    max-height: inherit;
  }
`

export const GridTableContainer = styled(Grid as React.SFC<GridProps>)`
  position: relative;
  max-height: 100%;
`
