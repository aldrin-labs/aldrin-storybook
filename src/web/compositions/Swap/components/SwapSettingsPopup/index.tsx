import { useInputFocus } from '@webhooks/useInputFocus'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { EscapeButton } from '@sb/components/EscapeButton'
import { CommonPaper } from '@sb/components/Paper'
import { TokenInfo } from '@sb/components/TokenInfo'
import { InlineText } from '@sb/components/Typography'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { numberWithOneDotRegexp } from '@core/utils/helpers'
import {
  getNumberOfDecimalsFromNumber,
  getNumberOfIntegersFromNumber,
} from '@core/utils/numberUtils'

import {
  CustomSlippageContainer,
  CustomSlippageInput,
  PercentageSymbol,
  SlippageButton,
} from './styles'

const slippageButtonsValues = [0.1, 0.5, 1]

export const SwapSettingsPopup = ({
  close,
  open,
  slippage,
  setSlippage,
  baseTokenMintAddress,
  quoteTokenMintAddress,
}: {
  close: () => void
  open: boolean
  slippage: number
  setSlippage: (value: number) => void
  baseTokenMintAddress: string
  quoteTokenMintAddress: string
}) => {
  const [localSlippage, setLocalSlippage] = useState<string | number>(slippage)
  const [isCustomSlippageFocused, setIsCustomSlippageFocused] = useState(false)

  const [inputRef, focusInput] = useInputFocus()

  const setLocalSlippageWithChecks = (slippageFromInput: string) => {
    if (slippageFromInput === '') setLocalSlippage(slippageFromInput)

    if (
      numberWithOneDotRegexp.test(slippageFromInput) &&
      getNumberOfIntegersFromNumber(slippageFromInput) <= 2 &&
      getNumberOfDecimalsFromNumber(slippageFromInput) <= 2
    ) {
      setLocalSlippage(slippageFromInput)
    }
  }

  const closeWithUpdatingSlippage = () => {
    if (+localSlippage > 0) {
      setSlippage(+localSlippage)
    }

    setTimeout(() => close(), 0)
  }

  const isSlippageMatchWithButtons = slippageButtonsValues.includes(
    +localSlippage
  )

  return (
    <DialogWrapper
      PaperComponent={CommonPaper}
      fullScreen={false}
      onClose={closeWithUpdatingSlippage}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between">
        <InlineText color="gray0" size="md" weight={500}>
          Swap Info
        </InlineText>

        <EscapeButton close={close} />
      </RowContainer>
      <RowContainer
        direction="column"
        wrap="nowrap"
        margin="1.5em 0 0 0"
        justify="space-between"
      >
        <RowContainer justify="flex-start">
          <InlineText color="gray3" size="esm">
            Tokens
          </InlineText>
        </RowContainer>
        <RowContainer margin="1em 0 0 0">
          <TokenInfo mint={baseTokenMintAddress} />
        </RowContainer>
        <RowContainer margin="1em 0 0 0">
          <TokenInfo mint={quoteTokenMintAddress} />
        </RowContainer>
      </RowContainer>
      <RowContainer wrap="nowrap" margin="3rem 0" direction="column">
        <RowContainer justify="flex-start">
          <InlineText color="gray3" size="esm">
            Slippage Settings
          </InlineText>
        </RowContainer>
        <RowContainer justify="space-between" margin="0.75em 0 0 0">
          {slippageButtonsValues.map((value) => {
            const isActive =
              !isCustomSlippageFocused && value === +localSlippage

            return (
              <SlippageButton
                isActive={isActive}
                onClick={() => {
                  setLocalSlippage(value)
                }}
                $variant="none"
              >
                <InlineText
                  size="esm"
                  color={isActive ? 'gray0' : 'gray2'}
                  weight={500}
                >
                  {value}%
                </InlineText>
              </SlippageButton>
            )
          })}
        </RowContainer>
        <CustomSlippageContainer
          padding="0 0.75em"
          justify="space-between"
          margin="1em 0 0 0"
          onClick={() => focusInput()}
          isActive={isCustomSlippageFocused || !isSlippageMatchWithButtons}
          isCustomSlippageCorrect={+localSlippage > 0}
        >
          <InlineText size="esm" color="gray2" weight={400}>
            Custom Slippage
          </InlineText>
          <CustomSlippageInput
            ref={inputRef}
            value={localSlippage}
            onFocus={() => setIsCustomSlippageFocused(true)}
            onBlur={() => {
              setIsCustomSlippageFocused(false)
            }}
            onChange={(e) => setLocalSlippageWithChecks(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (+localSlippage > 0) {
                  closeWithUpdatingSlippage()
                }
              }
            }}
          />
          <PercentageSymbol>
            <InlineText size="esm" color="gray2" weight={400}>
              %
            </InlineText>
          </PercentageSymbol>
        </CustomSlippageContainer>
      </RowContainer>
    </DialogWrapper>
  )
}
