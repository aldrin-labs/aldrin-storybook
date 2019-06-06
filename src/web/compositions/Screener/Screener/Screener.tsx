import * as React from 'react'
import { compose } from 'recompose'

import Selector from '../Selector/Selector'
import ScreenerTabs from '../ScreenerTabs/ScreenerTabs'
import ScreenerTable from '../ScreenerTable/ScreenerTable'
import { IProps, IState } from './Screener.types'

class ScreenerBase extends React.Component<IProps, IState> {
  state: IState = {
    tab: 'marketSummary',
    searchText: '',
    searchArrayText: '',
  }

  onChangeTab = (
    kind:
      | 'marketSummary'
      | 'overview'
      | 'performance'
      | 'oscillators'
      | 'trendFollowing'
  ) => {
    this.setState({ tab: kind, searchArrayText: '' })
  }

  onChangeSearchText = (newSearchText: string) => {
    this.setState({ searchText: newSearchText })
  }

  onChangeSearchArrayText = (newSearchArrayText: string) => {
    this.setState({
      searchArrayText: newSearchArrayText
    })
  }

  render() {
    return (
      <div>
        <ScreenerTabs onChangeTab={this.onChangeTab} tab={this.state.tab} />
        <Selector />
        {/*<ScreenerSearch*/}
          {/*searchText={this.state.searchText}*/}
          {/*onChangeSearchText={this.onChangeSearchText}*/}
        {/*/>*/}
        <ScreenerTable
          searchText={this.state.searchText}
          tab={this.state.tab}
          onChangeSearchArrayText={this.onChangeSearchArrayText}
          searchArrayText={this.state.searchArrayText}
        />
      </div>
    )
  }
}

export const Screener = compose(
  connect((state) => ({
    count: console.log(state),
  }))
)(ScreenerBase)
