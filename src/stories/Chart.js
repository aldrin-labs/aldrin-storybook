import React from 'react'
import { text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import styled from 'styled-components'


import { backgrounds } from './backgrounds'
import { Chart } from '@components'

const TablesContainer = styled.div`
  position: relative;
  display: flex;
  width: 40%;
  height: calc(100vh - 59px - 80px);
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
    width: 100%;
  }
`

const ChartsContainer = styled(TablesContainer)`
  height: calc(100vh - 59px - 80px - 1px);
  justify-content: flex-end;
  flex-direction: column;
  border-right: 1px solid #30353a;
  width: 60%;

  @media (max-width: 1080px) {
    height: calc(100vh - 59px - 80px);
    flex-wrap: nowrap;
  }
`


storiesOf('Chart', module)
  .addDecorator(backgrounds)
  .add(
    'Chart',
    withInfo()(() => {
      const base = text('First currency', 'BTC');
      const quote = text('Second currency','USDT');

    return (
      <ChartsContainer>
        <Chart
          chartsApiUrl='chart.cryptocurrencies.ai'
          additionalUrl={`/?symbol=${base}/${quote}`} 
        />
      </ChartsContainer>
    )
  })
)
