import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import withMobileSize from '@core/hoc/withMobileSize'

import Balances from './Balances/Balances'
import FeeTiers from './Fee/FeeTiers'
import { OpenOrdersTableWrapper } from './OpenOrdersTable/OpenOrdersWrapper'
import TradeHistoryTable from './TradeHistoryTable/TradeHistoryDataWrapper'
import { IProps, IState, IStateKeys } from './TradingTable.types'

class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tab: 'openOrders',
    canceledOrders: [],
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.isMobile !== this.props.isMobile) {
      this.setState({ tab: this.props.isMobile ? 'balances' : 'openOrders' })
    }
  }

  handleChangePage = (tab: IStateKeys, value: number) => {
    this.setState({ [tab]: value } as unknown as Pick<IState, keyof IState>)
  }

  handleChangeRowsPerPage = (
    tab: IStateKeys,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState({ [tab]: +event.target.value } as unknown as Pick<
      IState,
      keyof IState
    >)
  }

  handlePairChange = (value: string) => {
    const { history, marketType } = this.props

    const chartPageType = marketType === 0 ? 'spot' : 'futures'
    history.push(`/chart/${chartPageType}/${value}`)
  }

  handleTabChange = (tab: string | any) => {
    this.setState({
      tab,
    })
  }

  addOrderToCanceled = (orderId: string) => {
    this.setState((prev) => {
      return { canceledOrders: [...prev.canceledOrders].concat([orderId]) }
    })
  }

  clearCanceledOrders = () => {
    this.setState({ canceledOrders: [] })
  }

  render() {
    const { tab, canceledOrders } = this.state

    const { theme, marketType, updateTerminalViewMode, terminalViewMode } =
      this.props
    return (
      <div
        id="tables"
        style={{
          height: '100%',
          backgroundColor: theme?.colors?.gray6,
          borderLeft: theme?.colors?.gray2,
        }}
      >
        <TradingTabs
          {...{
            tab,
            marketType,
            handleTabChange: this.handleTabChange,
            updateTerminalViewMode,
            terminalViewMode,
          }}
        />
        <OpenOrdersTableWrapper
          tab={tab}
          show={tab === 'openOrders'}
          marketType={marketType}
          canceledOrders={canceledOrders}
          handlePairChange={this.handlePairChange}
          terminalViewMode={terminalViewMode}
        />
        <TradeHistoryTable
          {...{
            tab,
            marketType,
            show: tab === 'tradeHistory',
            handlePairChange: this.handlePairChange,
          }}
        />

        <Balances
          {...{
            tab,
            marketType,
            show: tab === 'balances',
          }}
        />
        <FeeTiers
          {...{
            tab,
            marketType,
            show: tab === 'feeTiers',
          }}
        />
        {/* <StyleForCalendar theme={theme} /> */}
      </div>
    )
  }
}

const TradingTableWrapper = compose(
  withRouter,
  withErrorFallback,
  withMobileSize
)(TradingTable)

export default React.memo(TradingTableWrapper, (prevProps, nextProps) => {
  if (
    prevProps.marketType === nextProps.marketType &&
    prevProps.terminalViewMode === nextProps.terminalViewMode &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.theme === nextProps.theme
  ) {
    return true
  }

  return false
})
