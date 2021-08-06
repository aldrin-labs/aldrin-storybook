import styled from 'styled-components'
import { Paper, } from '@material-ui/core'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

export const BlockForIcons = styled(Row)`
  padding: 1rem 2rem;
  justify-content: space-around;
  background: #222429;
  border: 1px solid #383b45;
  box-sizing: border-box;
  box-shadow: 16px 16px 12px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  min-width: 25rem;
`

export const Stroke = styled(RowContainer)`
  justify-content: space-between;
  border-bottom: 0.1rem solid #383b45;
  padding: 1.5rem 2rem;
`

export const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem 0;
  width: 60rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
  overflow: hidden;
  max-height: 100%;
`
