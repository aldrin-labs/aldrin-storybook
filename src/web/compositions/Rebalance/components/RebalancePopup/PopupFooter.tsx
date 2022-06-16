import React from 'react'
import { useTheme } from 'styled-components'

import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import Info from '@icons/inform.svg'

import { TooltipText } from './styles'

export const PopupFooter = ({
  totalFeesUSD,
  totalFeesSOL,
}: {
  totalFeesUSD: number
  totalFeesSOL: number
}) => {
  const theme = useTheme()

  return (
    <RowContainer justify="space-between">
      <InlineText
        style={{
          whiteSpace: 'nowrap',
          fontSize: '1.6rem',
        }}
      >
        Est. Fees Amount
      </InlineText>

      <DarkTooltip
        maxWidth="40rem"
        title={
          <div style={{ padding: '2rem' }}>
            <TooltipText>
              If there is no direct market between the tokens you want to swap,
              the algorithm will find the best way through multiple markets.
            </TooltipText>
            <TooltipText>
              For example: SOL{'>'}USDC, then USDC{'>'}CCAI.
            </TooltipText>
            <TooltipText style={{ paddingTop: '2rem' }}>
              All fees required for this transaction are calculated as follows.
            </TooltipText>
            <TooltipText
              style={{ fontFamily: 'Avenir Next Demi', paddingTop: '2rem' }}
            >
              Required:
            </TooltipText>
            <TooltipText>Solana transaction fee.</TooltipText>
            <TooltipText>Serum trade fee. </TooltipText>
            <TooltipText>Solana settle transaction fee. </TooltipText>
            <TooltipText
              style={{ fontFamily: 'Avenir Next Demi', paddingTop: '2rem' }}
            >
              One Time Fee:
            </TooltipText>
            <TooltipText>
              Limited Serum trade account creation fee (If this is your first
              time trading this pair)
            </TooltipText>
          </div>
        }
      >
        <Row>
          <InlineText
            style={{
              whiteSpace: 'nowrap',
              fontSize: '1.9rem',
            }}
          >
            ${totalFeesUSD.toFixed(2)}
          </InlineText>
          <InlineText
            style={{
              whiteSpace: 'nowrap',
              fontSize: '1.9rem',
              padding: '0 .5rem',
            }}
          >
            +
          </InlineText>

          <InlineText
            style={{
              whiteSpace: 'nowrap',
              fontSize: '1.9rem',
            }}
          >
            {stripDigitPlaces(totalFeesSOL, 5)} SOL
          </InlineText>
          <SvgIcon
            src={Info}
            width="4rem"
            height="4rem"
            style={{ padding: '1rem' }}
          />
        </Row>
      </DarkTooltip>
    </RowContainer>
  )
}
