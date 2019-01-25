import * as React from 'react'
import Widget from '@sb/components/Widget'
import DominanceChart from '@sb/components/DominanceChart'
import bubble from '@icons/bubble.svg'

export default class DominanceWidget extends React.Component {
  render() {
    return (
      <Widget icon={bubble} heading="Coin Dominance %">
        <DominanceChart />
      </Widget>
    )
  }
}
