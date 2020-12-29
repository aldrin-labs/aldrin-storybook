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

  // unsubscribeFunction: null | Function = null

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

    // this.unsubscribeFunction = subscribeToMore()
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    // if (this.unsubscribeFunction !== null) {
    //   this.unsubscribeFunction()
    // }
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
    const { tab, theme, show } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        style={{
          borderRadius: 0,
          height: 'calc(100% - 3rem)',
          backgroundColor: theme.palette.white.background,
        }}
        stylesForTable={{ backgroundColor: theme.palette.white.background }}
        withCheckboxes={false}
        tableStyles={{
          headRow: {
            borderBottom: theme.palette.border.main,
            boxShadow: 'none',
          },
          heading: {
            fontSize: '1.4rem',
            fontWeight: 'bold',
            backgroundColor: theme.palette.white.background,
            color: theme.palette.grey.light,
            boxShadow: 'none',
            textTransform: 'capitalize',
          },
          cell: {
            color: theme.palette.grey.onboard,
            fontSize: '1.1rem', // 1.2 if bold
            fontFamily: 'Avenir Next Demi',
            letterSpacing: '.1rem',
            borderBottom: theme.palette.border.main,
            backgroundColor: theme.palette.white.background,
            boxShadow: 'none',
          },
          tab: {
            padding: 0,
            boxShadow: 'none',
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
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

  console.log('FundsTable TableDataWrapper RENDER')

  return (
    <QueryRenderer
      component={FundsTable}
      withOutSpinner={false}
      withTableLoader={false}
      query={getFunds}
      variables={{ fundsInput: { activeExchangeKey: selectedKey.keyId } }}
      name={`getFundsQuery`}
      fetchPolicy="cache-first"
      {...props}
    />
  )
}

export default React.memo(TableDataWrapper, (prevProps, nextProps) => {
  // TODO: Refactor isShowEqual --- not so clean
  const isShowEqual = !nextProps.show && !prevProps.show
  const showAllAccountsEqual =
    prevProps.showOpenOrdersFromAllAccounts ===
    nextProps.showOpenOrdersFromAllAccounts
  const showAllPairsEqual =
    prevProps.showAllOpenOrderPairs === nextProps.showAllOpenOrderPairs
  // TODO: here must be smart condition if specificPair is not changed
  const pairIsEqual = prevProps.currencyPair === nextProps.currencyPair
  // TODO: here must be smart condition if showAllAccountsEqual is true & is not changed
  const selectedKeyIsEqual =
    prevProps.selectedKey.keyId === nextProps.selectedKey.keyId
  const isMarketIsEqual = prevProps.marketType === nextProps.marketType

  if (
    isShowEqual &&
    showAllAccountsEqual &&
    showAllPairsEqual &&
    pairIsEqual &&
    selectedKeyIsEqual &&
    isMarketIsEqual
  ) {
    return true
  }

  return false
})
