import styled from 'styled-components'

import { WideContent } from '@sb/components/Layout'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const Link = styled.a`
  padding: 0 0 0 5px;
  text-decoration: 'none';
`

export const Container = styled(WideContent)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const StyledRowContainer = styled(RowContainer)`
  background: ${(props) => props.theme.colors.red2};
`
