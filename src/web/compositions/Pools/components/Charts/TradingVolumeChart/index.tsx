import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { createTradingVolumeChart } from '../utils'
import { getTradingVolumeHistory } from '@core/graphql/queries/pools/getTradingVolumeHistory'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import dayjs from 'dayjs'
import { Line } from '../../Popups/index.styles'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { estimatedTime, msToNextHour } from '@core/utils/dateUtils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { ReloadTimerTillUpdate } from '../ReloadTimerTillUpdate/ReloadTimerTillUpdate'
import { getRandomInt } from '@core/utils/helpers'
import { Chart } from 'chart.js'
import { BlockContent, Block } from '@sb/components/Block'
import { TitleContainer, SubTitle } from '../styles'

const ChartBlock = ({
  theme,
  id,
  title,
  getTradingVolumeHistoryQuery,
}: {
  theme: Theme
  id: string
  title: string
  getTradingVolumeHistoryQuery: any
}) => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)


  const data = getTradingVolumeHistoryQuery?.getTradingVolumeHistory?.volumes

  useEffect(() => {
    if (!canvasRef.current) {
      return () => {
        return null
      }
    }
    chartRef.current = createTradingVolumeChart({
      container: canvasRef.current,
      data,
      chart: chartRef.current,
    })

    return () => chartRef.current?.destroy()
  }, [JSON.stringify(data)])


  return (
    <Block>
      <BlockContent>
        <TitleContainer>
          <SubTitle>Trading Volume</SubTitle>
          <Line />
          <ReloadTimerTillUpdate
            duration={3600}
            margin={'0 0 0 2rem'}
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
        </TitleContainer>
        <div>
          <canvas ref={canvasRef}></canvas>
        </div>
      </BlockContent>
    </Block>
  )

  return (
    <>
      <HeaderContainer theme={theme} justify={'space-between'}>
        <RowContainer margin={'0 2rem 0 2rem'} style={{ flexWrap: 'nowrap' }}>
          <WhiteTitle
            style={{ marginRight: '2rem' }}
            theme={theme}
            color={theme.palette.white.text}
          >
            {title}
          </WhiteTitle>
          <Line />
          <ReloadTimerTillUpdate
            duration={3600}
            margin={'0 0 0 2rem'}
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
        </RowContainer>
      </HeaderContainer>
      <ChartContainer>
        <canvas id="TradingVolumeChart"></canvas>
      </ChartContainer>
    </>
  )
}

export const TradingVolumeChart = compose(
  queryRendererHoc({
    query: getTradingVolumeHistory,
    name: 'getTradingVolumeHistoryQuery',
    variables: {
      timezone: getTimezone(),
      timestampFrom: endOfDayTimestamp() - dayDuration * 6,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 3),
  })
)(ChartBlock)
