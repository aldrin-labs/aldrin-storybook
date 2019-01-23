import React, { Component } from 'react'
import Widget from '@storybook/components/Widget'
import BitcoinPriceChart from '@storybook/components/BitcoinPriceChart/BitcoinPriceChart'
import bitcoinIcon from '@icons/bitcoin.svg'
import styled from 'styled-components'

class BitcoinPriceChartWidget extends Component {
  render() {
    return (
      <Widget icon={bitcoinIcon} heading="Bitcoin Price Chart">
        <WidgetWrapper>
          <BitcoinPriceChart />
        </WidgetWrapper>
      </Widget>
    )
  }
}

// provides color for side container in BitcoinPriceChart
const WidgetWrapper = styled.div`
  &::before {
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
    content: '';
    background-color: #292d31;
  }

  @media (max-width: 630px) {
    &::before {
      display: none;
    }
  }
`

export default BitcoinPriceChartWidget
