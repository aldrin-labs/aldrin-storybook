import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './FundsTable.types'
import {
  getEmptyTextPlaceholder,
  getTableHead,
  combineFundsTable,
} from '@sb/components/TradingTable/TradingTable.utils'
import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { Switch, Typography } from '@material-ui/core'
import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { FUNDS } from '@core/graphql/subscriptions/FUNDS'

class FundsTable extends React.PureComponent<IProps> {
  state: IState = {
    fundsProcessedData: [],
    hideSmallAssets: false,
  }

  unsubscribeFunction: null | Function = null

  handleSmallAssetsCheckboxChange = (event, checked) => {
    const { marketType } = this.props

    this.setState({
      hideSmallAssets: checked,
      fundsProcessedData: combineFundsTable(
        this.props.getFundsQuery.getFunds,
        checked,
        marketType
      ),
    })
  }

  componentDidMount() {
    const { getFundsQuery, subscribeToMore, marketType } = this.props
    const { hideSmallAssets } = this.state

    const fundsProcessedData = combineFundsTable(
      getFundsQuery.getFunds,
      hideSmallAssets,
      marketType
    )
    this.setState({
      fundsProcessedData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { hideSmallAssets } = this.state

    const fundsProcessedData = combineFundsTable(
      nextProps.getFundsQuery.getFunds,
      hideSmallAssets,
      nextProps.marketType
    )
    this.setState({
      fundsProcessedData,
    })
  }

  render() {
    const { fundsProcessedData, hideSmallAssets } = this.state
    const {
      tab,
      handleTabChange,
      show,
      marketType,
      selectedKey,
      canceledOrders,
      arrayOfMarketIds,
      currencyPair,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%' }}
        stylesForTable={{ backgroundColor: '#fff' }}
        withCheckboxes={false}
        tableStyles={{
          headRow: {
            borderBottom: '1px solid #e0e5ec',
            boxShadow: 'none',
          },
          heading: {
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            color: '#16253D',
            boxShadow: 'none',
          },
          cell: {
            color: '#7284A0',
            fontSize: '1rem', // 1.2 if bold
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderBottom: '1px solid #e0e5ec',
            boxShadow: 'none',
          },
          tab: {
            padding: 0,
            boxShadow: 'none',
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              // hideSmallAssets={hideSmallAssets}
              // handleSmallAssetsCheckboxChange={
              //   this.handleSmallAssetsCheckboxChange
              // }
              {...{
                tab,
                marketType,
                selectedKey,
                currencyPair,
                canceledOrders,
                handleTabChange,
                arrayOfMarketIds,
                showAllPositionPairs,
                showAllOpenOrderPairs,
                showAllSmartTradePairs,
                showPositionsFromAllAccounts,
                showOpenOrdersFromAllAccounts,
                showSmartTradesFromAllAccounts,
              }}
            />
          </div>
        }
        actionsColSpan={2}
        actions={[
          {
            id: '1',
            icon: (
              <>
                <Typography
                  style={{ fontSize: CSS_CONFIG.chart.actionCell.fontSize }}
                >
                  Hide small assets
                </Typography>
                <Switch
                  style={{ height: '28px' }}
                  onChange={this.handleSmallAssetsCheckboxChange}
                  checked={hideSmallAssets}
                />
              </>
            ),
            color: 'transparent',
            withoutHover: true,
          },
        ]}
        data={{ body: fundsProcessedData }}
        columnNames={getTableHead(tab)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  const { selectedKey } = props

  return (
    <QueryRenderer
      component={FundsTable}
      withOutSpinner={true}
      withTableLoader={true}
      query={getFunds}
      variables={{ fundsInput: { activeExchangeKey: selectedKey.keyId } }}
      name={`getFundsQuery`}
      fetchPolicy="cache-and-network"
      pollInterval={props.show ? 60000 : 0}
      subscriptionArgs={{
        subscription: FUNDS,
        variables: {
          listenFundsInput: { activeExchangeKey: selectedKey.keyId },
        },
        updateQueryFunction: updateFundsQuerryFunction,
      }}
      {...props}
    />
  )
}

export default React.memo(TableDataWrapper, (prevProps, nextProps) => {
  if (!nextProps.show && !prevProps.show) {
    return true
  }

  return false
})
