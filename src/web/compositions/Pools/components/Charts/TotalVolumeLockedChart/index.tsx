import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import {
  endOfDayTimestamp,
  dayDuration,
  generateIDFromValues,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { createTotalVolumeLockedChart } from '../utils'
import { getTotalVolumeLockedHistory } from '@core/graphql/queries/pools/getTotalVolumeLockedHistory'
import { Line } from '../../Popups/index.styles'
import { ReloadTimerTillUpdate } from '../ReloadTimerTillUpdate/ReloadTimerTillUpdate'
import { msToNextHour } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { Block, BlockContent, BlockTitle, BlockSubtitle } from '@sb/components/Block'
import { Chart } from 'chart.js'
import { TitleContainer, SubTitle } from '../styles'

const Chart = ({
  theme,
  id,
  title,
  getTotalVolumeLockedHistoryQuery,
}: {
  theme: Theme
  id: string
  title: string
  getTotalVolumeLockedHistoryQuery: any
}) => {
  const data =
    getTotalVolumeLockedHistoryQuery?.getTotalVolumeLockedHistory?.volumes

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)


  useEffect(() => {
    if (!canvasRef.current) {
      return () => {
        return null
      }
    }
    chartRef.current = createTotalVolumeLockedChart({
      container: canvasRef.current,
      data,
      chart: chartRef.current
    })

    return () => chartRef.current?.destroy()
  }, [JSON.stringify(data)])

  return (
    <Block>
      <BlockContent>
        <TitleContainer>
          <SubTitle>Total Value Locked</SubTitle>
          <Line />
          <ReloadTimerTillUpdate
            duration={3600}
            margin={'0 0 0 2rem'}
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
        </TitleContainer>
        <div>
          <canvas height="250" ref={canvasRef}></canvas>
        </div>
        {/* <HeaderContainer theme={theme} justify={'space-between'}>
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
        <canvas ref={chartRef}></canvas>
      </ChartContainer> */}

      </BlockContent>
    </Block>

  )
}

export const TotalVolumeLockedChart = compose(
  queryRendererHoc({
    query: getTotalVolumeLockedHistory,
    name: 'getTotalVolumeLockedHistoryQuery',
    variables: {
      timezone: getTimezone(),
      timestampFrom: endOfDayTimestamp() - dayDuration * 6,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 3),
  })
)(Chart)
