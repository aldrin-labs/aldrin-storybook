import { UCOLORS } from '@variables/variables'
import { rgba, em } from 'polished'
import styled from 'styled-components'

import primaryCardBackground from './images/primary-card-background.png'

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
  font-size: 0.75em;
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
  background: #000;
`

export const WalletRight = styled.div``

export const BottomText = styled.div`
  line-height: ${em('20px', '14px')};
  font-size: ${em('14px')};
  color: ${(props) => props.theme.colors.white1};
  font-weight: bold;
  display: flex;
  align-items: center;
`

export const Title = styled.span`
  font-family: Avenir Next Demi;
  font-weight: 500;
  font-size: 1em;
  line-height: 1.5em;
  color: ${({ theme }) => theme.colors.white1};
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2.4rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.white5};
  align-items: center;
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 2.4rem;
  border-top: 1px solid ${(props) => props.theme.colors.white5};
`

export const PrimaryCard = styled.div`
  height: 10em;
  background: url(${primaryCardBackground});
  background-size: cover;
  border-radius: 16px;
  box-shadow: 0 4px 20px #a62933;
  margin: 1.5em;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

export const Wallet = styled.div`
  background: rgba(20, 20, 31, 0.5);
  border-radius: 8px;
  padding: 0.5em;
  display: flex;
  align-items: center;
`

export const WalletName = styled.div`
  font-size: 0.75em;
  margin-left: 0.25em;
  line-height: 1em;
`

export const PrimaryCardTop = styled.div`
  display: flex;
  align-items: center;
`

export const PrimaryCardBottom = styled.div`
  display: flex;
  justify-content: space-between;
`

export const PrimaryCardTopLeft = styled.div``

export const PrimaryCardTopRight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-left: 0.75em;
  height: 2em;
`

export const PrimaryCardBottomLeft = styled.div``

export const PrimaryCardBottomRight = styled.div`
  align-self: flex-end;
`

export const Balance = styled.div``

export const BalanceTitle = styled.div`
  color: ${UCOLORS.red1};
  font-size: 0.75em;
  line-height: 1em;
`

export const BalanceValue = styled.div`
  color: ${({ theme }) => theme.colors.persistent.white1};
  font-size: ${em('24px')};
  margin-top: 0.2em;
  line-height: ${em('32px', '24px')};
  font-weight: bold;
`

export const ClaimGasButton = styled.button`
  font-family: Avenir Next Medium;
  font-size: 0.75em;
  line-height: ${em('16px')};
  background-color: rgba(0, 181, 94, 0.15);
  color: ${(props) => props.theme.colors.green2};
  height: ${em('36px', '12px')};
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  padding-left: ${em('20px', '12px')};
  padding-right: ${em('20px', '12px')};

  &:hover {
    background-color: ${(props) => props.theme.colors.obGreenBack};
  }
`

export const TopUpButton = styled.button`
  background-color: ${(props) => rgba(props.theme.colors.green3, 0.15)};
  border: none;
  border-radius: 8px;
  height: ${em('32px')};
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: inherit;

  &:hover {
    background-color: ${(props) => rgba(props.theme.colors.green3, 0.25)};
  }
`

export const TopUpButtonText = styled.span`
  font-family: Avenir Next Demi;
  color: ${(props) => props.theme.colors.green1};
  font-weight: 500;
  margin-left: 0.25em;
  font-size: 0.75em;
`

export const AssetsTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${em('14px')} 1.5em;
`

export const AssetsTitleLeft = styled.div`
  color: ${(props) => props.theme.colors.white1};
  font-size: ${em('14px')};
`

export const AssetsTitleRight = styled.div`
  font-weight: bold;
  color: ${(props) => props.theme.colors.green2};
  font-size: 0.75em;
`

export const AssetsList = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.white4};
  padding: 0 1.5em;
  flex: 1;
  overflow: auto;
`

export const AssetsListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${em('14px')} 0;
`

export const AssetsListItemLeft = styled.div`
  display: flex;
  align-items: center;
`

export const AssetsListItemRight = styled.div`
  font-size: ${em('14px')};
  font-weight: bold;
  color: ${(props) => props.theme.colors.white1};
`

export const AssetInfo = styled.div`
  margin-left: 0.5em;
`

export const AssetTitle = styled.div`
  font-size: ${em('14px')};
  font-weight: bold;
  color: ${(props) => props.theme.colors.white1};
`

export const AssetSubtitle = styled.div`
  font-size: ${em('14px')};
  color: ${(props) => props.theme.colors.white3};
`

export const DisconnectButton = styled.button`
  display: flex;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0;

  &:hover {
    opacity: 0.75;
  }
`

export const CopyButton = styled.button`
  display: flex;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0;

  &:hover {
    opacity: 0.75;
  }
`

export const GasCashbackLabel = styled.span`

`

export const GasCashbackValue = styled.span`
  color: ${(props) => props.theme.colors.green1};
  margin-left: 0.4em;
`
