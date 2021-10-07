import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const NavBarForSmallScreens = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 11rem;
  padding: 0 3rem;
  background: #222429;
  @media (min-width: 600px) {
    display: none;
  }
`
export const DisconnectButton = styled(BtnCustom)`
  padding: 1rem 3.5rem;
  border-radius: 1.8rem;
  background: #f79894;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  text-align: center;
  font-size: 1.4rem;
  text-transform: none;
  width: auto;
  height: auto;
`
export const StyledPaper = styled(Paper)`
  border-radius: 0;
  width: 100%;
  height: calc(100% - 22rem);
  background: #17181a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3rem;
  margin: 0;
  box-shadow: none;
`
export const WalletRowContainer = styled(RowContainer)`
  display: flex;
  height: 15rem;
  justify-content: space-between;
  text-transform: none;
  white-space: normal;
  text-align: right;
  background: #17181a;
  border-bottom: 0.2rem solid #383b45;
  font-size: 2.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
`

export const MobileWalletWarning = styled.div`
  margin: auto 1rem 4rem;
  background: rgba(255, 219, 94, 0.25);
  color: #F8FAFF;
  padding: 2.5rem;
  font-size: 2.5rem;
  line-height: 4rem;
  border-radius: 2.5rem;
  font-family: Avenir Next Medium;

`