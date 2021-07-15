import styled from 'styled-components'
import React from 'react'

import { Grid } from '@material-ui/core'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

export const StyledGrid = styled(Grid)`
  display: none;
`

export const StyledTab = styled(({ isSelected, ...props }) => (
  <Row {...props} />
))`
  && {
    text-transform: capitalize;
    padding: 0.5rem 1.5rem;
    background: ${(props) => (props.isSelected ? '#366CE5' : '#383B45')};
    border-radius: 1.3rem;
    cursor: pointer;
    font-family: ${(props) =>
      props.isSelected ? 'Avenir Next Demi' : 'Avenir Next Medium'};
    font-size: 1.4rem;
    margin: 0.5rem 0.75rem;
    color: #fff;
  }
`
