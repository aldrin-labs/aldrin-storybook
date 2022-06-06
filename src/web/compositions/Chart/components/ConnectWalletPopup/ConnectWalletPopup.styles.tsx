import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const WalletSelectorRow = styled(RowContainer)`
  background: transparent;
  justify-content: space-between;
  text-transform: none;
  white-space: normal;
  text-align: right;
  border-bottom: 0.1rem solid ${(props) => props.theme.colors.gray5};
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.gray1};
  font-family: Avenir Next Medium;
  height: 6rem;
  padding: 0 2rem;
  transition: 0.3s;
  cursor: pointer;
  &:last-child {
    border: none;
  }
  &:hover {
    background: ${(props) => props.theme.colors.gray5};
    transition: 0.3s;
  }
`
export const CloseIcon = styled.div`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  svg {
    path {
      stroke: ${(props) => props.theme.colors.white};
    }
  }
`
export const WalletIcon = styled.div`
  width: 2.7em;
  height: 2.7em;
  border-radius: ${(props) => props.radius || '50%'};
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
`
