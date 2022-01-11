import styled from 'styled-components'

import { Button } from '@sb/components/Button'
import { TokenSelectorField } from '@sb/components/TokenSelector'
import { TokenRow } from '@sb/components/TokenSelector/styles'

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
