import React from 'react'
import styled from 'styled-components'
import { Row } from '../AnalyticsRoute/index.styles'

const BlockTemplate = styled(({ theme, ...props }) => <Row {...props} />)`
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.palette.dark.background};
  border-radius: 0.8rem;
`
export const LiquidityDataContainer = styled(Row)`
  width: 50%;
  border-right: 0.1rem solid #383b45;
  height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 2rem;
  justify-content: space-around;
`

export { BlockTemplate }
