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
  font-family: Avenir Next Medium;
  height: 8rem;
  padding: 1.2rem;
  border-radius: 12px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #212131;
  width: 6rem;
  height: 6rem;
  cursor: pointer;
  color: #fff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
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

export const WalletRight = styled.div``

export const WalletTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #fff;
`

export const WalletSubtitle = styled.div`
  color: ${(props) => props.theme.colors.gray3};
  font-size: 12px;
`

export const WalletsList = styled.div`
  overflow: auto;
  padding: 1.2rem;
`
