import { useField } from 'formik'
import React, { useState } from 'react'

import { GroupLabel } from '../FormElements/GroupLabel'
import { TokenIconWithName } from '../TokenIcon'
import { SelectTokenModal, Token } from './SelectTokenModal'
import { Container, DropdownArrow, TokenRow } from './styles'

interface TokenSelectorBaseprops {
  tokens: Token[]
  label?: string
  disabled?: boolean
}

interface TokenSelectorProps extends TokenSelectorBaseprops {
  value?: Token
  onChange: (token: Token) => void
}

export const TokenSelector: React.FC<TokenSelectorProps> = (props) => {
  const { value, tokens, onChange, label, disabled } = props

  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div>
      {label && <GroupLabel label={label} />}
      <Container
        alignItems="center"
        onClick={() => {
          if (!disabled) {
            setModalOpen(true)
          }
        }}
      >
        {value ? (
          <>
            <TokenRow alignItems="center">
              <TokenIconWithName mint={value.mint} />
            </TokenRow>
          </>
        ) : (
          'Please select...'
        )}
        {!disabled && <DropdownArrow />}
      </Container>

      {modalOpen && (
        <SelectTokenModal
          onSelect={onChange}
          tokens={tokens}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

interface TokenSelectorFieldProps extends TokenSelectorBaseprops {
  name: string
}

// Formik Wrapper

export const TokenSelectorField: React.FC<TokenSelectorFieldProps> = (
  props
) => {
  const [field, meta, helpers] = useField(props)

  return (
    <TokenSelector
      {...props}
      value={field.value}
      onChange={(value) => {
        helpers.setTouched(true, true)
        helpers.setValue(value, true)
      }}
    />
  )
}
