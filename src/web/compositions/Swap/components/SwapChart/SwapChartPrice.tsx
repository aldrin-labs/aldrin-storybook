import React, { useState } from 'react'
import styled from 'styled-components'

import { SvgIcon } from '@sb/components'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { stripByAmount } from '@core/utils/numberUtils'

import HalfArrowsIcon from '@icons/halfArrows.svg'

import { getEstimatedPrice } from '../../utils'

const SymbolText = styled(InlineText)`
  letter-spacing: -0.05em;
`

interface SwapChartPriceProps {
  inputSymbol: string
  outputSymbol: string
  inputTokenMintAddress: string
  outputTokenMintAddress: string
  pricesMap: Map<string, number>
}

const SwapChartPrice = (props: SwapChartPriceProps) => {
  const {
    inputSymbol,
    outputSymbol,
    inputTokenMintAddress,
    outputTokenMintAddress,
    pricesMap,
  } = props

  const [priceShowField, setPriceShowField] = useState<'input' | 'output'>(
    'input'
  )

  const isInputPriceShowField = priceShowField === 'input'

  const basePrice = pricesMap.get(inputSymbol) || 0
  const quotePrice = pricesMap.get(outputSymbol) || 0

  const estimatedPrice = stripByAmount(
    getEstimatedPrice({
      inputPrice: basePrice,
      outputPrice: quotePrice,
      field: priceShowField,
    })
  )

  return (
    <RowContainer justify="space-between">
      <Row>
        <SymbolText color="white1" size="md" weight={700}>
          {stripByAmount(estimatedPrice)}{' '}
          <SymbolText color="white2" size="md" weight={600}>
            {isInputPriceShowField ? outputSymbol : inputSymbol} per{' '}
            {isInputPriceShowField ? inputSymbol : outputSymbol}
          </SymbolText>
        </SymbolText>
      </Row>
      <Row align="center">
        <TokenIcon
          mint={
            isInputPriceShowField
              ? inputTokenMintAddress
              : outputTokenMintAddress
          }
          size={16}
          margin="0 0.2em 0 0"
        />
        <InlineText color="white2" size="md" weight={500}>
          {isInputPriceShowField ? inputSymbol : outputSymbol}
        </InlineText>
        <Row margin="0 0.5em">
          <InlineText color="white3" size="md" weight={500}>
            /
          </InlineText>
        </Row>
        <TokenIcon
          mint={
            isInputPriceShowField
              ? outputTokenMintAddress
              : inputTokenMintAddress
          }
          size={16}
          margin="0 0.2em 0 0"
        />
        <InlineText>
          {isInputPriceShowField ? outputSymbol : inputSymbol}
        </InlineText>
        <Row
          margin="0 0 0 0.5em"
          style={{ cursor: 'pointer' }}
          onClick={() =>
            setPriceShowField(isInputPriceShowField ? 'output' : 'input')
          }
        >
          <SvgIcon src={HalfArrowsIcon} width="0.8em" height="0.8em" />
        </Row>
      </Row>
    </RowContainer>
  )
}

export { SwapChartPrice }
