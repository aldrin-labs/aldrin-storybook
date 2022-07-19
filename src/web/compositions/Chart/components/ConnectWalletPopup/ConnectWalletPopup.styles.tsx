import { rgba } from 'polished'
import styled from 'styled-components'

export const WalletSelectorRow = styled.div`
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-transform: none;
  white-space: normal;
  text-align: right;
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
    background: ${(props) => props.theme.colors.white4};
    transition: 0.3s;
  }
`
export const CloseIcon = styled.div`
  font-family: Avenir Next Demi;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => rgba(props.theme.colors.white3, 0.5)};
  width: 6rem;
  height: 6rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.white1};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => rgba(props.theme.colors.white3, 0.25)};
  }
`
export const WalletIcon = styled.div`
  width: 2.7em;
  height: 2.7em;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const WalletRight = styled.div``

export const WalletTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => props.theme.colors.white1};
`

export const WalletSubtitle = styled.div`
  color: ${(props) => props.theme.colors.white2};
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
  color: ${(props) => props.theme.colors.green2};
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: ${(props) => props.theme.colors.obGreenBack};
  }
`

export const Title = styled.span`
  font-family: Avenir Next Demi;
  font-weight: 500;
  font-size: 2rem;
  line-height: 3rem;
  text-align: center;
  letter-spacing: 0.01rem;
  text-transform: none;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.white1};
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2.4rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white5};
  align-items: center;
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 2.4rem;
  border-top: 1px solid ${({ theme }) => theme.colors.white5};
`
