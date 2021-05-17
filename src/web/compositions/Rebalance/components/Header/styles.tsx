import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import styled from 'styled-components'

export const BalanceCard = styled(Row)`
  width: calc(50% - 1rem);
  flex-direction: column;
  justify-content: space-between;
  align-items: baseline;
  background: ${(props) => props.background};
  padding: 2rem;
  height: 100%;
  border-radius: 1.6rem;
`
export const Title = styled.span`
  font-family: 'Avenir Next Thin';
  color: #f5f5fb;
  font-size: 1.5rem;
`
export const Header = styled.span`
  font-family: ${(props) => props.fontFamily || 'Avenir Next Bold'};
  font-size: ${(props) => props.fontSize || '4rem'};
  color: #f2fbfb;
`
