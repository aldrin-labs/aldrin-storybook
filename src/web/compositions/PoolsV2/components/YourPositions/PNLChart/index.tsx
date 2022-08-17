import Chart from 'chart.js/auto'
import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'
import { DefaultTheme, useTheme } from 'styled-components'

import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { InlineText } from '@sb/components/Typography'
import { RootColumn } from '@sb/compositions/PoolsV2/index.styles'

import { getTotalVolumeLockedHistory } from '@core/graphql/queries/pools/getTotalVolumeLockedHistory'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimeZone,
  startOfDayTimestamp,
} from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'

import { TooltipIcon } from '../../Icons'
import { Row } from '../../Popups/index.styles'
import { CanvasContainer } from './index.styles'
import { createPNLChart, NUMBER_OF_DAYS_TO_SHOW } from './utils'

const ChartInner: React.FC = (props) => {
  const { getTotalVolumeLockedHistoryQuery } = props

  const data =
    getTotalVolumeLockedHistoryQuery?.getTotalVolumeLockedHistory?.volumes

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const theme = useTheme()

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
    <CanvasContainer>
      <canvas id="tvl-chart-inner" height="250" width="100%" ref={canvasRef} />
    </CanvasContainer>
  )
}

const TotalVolumeLockedChartInner = compose(
  queryRendererHoc({
    query: getTotalVolumeLockedHistory,
    name: 'getTotalVolumeLockedHistoryQuery',
    variables: {
      timezone: getTimeZone(),
      timestampFrom:
        startOfDayTimestamp() - dayDuration * NUMBER_OF_DAYS_TO_SHOW,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 3),
    loaderColor: ({ theme }: { theme: DefaultTheme }) => theme.colors.white,
  })
)(ChartInner)

export const PNLChart = ({
  isPositionViewDetailed,
}: {
  isPositionViewDetailed: boolean
}) => {
  return (
    <RootColumn height={isPositionViewDetailed ? '15em' : '12em'} width="63%">
      <Row width="100%">
        <InlineText color="white2" weight={400} size="esm">
          P&L
        </InlineText>
        <TooltipIcon color="gray1" />
      </Row>
      <Row width="100%">
        <Row>
          <InlineText color="white3" weight={600} size="md">
            $
          </InlineText>
          &nbsp;
          <InlineText color="green1" weight={600} size="md">
            1.01k
          </InlineText>
        </Row>
        <Row>
          <InlineText color="white2" weight={600} size="sm">
            + 23.4%
          </InlineText>
        </Row>
      </Row>
      <TotalVolumeLockedChartInner />
      <Row width="100%">
        <InlineText color="white3" weight={400} size="esm">
          Past
        </InlineText>
        <InlineText color="white3" weight={400} size="esm">
          Future
        </InlineText>
      </Row>
    </RootColumn>
  )
}
