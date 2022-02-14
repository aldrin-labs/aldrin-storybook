import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Button } from '../Button'
import { Input } from '../Input'
import { InputEl, Append } from '../Input/styles'
import { InlineText } from '../Typography'
import WalletIcon from './wallet.svg'

export const AmountInputElement = styled(Input)`
  height: 4.25em;
  background-color: ${COLORS.cardsBack};
  border: 0.1rem solid ${COLORS.background};

  &:focus {
    border: 0.1rem solid ${COLORS.gray2};
  }

  ${InputEl} {
    padding-left: 0.7em;
    flex: 0 1 auto;
    min-width: 0;
  }

  ${Append} {
    padding-right: 0.7em;
    flex: 1;
  }
`

export const ButtonsWithAmount = styled.div`
  margin-left: auto;
  text-align: right;

  ${InlineText} {
    font-size: 0.75em;
    background: url(${WalletIcon}) right center no-repeat;
    padding-right: 22px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;

  ${Button} {
    margin: 0 2px;
    background: ${COLORS.black};
    border: 0;
    color: ${COLORS.newOrange};
    font-weight: 600;
    text-align: center;

    &:last-child {
      margin-right: 0;
    }
  }
`

export const TokenNameWrap = styled.span`
  padding-top: 1.5em;
  color: ${COLORS.white};
  font-weight: bold;
`
