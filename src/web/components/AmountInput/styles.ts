import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Button } from '../Button'
import { Input } from '../Input'
import { InputEl, Append } from '../Input/styles'
import { InlineText } from '../Typography'
import WalletIcon from './wallet.svg'

export const AmountInputElement = styled(Input)`
  height: 4.25em;
  background-color: ${(props) => props.theme.colors.white5};
  border: 0.1rem solid ${(props) => props.theme.colors.white4};
  user-select: none;

  &:focus {
    border: 0.1rem solid ${(props) => props.theme.colors.white2};
  }

  ${InputEl} {
    padding-left: 0.7em;
    flex: 0 1 auto;
    min-width: 0;
    overflow: visible;
    padding-right: 3em;
    width: 115%;
  }

  ${Append} {
    padding-right: 0.7em;
    flex: 1;
  }
`

export const MaxValue = styled(InlineText)``

export const ButtonsWithAmount = styled.div`
  margin-left: auto;
  text-align: right;

  ${InlineText} {
    font-size: 0.75em;
  }

  ${MaxValue} {
    background: url(${WalletIcon}) right center no-repeat;
    padding-right: 22px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
  justify-content: flex-end;

  ${Button} {
    margin: 0 2px;
    background: ${(props) => props.theme.colors.white6};
    border: 0;
    color: ${(props) => props.theme.colors.red1};
    font-weight: 600;
    text-align: center;

    &:last-child {
      margin-right: 0;
    }
  }
`

export const TokenNameWrap = styled.span`
  padding-top: 1.5em;
  color: ${COLORS.hint};
  font-weight: bold;
`

export const ButtonsBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex: 1;
`
