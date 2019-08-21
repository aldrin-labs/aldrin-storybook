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
    const { tab, handleTabChange, show } = this.props

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
          },
          heading: {
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            color: '#16253D',
          },
          cell: {
            color: '#16253D',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: 'Trebuchet MS',
            letterSpacing: '1px',
            borderBottom: '1px solid #e0e5ec',
          },
          tab: {
            padding: 0,
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              tab={tab}
              hideSmallAssets={hideSmallAssets}
              handleTabChange={handleTabChange}
              handleSmallAssetsCheckboxChange={
                this.handleSmallAssetsCheckboxChange
              }
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
