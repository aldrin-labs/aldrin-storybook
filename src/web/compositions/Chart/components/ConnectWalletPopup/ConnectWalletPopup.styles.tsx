import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import styled from 'styled-components'

export const WalletSelectorRow = styled(RowContainer)`
  background: transparent;
  justify-content: space-between;
  text-transform: none;
  white-space: normal;
  text-align: right;
  border-bottom: 0.2rem solid #383b45;
  font-size: 1.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  height: 6rem;
  padding: 0 2rem;
  transition: 0.3s;
  cursor: pointer;
  &:last-child {
    border: none;
  }
  &:hover {
    background: #383b45;
    transition: 0.3s;
  }
`
