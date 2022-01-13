import styled from 'styled-components'

import { Button } from '@sb/components/Button'
import { FlexBlock } from '@sb/components/Layout'
import { TokenSelectorField } from '@sb/components/TokenSelector'
import { TokenRow } from '@sb/components/TokenSelector/styles'

import { BORDER_RADIUS, COLORS } from '@variables/variables'

export const FormButton = styled(Button)`
  width: 100%;
`

export const STokenSelectorField = styled(TokenSelectorField)`
  border: 0;
  height: auto;
  margin: 0;
  padding: 0;

  ${TokenRow} {
    width: auto;
    padding: 5px 0 0;
  }
`

export const InputWrap = styled.div`
  margin: 20px 0;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`

export const SwitchButton = styled.div`
  margin: 5px 20px;
  cursor: pointer;
`

export const SwapInfoBlock = styled.div`
  background: ${COLORS.swapBlockBg};
  border-radius: ${BORDER_RADIUS.md};
  padding: 10px 20px;
  margin: 0 20px;

  ${FlexBlock} {
    margin: 10px 0;
  }
`
