import React from 'react'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { formatNumberToUSFormat } from '@core/utils/PortfolioTableUtils'

import { getTokenNameByMintAddress } from '../../dexUtils/markets'
import { useTokenInfos } from '../../dexUtils/tokenRegistry'
import { Button } from '../Button'
import { INPUT_FORMATTERS } from '../Input'
import { InlineText } from '../Typography'
import {
  AmountInputElement,
  ButtonsContainer,
  ButtonsWithAmount,
  MaxValue,
  ButtonsBlock,
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
    usdValue,
    disabled,
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
      value={value ? formatNumberToUSFormat(value) : ''}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      size={inputSize}
      label={label}
      disabled={disabled}
      append={
        <ButtonsBlock>
          <TokenNameWrap>{tokenName}</TokenNameWrap>
          <ButtonsWithAmount>
            <MaxValue color="success" weight={600}>
              {stripByAmountAndFormat(amount)}
            </MaxValue>
            {!!(showButtons || Number.isFinite(usdValue)) && (
              <ButtonsContainer>
                <div>
                  {Number.isFinite(usdValue) && (
                    <InlineText color="hint">
                      ≈${stripByAmountAndFormat(usdValue || 0, 2)}
                    </InlineText>
                  )}
                </div>

                {showButtons && (
                  <>
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
                  </>
                )}
              </ButtonsContainer>
            )}
          </ButtonsWithAmount>
        </ButtonsBlock>
      }
      formatter={INPUT_FORMATTERS.DECIMAL}
    />
  )
}
