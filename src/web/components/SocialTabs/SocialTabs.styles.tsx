import styled from 'styled-components'
import { AppBar, Tabs, Tab } from '@material-ui/core'

export const MainContainer = styled.div`
  background-color: ${(props) => props.bgColor};
  border-left: 1px solid #e0e5ec;
  border-right: 1px solid #e0e5ec;
  border-bottom: 1px solid #e0e5ec;
  border-radius: 22px 22px 22px 22px;
  margin: auto;
  width: 100%;
`

export const TabContainerCustom = styled.div`
  box-shadow: none;
  border-left: 1px solid #e0e5ec;
  border-right: 1px solid #e0e5ec;
  border-bottom: 1px solid #e0e5ec;
`

export const AppBarCustom = styled(AppBar)`
  background: transparent;
  box-shadow: none;
`

export const TabsCustom = styled(Tabs)`
  background: transparent;
  box-shadow: none;
`
export const TabCustom = styled(Tab)`
  font-size: 1.2rem;
  color: black;
  border-top: 1px solid #e0e5ec;
  border-left: 1px solid #e0e5ec;
  border-right: 1px solid #e0e5ec;
  border-radius: 22px 22px 0 0;
  width: 60px;
  :visited {
    color: red;
  }
`
