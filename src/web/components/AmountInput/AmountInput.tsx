import React from 'react'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { getTokenNameByMintAddress } from '../../dexUtils/markets'
import { useTokenInfos } from '../../dexUtils/tokenRegistry'
import { Button } from '../Button'
import { INPUT_FORMATTERS } from '../Input'
import { FlexBlock } from '../Layout'
import { InlineText } from '../Typography'
import {
  AmountInputElement,
  ButtonsContainer,
  ButtonsWithAmount,
  TokenNameWrap,
} from './styles'
import { AmountInputProps } from './types'

export const AmountInput: React.FC<AmountInputProps> = (props) => {
  const {
    amount,
    mint,
    value,
    onChange,
    name,
    placeholder,
    className,
    size,
    label,
    showButtons = true,
  } = props

  const inputSize = size || `${value}`.length || 1

  const maxButtonOnClick = () => {
    onChange(`${amount}`)
  }

  const halfButtonOnClick = () => {
    onChange(`${amount / 2}`)
  }

  const tokensMap = useTokenInfos()

  const tokenName =
    tokensMap.get(mint)?.symbol || getTokenNameByMintAddress(mint)

  return (
    <AmountInputElement
      className={className}
      borderRadius="md"
      value={value}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      size={inputSize}
      label={label}
      append={
        <FlexBlock
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TokenNameWrap>{tokenName}</TokenNameWrap>
          <ButtonsWithAmount>
            <InlineText color="success" weight={600}>
              {stripByAmountAndFormat(amount)}
            </InlineText>
            {showButtons && (
              <>
                <ButtonsContainer>
                  <Button
                    minWidth="2rem"
                    $fontSize="xs"
                    $borderRadius="xxl"
                    onClick={halfButtonOnClick}
                    type="button"
                    $variant="primary"
                  >
                    Half
                  </Button>
                  <Button
                    minWidth="2rem"
                    $fontSize="xs"
                    $borderRadius="xxl"
                    onClick={maxButtonOnClick}
                    type="button"
                    $variant="primary"
                  >
                    Max
                  </Button>
                </ButtonsContainer>
              </>
            )}
          </ButtonsWithAmount>
        </FlexBlock>
      }
      formatter={INPUT_FORMATTERS.DECIMAL}
    />
  )
}
