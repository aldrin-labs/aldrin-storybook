import React from 'react'
import styled from 'styled-components'
import { StyledTab } from '@sb/components/TradingWrapper/styles'
import { Button, TextField, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

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
  padding: 0 2.5rem 0 0;
  border-right: ${props => props.isBuyType && '.1rem solid #e0e5ec;'}
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
  color: #7284a0;
  font-size: 1.2rem;
  
  font-weight: bold;
`

export const InputTitle = styled(TradingItemTitle)`
  color: #7284A0;
  font-size: 1rem;
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
  padding: .8rem 0;
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
  position: relative;
  width: 100%;
  min-height: 3rem;
  border: 1px solid #e0e5ec;
  border-radius: 4px;
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.15);
  margin-top: 0.2rem;
  color: #16253d;
  font-size: 1.2rem;
  
  font-weight: bold;
  padding-left: 0.6rem;
  outline: none;

  &::after {
    content: '${(props) => props.text}';
    position: absolute;
    right: 20px;
    top: 50%;
  }
`

export const InputWrapper = styled.div`
  position: relative;
  width: 70%;
`

export const Coin = styled(TradingItemTitle)`
  position: absolute;
  top: 52.5%;
  right: 20px;
  transform: translateY(-50%);
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
  background: #fff;
  color: ${(props) => (props.type === 'buy' ? '#2F7619' : '#b93b2b')};
  border: 1px solid ${(props) => (props.type === 'buy' ? '#2F7619' : '#b93b2b')};

  &:hover {
    color: #fff;
    background-color: ${(props) =>
    props.type === 'buy' ? '#2F7619' : '#b93b2b'};
  }
`

export const PriceContainer = styled(Grid)`
  padding-bottom: .8rem;
`

export const TradeInputBlock = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`
