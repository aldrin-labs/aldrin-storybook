import { LinearProgress } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

import { Row, WhiteTitle } from '@sb/compositions/AnalyticsRoute/index.styles'

const TokenAllocationProgressBarContainer = styled(({ ...props }) => (
  <Row {...props} />
))`
  background: ${(props) => props.theme.colors.white3};
  border-radius: 35px;
`

const TokenAllocationProgressBar = styled(
  ({ width, color, height, ...rest }) => <LinearProgress {...rest} />
)`
  transition: width 0.5s;
  width: ${(props) => props.width || `100%`};
  background: ${(props) => props.color || '#E7ECF3'};
  border-radius: 1rem;
  height: ${(props) => props.height || '1.75rem'};
  padding: 0;
`

const BarTitle = styled(({ ...props }) => <WhiteTitle {...props} />)`
  font-size: ${(props) => props.fontSize || '1.4rem'};
  width: 8rem;
`

const PercentageTitle = styled(({ ...props }) => <BarTitle {...props} />)`
  width: 6rem;
  text-align: right;
`

export {
  TokenAllocationProgressBarContainer,
  TokenAllocationProgressBar,
  BarTitle,
  PercentageTitle,
}
