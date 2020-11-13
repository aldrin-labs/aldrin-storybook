import React from 'react'
import styled from 'styled-components'
import { StyledTab } from '@sb/components/TradingWrapper/styles'
import { Button, TextField, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

import { CSS_CONFIG } from '@sb/config/cssConfig'

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
  font-size: 0.9rem;
  letter-spacing: 0.05rem;

  font-weight: bold;
`

export const InputTitle = styled(TradingItemTitle)`
  color: ${(props) => props.color || '#7284a0'};
  font-size: 1rem;
  white-space: nowrap;
  text-transform: uppercase;
  padding: 0 1rem;
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
      ? (props.theme &&
          props.theme.palette &&
          props.theme.palette.border &&
          props.theme.palette.border.main) ||
        '.1rem solid #e0e5ec'
      : '.1rem solid #DD6956'};
  border-radius: 4px;
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
          props.theme.palette.white &&
          props.theme.palette.white.inputBackground) ||
        '#fff'};
  font-size: 1.3rem;
  font-family: Avenir Next Demi;
  font-weight: bold;
  padding-left: ${(props) => (props.needCharacter ? '2rem' : '0.6rem')};
  text-align: ${(props) => props.align};
  outline: none;
  padding-right: ${(props) => (props.needPadding ? '4rem' : '1.5rem')};

  &::placeholder {
    color: #abbad1;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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
  text-transform: uppercase;
  z-index: 2;
`

export const UpdatedCoin = styled(Coin)`
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.text) ||
    '#7284a0'};
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
  margin: auto 0.5rem;
  color: #0B0B0E;
  background-color: ${(props) =>
    props.type === 'buy'
      ? (props.theme &&
          props.theme.palette &&
          props.theme.palette.green &&
          props.theme.palette.green.main) ||
        '#5BC9BB'
      : (props.theme &&
          props.theme.palette &&
          props.theme.palette.red &&
          props.theme.palette.red.main) ||
        '#F07878'};
  box-shadow: 0px 0.7rem 1rem rgba(8, 22, 58, 0.3);
  border-radius: 0;
  border: none;

  &:hover {
    color: #fff;
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
`

export const ChangeTradeButton = styled.button`
  border: none;
  width: 100%;
  // background: white;
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.5px;
  font-family: DM Sans, sans-serif;
  font-size: 1.4rem;
  line-height: 1.9rem;
  align-items: center;
  outline: none;
`

export const ChangeTerminalButton = styled.div`
  background-color: theme.palette.white;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
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
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  white-space: nowrap;
  cursor: ${(props) => (props.haveTooltip ? 'pointer' : 'normal')};
`

export const BlueInputTitle = styled(SeparateInputTitle)`
  color: #ADD78E;
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
  font-size: 0.9rem;
  width: 0;
  white-space: nowrap;
`
