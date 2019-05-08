import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './FundsTable.types'
import {
  getEmptyTextPlaceholder,
  getTableHead,
  combineFundsTable,
  updateFundsQuerryFunction,
} from '@sb/components/TradingTable/TradingTable.utils'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { Switch } from '@material-ui/core'
import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { FUNDS } from '@core/graphql/subscriptions/FUNDS'

class FundsTable extends React.PureComponent<IProps> {
  state: IState = {
    fundsProcessedData: [],
    hideSmallAssets: false,
  }

  handleSmallAssetsCheckboxChange = (event, checked) => {
    this.setState({
      hideSmallAssets: checked,
      fundsProcessedData: combineFundsTable(
        this.props.getFundsQuery.getFunds,
        checked
      ),
    })
  }

  componentDidMount() {
    const { getFundsQuery, subscribeToMore } = this.props
    const { hideSmallAssets } = this.state

    const fundsProcessedData = combineFundsTable(
      getFundsQuery.getFunds,
      hideSmallAssets
    )
    this.setState({
      fundsProcessedData,
    })

    subscribeToMore()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { hideSmallAssets } = this.state

    const fundsProcessedData = combineFundsTable(
      nextProps.getFundsQuery.getFunds,
      hideSmallAssets
    )
    this.setState({
      fundsProcessedData,
    })
  }

  render() {
    const { fundsProcessedData, hideSmallAssets } = this.state
    const { tab, tabIndex, handleTabChange, show } = this.props


    if (!show) {
      return null
    }

    return (
      <TableWithSort
        withCheckboxes={false}
        tableStyles={{
          heading: {
            fontSize: CSS_CONFIG.chart.headCell.fontSize,
          },
          cell: {
            fontSize: CSS_CONFIG.chart.headCell.fontSize,
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              tab={tab}
              tabIndex={tabIndex}
              hideSmallAssets={hideSmallAssets}
              handleTabChange={handleTabChange}
              handleSmallAssetsCheckboxChange={
                this.handleSmallAssetsCheckboxChange
              }
            />
          </div>
        }
        actions={[
          {
            id: '1',
            icon: (
              <Switch
                style={{ height: '28px' }}
                onChange={this.handleSmallAssetsCheckboxChange}
                checked={hideSmallAssets}
              />
            ),
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
      fetchPolicy="network-only"
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

export default TableDataWrapper
