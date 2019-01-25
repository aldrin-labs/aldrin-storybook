import * as React from 'react'
import { IProps } from './ScreenerTable.types'
import MarketSummaryTable from './MarketSummaryTable/MarketSummaryTable'

export default class ScreenerTable extends React.Component<IProps> {
  render() {
    const { searchText, tab } = this.props

    if (tab === 'marketSummary') {
      return (
        <MarketSummaryTable
          searchText={searchText}
          onChangeSearchArrayText={this.props.onChangeSearchArrayText}
          searchArrayText={this.props.searchArrayText}
        />
      )
    } else {
      return null
    }
  }
}
