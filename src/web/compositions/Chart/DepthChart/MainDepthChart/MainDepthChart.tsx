import React from 'react'
import { connect } from 'react-redux'
import DepthChart from '../DepthChart'

const MainDepthChart = (props: any) => <DepthChart {...props} />

const mapStateToProps = (store: any) => ({
  asks: store.chart.asks,
  bids: store.chart.bids,
})

export default connect(mapStateToProps)(MainDepthChart)
