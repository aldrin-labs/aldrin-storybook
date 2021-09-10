import React from 'react'
import styled from 'styled-components'
import { StyledTab } from '@sb/components/TradingWrapper/styles'
import { Button, TextField, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

import { CSS_CONFIG } from '@sb/config/cssConfig'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

const styles = {
  button: {
    borderRadius: 3,
    minWidth: 45,
    width: '100%',
    padding: '0px',
    minHeight: 30,
    fontSize: CSS_CONFIG.chart.content.fontSize,
  },
  input: {
    fontSize: CSS_CONFIG.chart.content.fontSize,
  },
}

export const TitleForInput = styled.div`
  width: auto;
  min-height: 3rem;
  white-space: nowrap;
  text-decoration: ${(props) => props.textDecoration || 'none'};
  border: ${(props) =>
    props.theme &&
    props.theme.palette &&
    props.theme.palette.border &&
    props.theme.palette.border.main};
  border-top-left-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
  border-right: none;
  box-shadow: inset 0px 0px 0.2rem rgba(0, 0, 0, 0.15);
  color: ${(props) => props.theme.palette.white.text};
  background-color: ${(props) => props.theme.palette.grey.block};
  font-size: 1.1rem;
  font-family: Avenir Next Demi;
  text-transform: capitalize;
  font-weight: bold;
  align-items: center;
  text-align: center;
  letter-spacing: 0.05rem;
  padding: 0.8rem 1rem;
  &::placeholder {
    color: #abbad1;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const ButtonContainer = styled.div`
  padding-top: 5px;
  text-align: center;
`

export const ByButtonContainer = styled.div`
  padding-top: 10px;
  text-align: center;
`

export const InputTextField = withStyles(styles)(
  ({ classes, endAdornment, ...others }: { classes: any }) => (
    <TextField
      InputProps={{
        className: classes.input,
        endAdornment: endAdornment,
      }}
      fullWidth
      {...others}
    />
  )
)

export const PriceButton = withStyles(styles)(
  ({ classes, children, ...others }: { children: any; classes: any }) => (
    <Button
      className={classes.button}
      variant="outlined"
      size="small"
      {...others}
    >
      {children}
    </Button>
  )
)

export const Container = styled.div`
  height: 100%;

  && {
    background-color: ${(props: { background?: string }) => props.background};
  }
`

export const GridContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 0 1.2rem;
  @media (max-width: 600px) {
    padding: 1.2rem 1rem;
  }
`

export const TerminalGridContainer = styled(GridContainer)`
  @media (max-width: 600px) {
    overflow-y: auto;
  }
`

export const NameHeader = styled.div`
  background: ${(props: { background?: string }) => props.background};
  padding: 0px 8px;
  border-bottom: 1px solid
    ${({ border }: { border?: string; background?: string }) => border};
`

export const TitleContainer = styled.div`
  padding: 4px 0px;
`

export const InputContainer = styled.div`
  padding: 0px;
`

// balance blocks

export const BalanceGrid = styled(Grid)`
  min-height: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-transform: uppercase;
`

export const BalanceTitle = styled(BalanceGrid)`
  align-items: center;
  justify-content: center;
  background: #e0e5ec;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;

  font-size: 1.3rem;
`

export const BalanceItem = styled(BalanceGrid)`
  background: #f2f4f6;
  padding-left: 1.2rem;
  border-left: ${(props) => (props.lastItem ? '1px solid #e0e5ec' : 'none')};
  border-top-right-radius: ${(props) => (props.lastItem ? '4px' : '0')};
  border-bottom-right-radius: ${(props) => (props.lastItem ? '4px' : '0')};
`

export const TradingItemTitle = styled.span`
  display: block;
  color: inherit;
  font-size: 1.2rem;
  letter-spacing: 0.09rem;
  font-family: Avenir Next Medium;
  font-weight: bold;
  text-transform: capitalize;
`

export const InputTitle = styled(TradingItemTitle)`
  color: ${(props) => props.color || '#7284a0'};
  font-size: 1.2rem;
  white-space: nowrap;
  padding: 0 1rem;
  text-transform: capitalize;
  width: 30%;
  text-align: right;
`

export const TradingItemValue = styled.span`
  color: #16253d;
  font-size: 1.2rem;

  font-weight: bold;
`

export const TradingItemSubValue = styled(TradingItemValue)`
  color: #2f7619;
  font-size: 1rem;
  padding-left: 0.4rem;
`

// input with coin inset

export const PaddingGrid = styled(Grid)`
  display: flex;
`

export const TotalGrid = styled(PaddingGrid)`
  padding-bottom: 0;
`

export const TradeBlock = styled(BalanceGrid)`
  border-left: ${(props) =>
    props.position === 'right' ? '1px solid #e0e5ec' : 'none'};

  padding: ${(props) =>
    props.position === 'right' ? '0 0 0 1rem' : '0 1rem 0 0'};
`

export const TradeInput = styled.input`
  width: 100%;
  min-height: 3rem;
  border: ${(props) =>
    props.isValid
      ? `.1rem solid ${props.theme.palette.grey.newborder}` ||
        '.1rem solid #e0e5ec'
      : '.1rem solid #DD6956'};
  border-radius: 0.7rem;
  border-top-right-radius: ${(props) => props.haveSelector && '0'};
  border-bottom-right-radius: ${(props) => props.haveSelector && '0'};
  box-shadow: inset 0px 0px 0.2rem rgba(0, 0, 0, 0.15);
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.dark &&
      props.theme.palette.dark.main) ||
    '#16253D'};
  background-color: ${(props) =>
    props.disabled
      ? (props.theme &&
          props.theme.palette &&
          props.theme.palette.grey &&
          props.theme.palette.grey.background) ||
        '#f2f4f6'
      : (props.theme &&
          props.theme.palette &&
          props.theme.palette.grey &&
          props.theme.palette.grey.terminal) ||
        '#fff'};
  font-size: 1.3rem;

  font-weight: bold;
  padding-left: ${(props) => (props.needCharacter ? '2rem' : '0.6rem')};
  text-align: ${(props) => props.align};
  outline: none;
  padding-right: ${(props) =>
    props.needPadding
      ? `calc(${props.symbolLength}rem + ${
          props.symbolLength < 4 ? '2.5rem' : '2rem'
        })`
      : '1.5rem'};
  &:focus {
    border: 0.14rem solid #a1aaf4;
  }

  &::placeholder {
    color: #abbad1;
    font-family: Avenir Next Medium;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: 600px) {
    height: 6rem;
    border: none;
    border-radius: 2rem;
    font-size: 16px;
    font-family: 'Avenir Next Light';
    margin-bottom: 0.8rem;

    padding-right: ${(props) =>
      props.needPadding
        ? `calc(${props.symbolLength}rem + ${
            props.symbolLength < 4 ? '4.5rem' : '4rem'
          })`
        : '3.5rem'};
  }
`

export const SwitchersContainer = styled(RowContainer)`
  flex-direction: column;
  @media (min-width: 600px) {
    display: none;
  }
`

export const TradeSelect = styled.select`
  position: relative;
  width: 100%;
  min-height: 3rem;
  border: ${(props) =>
    props.isValid
      ? props.theme.palette.border.main
      : `.1rem solid ${props.theme.palette.red.main}`};
  border-radius: 4px;
  box-shadow: inset 0px 0px 0.2rem rgba(0, 0, 0, 0.15);
  color: ${(props) => props.theme.palette.grey.light};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.palette.grey.background
      : props.theme.palette.white.inputBackground};
  font-size: 1.1rem;

  text-transform: uppercase;
  font-weight: bold;
  padding-left: ${(props) => (props.needCharacter ? '2rem' : '0.6rem')};
  outline: none;
`

export const InputWrapper = styled.div`
  position: relative;
  width: 70%;
`

export const Coin = styled(TradingItemTitle)`
  position: absolute;
  top: calc(50% + 0.1rem);
  right: ${({ right }: { right?: string; left?: string }) => right || '1rem'};
  left: ${({ left }: { left?: string; right?: string }) => left || ''};
  transform: translateY(-50%);
  text-transform: capitalize;
  font-size: 1.2rem;
  z-index: 2;
`

export const UpdatedCoin = styled(Coin)`
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.text) ||
    '#7284a0'};

  font-size: 1.2rem;

  @media (max-width: 600px) {
    font-size: 1.6rem;
    font-family: Avenir Next Light;
    right: 2rem;
    top: 45%;
  }
`
// percentages

export const PercentageGrid = styled(Grid)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 1rem;
`

export const PercentageItem = styled(StyledTab)`
  font-size: 1rem;
  width: 22.5%;
`

// send button

export const SendButton = styled(StyledTab)`
  width: 100%;
  color: ${(props) =>
    props.theme &&
    props.theme.palette &&
    props.theme.palette.grey &&
    props.theme.palette.grey.terminal};
  background: ${(props) =>
    props.type === 'buy'
      ? (props.theme &&
          props.theme.palette &&
          props.theme.palette.green &&
          props.theme.palette.green.button) ||
        '#29AC80'
      : (props.theme &&
          props.theme.palette &&
          props.theme.palette.red &&
          props.theme.palette.red.button) ||
        '#DD6956'};
  box-shadow: 0px 0.7rem 1rem rgba(8, 22, 58, 0.3);
  border-radius: 1rem;
  border: none;
  text-transform: capitalize;
  font-family: Avenir Next;

  &:hover {
    background-color: ${(props) =>
      props.type === 'buy'
        ? (props.theme &&
            props.theme.palette &&
            props.theme.palette.green &&
            props.theme.palette.green.main) ||
          '#29AC80'
        : (props.theme &&
            props.theme.palette &&
            props.theme.palette.red &&
            props.theme.palette.red.main) ||
          '#DD6956'};
  }

  @media (max-width: 600px) {
    height: 6rem;
    border-radius: 2rem;
    font-size: 2rem;
  }
`

export const SmartTradeButton = styled(SendButton)`
  line-height: 150%;
  font-size: 1rem;
  background-color: ${(props) =>
    props.type === 'buy'
      ? (props.theme &&
          props.theme.palette &&
          props.theme.palette.blue &&
          props.theme.palette.blue.main) ||
        '#165BE0'
      : (props.theme &&
          props.theme.palette &&
          props.theme.palette.red &&
          props.theme.palette.red.main) ||
        '#DD6956'};

  &:hover {
    background-color: ${(props) =>
      props.type === 'buy'
        ? (props.theme &&
            props.theme.palette &&
            props.theme.palette.blue &&
            props.theme.palette.blue.main) ||
          '#165BE0'
        : (props.theme &&
            props.theme.palette &&
            props.theme.palette.red &&
            props.theme.palette.red.main) ||
          '#DD6956'};
  }

  @media (max-width: 1600px) {
    font-size: 1rem;
  }

  @media screen and (max-width: 1440px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1921px) {
    font-size: 1rem;
  }
`

export const PriceContainer = styled(Grid)``

export const TradeInputBlock = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const SeparateInputTitle = styled.span`
  color: ${(props) => props.theme.palette.dark.main};
  font-size: 1rem;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0.1rem;
  white-space: nowrap;
  cursor: ${(props) => (props.haveTooltip ? 'pointer' : 'normal')};
`

export const BlueInputTitle = styled(SeparateInputTitle)`
  color: #5c8cea;
  cursor: pointer;
`

export const AbsoluteInputTitle = styled(Coin)`
  left: 1rem;
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.custom) ||
    '#ABBAD1'};
  font-size: 1.2rem;
  width: 0;
  white-space: nowrap;
  @media (max-width: 600px) {
    left: 2rem;
    font-size: 1.9rem;
    font-family: Avenir Next Light;
    color: #7284a0;
    top: 45%;
  }
`
export const PercentageTab = styled.button`
  height: 3rem;
  width: 15%;
  border-radius: 1.2rem;
  background: ${(props) => props.theme.palette.grey.terminal};
  border: 0.1rem solid #3a475c;
  font-family: Avenir Next Medium;
  font-size: 1.3rem;
  letter-spacing: 0.01rem;
  color: #93a0b2;
  outline: none;
  cursor: pointer;
  &:focus {
    background: ${(props) => props.theme.palette.blue.serum};
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
    font-family: Avenir Next Demi;
    color: #f8faff;
  }

  @media (max-width: 600px) {
    width: 22%;
    height: 4.5rem;
    border-radius: 1.5rem;
    border: none;
    font-size: 1.5rem;
  }
`
export const ConnectWalletDropdownContainer = styled(RowContainer)`
  @media (max-width: 600px) {
    display: none;
  }
`

export const ConnectWalletButtonContainer = styled(RowContainer)`
  @media (min-width: 600px) {
    display: none;
  }
`

export const ButtonBlock = styled(Grid)`
  max-width: 100%;
  padding-bottom: 1.5rem;
  @media (max-width: 600px) {
    padding-bottom: 0;
    padding-top: 1rem;
    align-items: flex-end;
  }
`

export const PercentageTabsContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    margin-top: 3rem;

    button:first-child {
      display: none;
    }
  }
`

export const AmountTooltip = styled.div`
  width: 5%;
  @media (max-width: 600px) {
    display: none;
  }
`
export const Placeholder = styled.div`
  font-size: 1.2rem;
  width: 100%;
  height: ${props => props.height || '4rem'};
  background: #383b45;
  border-radius: 1rem;
  padding: 0 2rem;
  font-family: Avenir Next Medium;
  color: #f69894;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-derection: column;
`

export const ReverseInputContainer = styled.div`
  width: 100%;
  height: auto;
  @media (min-width: 600px) {
    display: none;
  }
`
export const StyledInputsContainer = styled.div`
  width: 100%;
  @media (max-width: 600px) {
    display: ${(props) => (props.mode === 'market' ? 'auto' : 'none')};
  }
`
