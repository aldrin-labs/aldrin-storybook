import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { useLocation } from 'react-router-dom'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './TradeHistoryTable.types'
import {
  combineTradeHistoryTable,
  updateTradeHistoryQuerryFunction,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { addSerumTransaction } from '@core/graphql/mutations/chart/addSerumTransaction'

import { PaginationBlock } from '../TradingTablePagination'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { getTradeHistory } from '@core/graphql/queries/chart/getTradeHistory'
import { TRADE_HISTORY } from '@core/graphql/subscriptions/TRADE_HISTORY'
// import { CSS_CONFIG } from '@sb/config/cssConfig'

import { useFills } from '@sb/dexUtils/markets'
import { useWallet } from '@sb/dexUtils/wallet';

// @withTheme()
const TradeHistoryTable = (props) => {
  // state: IState = {
  //   tradeHistoryProcessedData: [],
  // }

  // unsubscribeFunction: null | Function = null

  // componentDidMount() {
  //   const {
  //     getTradeHistoryQuery,
  //     subscribeToMore,
  //     theme,
  //     arrayOfMarketIds,
  //     marketType,
  //     keys,
  //     handlePairChange,
  //   } = this.props

  //   const {
  //     getTradeHistory: { trades } = {
  //       trades: [],
  //     },
  //   } = this.props.getTradeHistoryQuery || {
  //     getTradeHistory: { trades: [] },
  //   }

  //   const tradeHistoryProcessedData = combineTradeHistoryTable(
  //     trades,
  //     theme,
  //     arrayOfMarketIds,
  //     marketType,
  //     keys,
  //     handlePairChange
  //   )
  //   this.setState({
  //     tradeHistoryProcessedData,
  //   })

  //   // this.unsubscribeFunction = subscribeToMore()
  // }

  // componentDidUpdate(prevProps: IProps) {
  //   if (
  //     // prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
  //     prevProps.specificPair !== this.props.specificPair ||
  //     // prevProps.allKeys !== this.props.allKeys ||
  //     prevProps.marketType !== this.props.marketType
  //   ) {
  // const {
  //   startDate,
  //   endDate,
  //   marketType,
  //   selectedKey,
  //   allKeys,
  //   currencyPair,
  //   specificPair,
  // } = this.props

  // this.unsubscribeFunction && this.unsubscribeFunction()
  // this.unsubscribeFunction = this.props.getTradeHistoryQuery.subscribeToMore(
  //   {
  //     document: TRADE_HISTORY,
  //     variables: {
  //       tradeHistoryInput: {
  //         startDate: startDate.valueOf(),
  //         endDate: endDate.valueOf(),
  //         marketType,
  //         activeExchangeKey: selectedKey.keyId,
  //         allKeys,
  //         ...(!specificPair ? {} : { specificPair: currencyPair }),
  //       },
  //     },
  //     updateQuery: updateTradeHistoryQuerryFunction,
  //   }
  // )
  //   }
  // }

  // componentWillUnmount = () => {
  // unsubscribe subscription
  // if (this.unsubscribeFunction !== null) {
  //   this.unsubscribeFunction()
  // }
  // }

  // componentWillReceiveProps(nextProps: IProps) {
  //   const {
  //     getTradeHistory: { trades } = {
  //       trades: [],
  //     },
  //   } = nextProps.getTradeHistoryQuery || {
  //     getTradeHistory: { trades: [] },
  //   }

  //   const tradeHistoryProcessedData = combineTradeHistoryTable(
  //     trades,
  //     nextProps.theme,
  //     nextProps.arrayOfMarketIds,
  //     nextProps.marketType,
  //     nextProps.keys,
  //     nextProps.handlePairChange
  //   )
  //   this.setState({
  //     tradeHistoryProcessedData,
  //   })
  // }

  // render() {
  // const { tradeHistoryProcessedData } = this.state

  const {
    tab,
    show,
    page,
    perPage,
    theme,
    focusedInput,
    endDate,
    activeDateButton,
    startDate,
    maximumDate,
    minimumDate,
    onClearDateButtonClick,
    onDateButtonClick,
    onDatesChange,
    onFocusChange,
    marketType,
    allKeys,
    specificPair,
    handleToggleAllKeys,
    handleToggleSpecificPair,
    handleChangePage,
    getTradeHistoryQuery,
    handleChangeRowsPerPage,
    arrayOfMarketIds,
    handlePairChange,
    keys,
    addSerumTransactionMutation
  } = props

  const [savedIds, saveId] = useState<string[]>([])
  const fills = useFills();
  const { wallet } = useWallet();
  const location = useLocation()

  const pair = location.pathname.split('/')[3]  ? location.pathname.split('/')[3] : null

  if (!show || !pair) {
    return null
  }

  const dataSource = (fills || []).map((fill) => ({
    ...fill,
    key: `${fill.orderId}${fill.side}`,
    liquidity: fill.eventFlags.maker ? 'Maker' : 'Taker',
  }));

  if (dataSource.length > 0) {
    dataSource.forEach((trade) => {
      // we send mutation only for SRM_USDT trades with Taker comission
      const isTradeAlreadySent = savedIds.includes(trade.orderId)
      if (!isTradeAlreadySent && trade.liquidity === "Taker" && pair === "SRM_USDT") {
        addSerumTransactionMutation({ variables: { fee: trade.feeCost, amount: trade.size, dexId: trade.orderId, publicKey: wallet.publicKey._bn }})
        saveId([...savedIds, trade.orderId ])
      }
    })
  }


  const {
    getTradeHistory: { count } = {
      count: 0,
    },
  } = props.getTradeHistoryQuery || {
    getTradeHistory: { count: 0 },
  }

  const tradeHistoryProcessedData = combineTradeHistoryTable(
    dataSource,
    theme,
    arrayOfMarketIds,
    marketType,
    keys,
    handlePairChange
  )

  return (
    <TableWithSort
      style={{
        borderRadius: 0,
        height: 'calc(100% - 6rem)',
        backgroundColor: theme.palette.white.background,
      }}
      stylesForTable={{ backgroundColor: theme.palette.white.background }}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      tableStyles={{
        headRow: {
          borderBottom: theme.palette.border.main,
          boxShadow: 'none',
        },
        heading: {
          fontSize: '1rem',
          fontWeight: 'bold',
          backgroundColor: theme.palette.grey.cream,
          color: theme.palette.dark.main,
          boxShadow: 'none',
        },
        cell: {
          color: theme.palette.dark.main,
          backgroundColor: theme.palette.white.background,
          fontSize: '1rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.palette.border.main,
          boxShadow: 'none',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      // pagination={{
      //   fakePagination: false,
      //   enabled: true,
      //   totalCount: count,
      //   page: page,
      //   rowsPerPage: perPage,
      //   rowsPerPageOptions: [10, 20, 30, 50, 100],
      //   handleChangePage: handleChangePage,
      //   handleChangeRowsPerPage: handleChangeRowsPerPage,
      //   additionalBlock: (
      //     <PaginationBlock
      //       {...{
      //         theme,
      //         allKeys,
      //         specificPair,
      //         handleToggleAllKeys,
      //         handleToggleSpecificPair,
      //       }}
      //     />
      //   ),
      //   paginationStyles: {
      //     width: 'calc(100%)',
      //     backgroundColor: theme.palette.white.background,
      //     border: theme.palette.border.main,
      //   },
      // }}
      emptyTableText={getEmptyTextPlaceholder(tab)}
      // title={
      //   <div>
      //     <TradingTitle
      //       {...{
      //         page,
      //         perPage,
      //         theme,
      //         startDate,
      //         endDate,
      //         focusedInput,
      //         activeDateButton,
      //         minimumDate,
      //         maximumDate,
      //         onDateButtonClick,
      //         onDatesChange,
      //         onFocusChange,
      //         onClearDateButtonClick,
      //         handleChangePage,
      //         handleChangeRowsPerPage,
      //         maxRows: count,
      //       }}
      //     />
      //   </div>
      // }
      data={{ body: tradeHistoryProcessedData }}
      columnNames={getTableHead(tab, marketType)}
    />
  )
  // }
}

// const TableDataWrapper = ({ ...props }) => {
//   let { startDate, endDate, page, perPage, allKeys, specificPair } = props

//   startDate = +startDate
//   endDate = +endDate

//   return (
//     <QueryRenderer
//       component={TradeHistoryTable}
//       withOutSpinner={true}
//       withTableLoader={true}
//       query={getTradeHistory}
//       name={`getTradeHistoryQuery`}
//       fetchPolicy="cache-and-network"
//       showLoadingWhenQueryParamsChange={false}
//       // pollInterval={props.show ? 60000 : 0}
//       variables={{
//         tradeHistoryInput: {
//           page,
//           perPage,
//           startDate,
//           endDate,
//           activeExchangeKey: props.selectedKey.keyId,
//           marketType: props.marketType,
//           allKeys,
//           ...(!specificPair ? {} : { specificPair: props.currencyPair }),
//         },
//       }}
//       subscriptionArgs={{
//         subscription: TRADE_HISTORY,
//         variables: {
//           tradeHistoryInput: {
//             startDate,
//             endDate,
//             activeExchangeKey: props.selectedKey.keyId,
//             marketType: props.marketType,
//             allKeys,
//             ...(!specificPair ? {} : { specificPair: props.currencyPair }),
//           },
//         },
//         updateQueryFunction: updateTradeHistoryQuerryFunction,
//       }}
//       {...props}
//     />
//   )
// }

const MemoTable =  React.memo(TradeHistoryTable, (prevProps, nextProps) => {
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
  const startDateIsEqual = +prevProps.startDate === +nextProps.startDate
  const endDateIsEqual = +prevProps.endDate === +nextProps.endDate
  const pageIsEqual = prevProps.page === nextProps.page
  const perPageIsEqual = prevProps.perPage === nextProps.perPage

  if (
    isShowEqual &&
    showAllAccountsEqual &&
    showAllPairsEqual &&
    pairIsEqual &&
    selectedKeyIsEqual &&
    isMarketIsEqual &&
    startDateIsEqual &&
    endDateIsEqual &&
    pageIsEqual &&
    perPageIsEqual
  ) {
    return true
  }

  return false
})

export default compose(graphql(addSerumTransaction, { name: "addSerumTransactionMutation" }))(MemoTable)
