import React from 'react'
import styled from 'styled-components'
import { Card, Tabs, Tab, Button, Grid } from '@material-ui/core'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { customAquaScrollBar } from '../cssUtils'

export const TablesBlockWrapper = styled(Grid)`
  border-radius: 0;
  padding-right: 0;
  border: none;
  position: relative;

  && {
    box-shadow: none !important;
  }
`

export const TerminalContainer = styled.div`
  height: 100%;
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
  height: 3.5rem;
  font-size: 1.3rem;
  font-weight: bold;

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
  position: relative;
  background-color: #f2f4f6;
  border-bottom: 0.1rem solid #e0e5ec;
`

export const TerminalMainGrid = styled(Grid)`
  height: calc(
    100% - ${(props) => (props.marketType === 0 ? '3rem' : '5.2rem')}
  );
`

export const FullHeightGrid = styled(Grid)`
  height: 100%;
  border-right: ${(props) => props.needBorderRight && '.1rem solid #e0e5ec;'};
`

export const TerminalModeButton = styled(({ isActive, children, ...rest }) => (
  <BtnCustom
    fontSize="1.3rem"
    padding=".35rem 3.5rem .1rem 3.5rem"
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

export const TradingMenuContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`

export const LeverageContainer = styled(TradingMenuContainer)`
  margin: 0.2rem 0;
  padding: 0.5rem;
  border-left: 0.1rem solid #e0e5ec;
`

export const LeverageLabel = styled.label`
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.05rem;
  color: #16253d;
`

export const LeverageTitle = styled(LeverageLabel)`
  width: 22.5%;
  margin-left: -0.5rem;
`

export const SettingsContainer = styled(TradingMenuContainer)`
  width: calc(50% - 1px);
`

export const SettingsLabel = styled(LeverageLabel)`
  color: #7284a0;
`

export const StyledSelect = styled.select`
  background: ${(props) => !props.disabled && '#ffffff'};
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.2rem;
  padding: 0.2rem;
  margin: 0 0.5rem;
  color: #7284a0;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
`

export const StyledOption = styled.option`
  font-size: 1.1rem;
  padding: 0.3rem 0;
`

export const StyledZoomIcon = styled(ZoomOutMapIcon)`
  height: 2rem;
  width: 2rem;
`

export const SmartOrderModeButton = styled(TerminalModeButton)`
  padding-right: 1rem;
  position: absolute;
  right: 0;
`
