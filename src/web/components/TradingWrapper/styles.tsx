import React from 'react'
import styled from 'styled-components'
import { Button, Grid } from '@material-ui/core'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'

export const TablesBlockWrapper = styled(Grid)`
  border-radius: 0;
  padding-right: 0;
  border: none;
  position: relative;
  height: ${({
    isDefaultTerminalViewMode,
  }: {
    isDefaultTerminalViewMode: boolean
  }) => (isDefaultTerminalViewMode ? '40%' : '50%')};

  && {
    box-shadow: none !important;
  }

  @media (max-width: 600px) {
    max-width: 50%;
    flex-basis: 50%;
    height: 60%;
    display: ${(props) =>
      props.terminalViewMode === 'fullScreenTablesMobile' ||
      props.terminalViewMode === 'mobileChart'
        ? 'none'
        : 'flex'};
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

export const StyledTab = styled(({ active, ...rest }) => <Button {...rest} />)`
  min-width: auto;
  width: 30%;
  height: 4rem;
  font-size: 1.5rem;
  font-weight: bold;

  letter-spacing: 1.5px;
  transition: 0.3s all;

  background: ${(props) => (props.active ? '#651CE4' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#651CE4')};
  border: 1px solid #651CE4;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => (props.active ? '#651CE4' : '#F2F4F6')};
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
  width: 100%;
  display: flex;
  position: relative;
  background-color: ${(props) => props.theme.palette.grey.main};
  border-bottom: ${(props) => props.theme.palette.border.main};

  @media (max-width: 600px) {
    display: none;
  }
`

export const TerminalMainGrid = styled(({ marketType, ...rest }) => (
  <Grid {...rest} />
))`
  height: calc(
    100% - ${(props) => (props.marketType === 0 ? '3.4rem' : '5.2rem')}
  );
  @media (max-width: 600px) {
    height: 100%;
  }
`

export const FullHeightGrid = styled(({ needBorderRight, ...rest }) => (
  <Grid {...rest} />
))`
  height: 100%;
  border-right: ${(props) =>
    props.needBorderRight && props.theme.palette.border.main};
`
export const BuyTerminal = styled(FullHeightGrid)`
  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
`

export const SellTerminal = styled(FullHeightGrid)`
  @media (max-width: 600px) {
    display: none;
  }
`

export const TerminalModeButton = styled(
  ({ isActive, children, MASTER_BUILD, ...rest }) => (
    <button
      // fontSize="1.3rem"
      // padding=""
      // btnWidth="auto"
      // height="auto"
      // btnColor={isActive ? '#fff' : '#16253D'}
      // backgroundColor={isActive ? '#5C8CEA' : '#f2f4f6'}
      // borderColor="#e0e5ec"
      // borderWidth="0"
      // borderRadius="0"
      {...rest}
    >
      {children}
    </button>
  )
)`
  height: auto;
  font-size: 1.3rem;
  font-weight: normal;
  letter-spacing: 0.05rem;
  width: 12.5%;
  color: ${(props: { active: boolean; theme: Theme }) =>
    props.active
      ? props.theme.palette.blue.serum
      : props.theme.palette.dark.main};
  background-color: ${(props) => props.theme.palette.grey.main};
  border-right: ${(props) => props.theme.palette.border.main};
  border-left: ${(props) => props.borderLeft || 'none'};
  font-family: ${(props: { active: boolean; theme: Theme }) =>
    props.active ? 'Avenir Next Demi' : 'Avenir Next Medium'};
  border-bottom: ${(props: { active: boolean; theme: Theme }) =>
    props.active ? `0.2rem solid ${props.theme.palette.blue.serum}` : 'none'};
  border-top: none;
  text-transform: none;
  white-space: nowrap;
  padding: 1rem 0;
  line-height: 1rem;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 1600px) {
    padding: 1rem 2rem;
  }
`

export const TradingMenuContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`

export const LeverageContainer = styled(TradingMenuContainer)`
  margin: 0.2rem 0;
  padding: 0.5rem;
  border-left: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.border &&
      props.theme.palette.border.main) ||
    '.1rem solid #e0e5ec'};
`

export const LeverageLabel = styled.label`
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.05rem;
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.dark &&
      props.theme.palette.dark.main) ||
    '#16253D'};
`

export const LeverageTitle = styled(LeverageLabel)`
  width: 22.5%;
  margin-left: -0.5rem;
  margin-right: 2rem;
`

export const SettingsContainer = styled(TradingMenuContainer)`
  width: calc(50% - 1px);
`

export const SettingsLabel = styled(LeverageLabel)`
  text-transform: capitalize;
  white-space: nowrap;
  font-size: 1.1rem;
  font-family: Avenir Next Medium;
  cursor: pointer;
  color: ${(props) => props.theme.palette.grey.light || '#7284a0'};
`

export const StyledSelect = styled.select`
  width: 100%;
  background: ${(props) =>
    (!props.disabled && props.theme.palette.white.background) || '#16253D'};
  border: ${(props) =>
    props.theme.palette.border.main || '.1rem solid #e0e5ec'};
  border-radius: 0.2rem;
  padding: 0.2rem;
  margin: 0 0.5rem;
  color: ${(props) => props.theme.palette.grey.light || '#7284a0'};
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
  text-transform: none;
  /* padding: 0.25rem 1rem 0.1rem 2rem; */
  border-top-right-radius: 0.75rem;
  position: absolute;
  right: 0;
  color: #0b1fd1;
  border: 0.1rem solid #0b1fd1;
`

export const FuturesSettings = styled.div`
  display: flex;
  align-items: center;
`

export const TerminalModeButtonWithDropdown = styled(TerminalModeButton)`
  position: relative;
  &:hover > div {
    display: block;
  }
`

export const DropdownItemsBlock = styled.div`
  display: none;
  position: absolute;
  width: calc(100% + 0.3rem);
  left: -0.1rem;
  top: calc(100% + 0.1rem);
  z-index: 10;
`

export const SpotBalanceSpan = styled.span`
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
`

export const TerminalComponentsContainer = styled(Grid)`
  @media (max-width: 600px) {
    display: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? 'none' : 'block'};
  }
`
