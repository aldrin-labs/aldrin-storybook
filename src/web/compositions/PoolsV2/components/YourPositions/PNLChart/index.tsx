import { Chart } from 'chart.js'
import React, { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'

import { InlineText } from '@sb/components/Typography'
import { RootColumn } from '@sb/compositions/PoolsV2/index.styles'

import { TooltipIcon } from '../../Icons'
import { Row } from '../../Popups/index.styles'
import { createPNLChart } from './utils'

export const ChartInner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const theme = useTheme()

  const data = []

  useEffect(() => {
    if (!canvasRef.current) {
      return () => {}
    }

    const reDraw = () => {
      try {
        chartRef.current = createPNLChart({
          container: canvasRef.current,
          data,
          chart: chartRef.current,
          theme,
        })
      } catch (e) {
        console.warn('Erorr on chart update:', e)
        chartRef.current = null
        setTimeout(reDraw, 1_000)
      }
    }

    if (data.length > 0) {
      reDraw()
    }

    return () => {
      chartRef.current?.destroy()
    }
  }, [JSON.stringify(data)])

  return (
    <div>
      <canvas id="tvl-chart-inner" height="250" ref={canvasRef} />
    </div>
  )
}

export const PNLChart = ({
  isPositionViewDetailed,
}: {
  isPositionViewDetailed: boolean
}) => {
  return (
    <RootColumn height={isPositionViewDetailed ? '15em' : '12em'} width="63%">
      <Row width="100%">
        <InlineText color="gray1" weight={400} size="esm">
          P&L
        </InlineText>
        <TooltipIcon color="gray1" />
      </Row>
      <Row width="100%">
        <Row>
          <InlineText color="gray1" weight={600} size="md">
            $
          </InlineText>
          &nbsp;
          <InlineText color="green1" weight={600} size="md">
            1.01k
          </InlineText>
        </Row>
        <Row>
          <InlineText color="gray1" weight={600} size="sm">
            + 23.4%
          </InlineText>
        </Row>
      </Row>
    </RootColumn>
  )
}
