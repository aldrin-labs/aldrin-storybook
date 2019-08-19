import styled from 'styled-components'
import { Card, Tabs, Tab, Button } from '@material-ui/core'
import { customAquaScrollBar } from '../cssUtils'

export const TablesBlockWrapper = styled(Card)`
  width: 100%;
  margin-bottom: 4px;
  height: calc(100% - 4px);
  border-radius: 0;
  padding-right: 0;
  && {
    box-shadow: none !important;
  }
`

export const TerminalContainer = styled.div`
  padding: 5px;
`

export const ScrollWrapper = styled.div`
  height: calc(100% - 40px);
  && {
    overflow-y: scroll;
  }
`

export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0.5rem;
  border-top: 1px solid #e0e5ec;
  border-bottom: 1px solid #e0e5ec;
`

export const TabsTypeContainer = styled(TabsContainer)`
  border: none;
`

export const StyledTab = styled(Button)`
  min-width: auto;
  width: 30%;
  min-height: 3rem;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: Trebuchet MS;
  letter-spacing: 1.5px;
  transition: 0.3s all;

  background: ${(props) => (props.active ? '#165BE0' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#165BE0')};
  border: 1px solid #165be0;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => (props.active ? '#165BE0' : '#F2F4F6')};
  }

  @media (max-width: 1400px) {
    padding: 7px 0 5px 0;
  }
`

export const BuyTab = styled(StyledTab)`
  width: 47.5%;
  background: ${(props) => (props.active ? '#2F7619' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#2F7619')};
  border: 1px solid #2f7619;

  &:hover {
    background-color: ${(props) => (props.active ? '#2F7619' : '#F2F4F6')};
  }
`

export const SellTab = styled(StyledTab)`
  width: 47.5%;
  background: ${(props) => (props.active ? '#B93B2B' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#B93B2B')};
  border: 1px solid #b93b2b;

  &:hover {
    background-color: ${(props) => (props.active ? '#B93B2B' : '#F2F4F6')};
  }
`
