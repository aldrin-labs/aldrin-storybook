import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'

export const NavBarForSmallScreens = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 12rem;
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
  height: calc(100% - 24rem);
  background: #17181a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3rem;
  margin: 0;
  box-shadow: none;
`
