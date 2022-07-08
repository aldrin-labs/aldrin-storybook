import { Paper } from '@material-ui/core'
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
  font-family: Avenir Next Demi;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.gray13};
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
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
`

export const WalletRight = styled.div``

export const WalletTitle = styled.div`
  font-family: Avenir Next Bold;
  font-size: 14px;
  color: ${(props) => props.theme.colors.white1};
`

export const WalletSubtitle = styled.div`
  color: ${(props) => props.theme.colors.gray3};
  font-size: 12px;
`

export const WalletsList = styled.div`
  overflow: auto;
  padding: 1.2rem;
`

export const BottomText = styled.div`
  font-family: Avenir Next Bold;
  line-height: 20px;
  font-size: 14px;
  color: ${(props) => props.theme.colors.white1};
  font-weight: 600;
`

export const LearnMoreLink = styled.a`
  font-family: Avenir Next Medium;
  font-size: 14px;
  background-color: rgba(0, 181, 94, 0.15);
  color: ${(props) => props.theme.colors.green4};
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: ${(props) => props.theme.colors.obGreenBack};
  }
`

export const StyledPaper = styled(Paper)`
  height: auto;
  width: 45rem;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.colors.gray6};
  border-radius: 1.6rem;
`

export const Title = styled.span`
  font-family: Avenir Next Bold;
  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
  letter-spacing: 0.01rem;
  text-transform: none;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.white1};
`
