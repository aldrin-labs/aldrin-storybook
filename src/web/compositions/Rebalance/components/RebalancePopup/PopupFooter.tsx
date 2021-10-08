import React from 'react'
import { Theme } from '@material-ui/core'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import Info from '@icons/inform.svg'
import { TooltipText } from './styles'

export const PopupFooter = ({
  totalFeesUSD,
  totalFeesSOL,
  theme,
}: {
  totalFeesUSD: number
  totalFeesSOL: number
  theme: Theme
}) => (
  <RowContainer justify="space-between">
    <Text
      theme={theme}
      color={theme.palette.grey.new}
      style={{
        whiteSpace: 'nowrap',
        fontSize: '1.6rem',
      }}
    >
      Est. Fees Amount
    </Text>

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
            Limited Serum trade account creation fee (If this is your first time
            trading this pair)
          </TooltipText>
        </div>
      }
    >
      <Row>
        <Text
          theme={theme}
          color="#A5E898"
          fontFamily="Avenir Next Demi"
          style={{
            whiteSpace: 'nowrap',
            fontSize: '1.9rem',
          }}
        >
          ${totalFeesUSD.toFixed(2)}
        </Text>
        <Text
          theme={theme}
          fontFamily="Avenir Next Demi"
          style={{
            whiteSpace: 'nowrap',
            fontSize: '1.9rem',
            padding: '0 .5rem',
          }}
        >
          +
        </Text>

        <Text
          theme={theme}
          color="#A5E898"
          fontFamily="Avenir Next Demi"
          style={{
            whiteSpace: 'nowrap',
            fontSize: '1.9rem',
          }}
        >
          {stripDigitPlaces(totalFeesSOL, 5)} SOL
        </Text>
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
