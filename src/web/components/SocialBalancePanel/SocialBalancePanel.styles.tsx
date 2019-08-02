import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

import { keyFrameExampleOne } from './KeyFrames'

export const GridMainContainer = styled(Grid)`
  padding: 15px;
`

export const GridColumn = styled(Grid)`
  flex-basis: 16.66%;
  display: flex;
  align-items: center;
`
export const TypographyTitleCell = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.9rem;
  line-height: 23px;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};

  @media (min-width: 2560px) {
    font-size: 0.8rem;
  }
`
export const TypographyValueCell = styled(({ fontWeight, ...rest }) => (
  <Typography {...rest} />
))`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 39px;
  text-align: center;
  text-transform: uppercase;
  background: transparent;
  color: ${(props) => props.textColor || `#16253d`};
  animation: ${keyFrameExampleOne} 1s ease-in-out 0s;

  @media (min-width: 2560px) {
    font-size: 1rem;
    padding: 0.3rem;
  }
`
