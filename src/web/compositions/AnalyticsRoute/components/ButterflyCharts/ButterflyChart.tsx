import { Theme } from '@material-ui/core'
import React, { useEffect } from 'react'

import {
  Row,
  WhiteTitle,
  Dot,
  HeaderContainer,
  ChartContainer,
} from '../../index.styles'
import { TooltipForButterflyChart } from '../Tooltips'
import { createButterflyChart } from '../utils'

const ButterflyChart = ({
  theme,
  id,
  title,
  data,
  needQuoteInLabel,
  selectedPair,
}: {
  theme: Theme
  id: string
  title: string
  data: any
  needQuoteInLabel: boolean
  selectedPair: string
}) => {
  useEffect(() => {
    createButterflyChart(id, data, needQuoteInLabel, selectedPair)

    return () => window[`butterflyChart-${id}`].destroy()
  }, [id])

  return (
    <>
      <HeaderContainer theme={theme} justify="space-between">
        <Row>
          <WhiteTitle
            theme={theme}
            style={{
              borderRight: theme.palette.border.main,
              padding: '0 2rem',
            }}
          >
            {title}
          </WhiteTitle>
          <Row margin="0 2rem">
            <Dot background="#53DF11" />
            <WhiteTitle fontWeight="normal" theme={theme}>
              Buy
            </WhiteTitle>
          </Row>
          <Row>
            <Dot background="#F26D68" />
            <WhiteTitle fontWeight="normal" theme={theme}>
              Sell
            </WhiteTitle>
          </Row>
        </Row>
        <Row margin="0 2rem 0 0">
          <WhiteTitle theme={theme}>14d</WhiteTitle>
        </Row>
      </HeaderContainer>
      <ChartContainer>
        <canvas id={`butterflyChart-${id}`} />
        <TooltipForButterflyChart
          needQuoteInLabel={needQuoteInLabel}
          theme={theme}
          id={id}
        />
      </ChartContainer>
    </>
  )
}

export default ButterflyChart
