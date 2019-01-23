import * as React from 'react'
import Widget from '@storybook/components/Widget'
import Calculator from '@storybook/components/Calculator/Calculator'
import compareIcon from '@icons/compare.svg'

export const rates = [
  { name: 'BTC/USD', rate: 9103.26 },
  { name: 'USD/BTC', rate: 0.00011 },
  { name: 'BTC/ETH', rate: 1 },
  { name: 'ETH/BTC', rate: 1 },
  { name: 'ETH/USD', rate: 580.06 },
  { name: 'USD/ETH', rate: 1 },
  { name: 'XRP/USD', rate: 0.709714 },
  { name: 'USD/XRP', rate: 1 },
]

export default class CalculatorWidget extends React.Component {
  render() {
    return (
      <Widget icon={compareIcon} heading="Crypto Calculator">
        <Calculator rates={rates} />
      </Widget>
    )
  }
}
