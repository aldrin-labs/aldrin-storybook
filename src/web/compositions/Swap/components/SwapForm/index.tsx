import { useFormikContext } from 'formik'
import React, { useState } from 'react'

import { BlockContent } from '@sb/components/Block'
import { FlexBlock } from '@sb/components/Layout'
import { ReloadTimer } from '@sb/components/ReloadTimer'
import { TimerButton } from '@sb/components/ReloadTimer/styles'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenAmountInputField } from '@sb/components/TokenAmountInput'
import { InlineText } from '@sb/components/Typography'

import Gear from '@icons/gear.svg'

import InfoIcon from '../../img/info-icon.svg'
import { TokenAddressesPopup } from '../TokenAddressesPopup'
import { TransactionSettingsPopup } from '../TransactionSettingsPopup'
import { Form, FormButton, InputWrap, STokenSelectorField } from './styles'
import { SwapFormModel, SwapFormProps } from './types'

export const SwapForm: React.FC<SwapFormProps> = (props) => {
  const { tokens, refreshAll } = props
  const form = useFormikContext<SwapFormModel>()
  const [tokenPopupOpen, setTokenPopupOpen] = useState(false)
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false)

  const { errors } = form
  const error = Object.values(errors)[0]

  return (
    <Form>
      <BlockContent>
        <FlexBlock alignItems="center" justifyContent="space-between">
          <InlineText size="sm">
            Slippage Tolerance: <b>{form.values.slippageTolerance}%</b>
          </InlineText>
          <FlexBlock alignItems="center">
            <ReloadTimer duration={60} color="success" callback={refreshAll} />
            <TimerButton onClick={() => setTokenPopupOpen(true)}>
              <SvgIcon src={InfoIcon} />
            </TimerButton>
            <TimerButton margin="0" onClick={() => setSettingsPopupOpen(true)}>
              <SvgIcon src={Gear} width="60%" height="60%" />
            </TimerButton>
          </FlexBlock>
        </FlexBlock>
      </BlockContent>
      <BlockContent>
        <InputWrap>
          <TokenAmountInputField
            name="amountFrom"
            setFieldValue={form.setFieldValue}
            available={form.values.marketFrom.balance}
          >
            <STokenSelectorField tokens={tokens} name="marketFrom" />
          </TokenAmountInputField>
        </InputWrap>
        <InputWrap>
          <TokenAmountInputField
            name="amountTo"
            setFieldValue={form.setFieldValue}
            available={form.values.marketTo.balance}
          >
            <STokenSelectorField tokens={tokens} name="marketTo" />
          </TokenAmountInputField>
        </InputWrap>
      </BlockContent>
      <BlockContent>
        <FormButton $padding="lg" disabled={!!error}>
          {error || 'Swap'}
        </FormButton>
      </BlockContent>
      {tokenPopupOpen && (
        <TokenAddressesPopup
          open
          close={() => setTokenPopupOpen(false)}
          baseTokenMintAddress={form.values.marketFrom.mint}
          quoteTokenMintAddress={form.values.marketTo.mint}
        />
      )}
      {settingsPopupOpen && (
        <TransactionSettingsPopup
          open
          close={() => setSettingsPopupOpen(false)}
          slippageTolerance={form.values.slippageTolerance}
          setSlippageTolerance={(v) =>
            form.setFieldValue('slippageTolerance', v)
          }
        />
      )}
    </Form>
  )
}
