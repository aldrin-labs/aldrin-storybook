import React, { Component } from 'react'

import { IProps, IState } from './TransformDataToDepthChartComponent.types'
import DepthChart from '../../../DepthChart/DepthChart'
import { testJSON } from '@core/utils/chartPageUtils'

class TransformDataToDepthChartComponent extends Component<IProps, IState> {
  state = {
    asks: [],
    bids: [],
  }

  static getDerivedStateFromProps(newProps: IProps) {
    let asks = [],
      bids = []

    if (newProps.data.marketOrders) {
      bids = newProps.data.marketOrders
        .map((o) => testJSON(o) && JSON.parse(o))
        .filter((o) => o.type === 'bid')
      asks = newProps.data.marketOrders
        .map((o) => testJSON(o) && JSON.parse(o))
        .filter((o) => o.type === 'ask')
    }

    return { asks, bids }
  }

  render() {
    const { asks, bids } = this.state
    return <DepthChart xAxisTickTotal={5} {...{ asks, bids, ...this.props }} />
  }
}

export default TransformDataToDepthChartComponent
