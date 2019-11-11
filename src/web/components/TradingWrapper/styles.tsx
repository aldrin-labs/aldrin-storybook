import React from 'react'
import styled from 'styled-components'
import { Card, Tabs, Tab, Button, Grid } from '@material-ui/core'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { customAquaScrollBar } from '../cssUtils'

export const TablesBlockWrapper = styled(Grid)`
  width: 100%;
  height: 100%;
  border-radius: 0;
  padding-right: 0;
  border: none;

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

export const TerminalHeader = styled.div`
  background-color: #f2f4f6;
  border-bottom: 0.1rem solid #e0e5ec;
`

export const TerminalModeButton = styled(({ isActive, children, ...rest }) => (
  <BtnCustom
    fontSize="1.3rem"
    padding=".35rem 4rem .1rem 4rem"
    btnWidth="auto"
    height="auto"
    btnColor={isActive ? '#fff' : '#16253D'}
    backgroundColor={isActive ? '#5C8CEA' : '#f2f4f6'}
    borderColor="#e0e5ec"
    borderWidth="0"
    borderRadius="0"
    {...rest}
  >
    {children}
  </BtnCustom>
))``
