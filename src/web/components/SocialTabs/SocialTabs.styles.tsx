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

export const StyledTabs = styled(Tabs)`
  @media (min-width: 2560px) {
    & > * {
      width: 100%;
    }
  }
`

export const StyledTab = styled(Tab)`
  @media (min-width: 2560px) {
    font-size: 1.4rem;
    max-width: 50%;
  }
`

export const StyledFollowingTab = styled(StyledTab)`
  @media (min-width: 2560px) {
    margin-left: 0;
    padding: 1rem 0;
  }
`

export const StyledMyTab = styled(StyledTab)`
  @media (min-width: 2560px) {
    margin-right: 0;
    padding: 1rem 0;
  }
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
  /* &&& {
           color: red;
         } */
  /* 
         font-size: 1.2rem;
         color: green;
         border-top: 1px solid #e0e5ec;
         border-left: 1px solid #e0e5ec;
         border-right: 1px solid #e0e5ec;
         border-radius: 22px 22px 0 0;
         width: 60px;
         :visited {
           color: red;
         } */
`
