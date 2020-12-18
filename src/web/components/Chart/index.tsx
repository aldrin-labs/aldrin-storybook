import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'
import { Card } from '@material-ui/core'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { TriggerTitle } from '@sb/components/ChartCardHeader'
import { CHARTS_API_URL } from '@core/utils/config'
import { TerminalModeButton } from '@sb/components/TradingWrapper/styles'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-shadow: none;
  border: none;
  border-radius: 0;
`

export const SingleChart = ({
  additionalUrl,
  name,
  themeMode,
  customMarkets,
  currencyPair,
}: {
  additionalUrl: string
  name: string
  themeMode: string
  customMarkets: []
  currencyPair: string
}) => {
  console.log('customMark', currencyPair)

  return (
    <Wrapper>
      <iframe
        allowfullscreen="" // needed for fullscreen of chart to work
        style={{ borderWidth: 0 }}
        src={`https://${CHARTS_API_URL}${additionalUrl}&theme=${
          themeMode === 'light' ? 'light' : 'serum'
        }`}
        height={'100%'}
        id={`${name}${themeMode}`}
        key={themeMode}
      />
    </Wrapper>
  )
}

export const SingleChartWithButtons = ({
  theme,
  themeMode,
  currencyPair,
  base,
  quote,
  publicKey,
  marketType,
  customMarkets,
}) => {
  const isCustomMarkets = customMarkets.find(
    (el) => el.name.split('/').join('_') === currencyPair
  )

  const [chartExchange, updateChartExchange] = useState('index')

  return (
    <CustomCard
      theme={theme}
      id="tradingViewChart"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRight: 'none',
      }}
    >
      <TriggerTitle
        theme={theme}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
        }}
      >
        <span
          style={{
            width: 'calc(100% - 20rem)',
            whiteSpace: 'pre-line',
            textAlign: 'left',
            color: theme.palette.dark.main,
            textTransform: 'capitalize',
            fontSize: '1.3rem',
            lineHeight: '1rem',
            paddingLeft: '1rem',
          }}
        >
          Chart
        </span>
        <TerminalModeButton
          theme={theme}
          active={chartExchange === 'index'}
          themeMode
          style={{ width: '10rem' }}
          onClick={() => {
            updateChartExchange('index')
          }}
        >
          Index
        </TerminalModeButton>
        <TerminalModeButton
          theme={theme}
          active={chartExchange === 'serum'}
          style={{ width: '10rem' }}
          onClick={() => updateChartExchange('serum')}
        >
          Serum
        </TerminalModeButton>
      </TriggerTitle>
      <SingleChart
        name=""
        themeMode={themeMode}
        currencyPair={currencyPair}
        additionalUrl={`/?symbol=${base}/${quote}_${String(marketType)}_${
          chartExchange === 'index'
            ? isCustomMarkets
              ? 'ftx'
              : 'binance'
            : 'serum'
        }&user_id=${publicKey}&api_version=${2.1}`}
      />
    </CustomCard>
  )
}

export default compose(withMarketUtilsHOC, withTheme())(SingleChartWithButtons)
