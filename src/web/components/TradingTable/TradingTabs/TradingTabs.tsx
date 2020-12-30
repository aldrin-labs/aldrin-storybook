import React from 'react'
import { compose } from 'recompose'

import { IProps, INextQueryProps } from './TradingTabs.types'
import {
  TitleTab,
  TitleTabsGroup,
  SmartTradeButton,
} from '@sb/components/TradingTable/TradingTabs/TradingTabs.styles'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  filterOpenOrders,
  filterPositions,
} from '@sb/components/TradingTable/TradingTable.utils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { getActiveStrategies } from '@core/graphql/queries/chart/getActiveStrategies'
import SvgIcon from '@sb/components/SvgIcon'
import FullScreen from '@icons/fullscreen.svg'

const TradingTabs = ({
  tab,
  isFullScreenTablesMode,
  theme,
  handleTabChange,
  updateTerminalViewMode,
  marketType,
  canceledOrders,
  isDefaultTerminalViewMode,
  isDefaultOnlyTables,
  getOpenOrderHistoryQuery: {
    getOpenOrderHistory = { orders: [], count: 0 },
  } = {
    getOpenOrderHistory: { orders: [], count: 0 },
  },
  getActivePositionsQuery: { getActivePositions = [] } = {
    getActivePositions: [],
  },
  getActiveStrategiesQuery: {
    getActiveStrategies = { strategies: [], count: 0 },
  } = {
    getActiveStrategies: { strategies: [], count: 0 },
  },
}: IProps) => {
  const openOrdersLength = getOpenOrderHistory.orders.filter((order) =>
    filterOpenOrders({
      order,
      canceledOrders,
    })
  ).length

  const positionsLength = getActivePositions.filter((position) =>
    filterPositions({
      position,
      canceledPositions: canceledOrders,
    })
  ).length

  const activeTradesLength = getActiveStrategies.strategies.filter(
    (a) =>
      a !== null &&
      (a.enabled ||
        (a.conditions.isTemplate && a.conditions.templateStatus !== 'disabled'))
  ).length

  return (
    <>
      {' '}
      <TitleTabsGroup theme={theme}>
        {isDefaultOnlyTables || isFullScreenTablesMode ? (
          <TitleTab
            onClick={() => updateTerminalViewMode('fullScreenTables')}
            style={{ width: '8rem' }}
            theme={theme}
          >
            <SvgIcon src={FullScreen} width="2.5rem" height="2.5rem" />
          </TitleTab>
        ) : null}
        {isDefaultOnlyTables || isFullScreenTablesMode ? (
          <DarkTooltip
            title={'Watch and manage your active Smart trades from here.'}
          >
            <TitleTab
              data-tut={'smart-trades'}
              theme={theme}
              active={tab === 'activeTrades'}
              onClick={() => handleTabChange('activeTrades')}
            >
              Smart trades{' '}
              {activeTradesLength > 0
                ? `(
          ${activeTradesLength}
          )`
                : ''}
            </TitleTab>
          </DarkTooltip>
        ) : null}
        {isDefaultOnlyTables || isFullScreenTablesMode ? (
          <TitleTab
            theme={theme}
            active={tab === 'strategiesHistory'}
            onClick={() => handleTabChange('strategiesHistory')}
          >
            Smart Trades History
          </TitleTab>
        ) : null}
        {!isSPOTMarketType(marketType) && (
          <TitleTab
            theme={theme}
            active={tab === 'positions'}
            onClick={() => {
              handleTabChange('positions')
            }}
          >
            Positions{' '}
            {positionsLength > 0
              ? `(
          ${positionsLength}
          )`
              : ''}
          </TitleTab>
        )}

        <TitleTab
          theme={theme}
          active={tab === 'openOrders'}
          onClick={() => handleTabChange('openOrders')}
        >
          Open orders{' '}
          {openOrdersLength > 0
            ? `(
          ${openOrdersLength}
          )`
            : ''}
        </TitleTab>
        <TitleTab
          theme={theme}
          active={tab === 'orderHistory'}
          onClick={() => handleTabChange('orderHistory')}
        >
          Order history
        </TitleTab>
        <TitleTab
          theme={theme}
          active={tab === 'tradeHistory'}
          onClick={() => handleTabChange('tradeHistory')}
        >
          Trade history
        </TitleTab>

        {isSPOTMarketType(marketType) && (
          <TitleTab
            theme={theme}
            active={tab === 'funds'}
            onClick={() => handleTabChange('funds')}
          >
            Funds
          </TitleTab>
        )}
        {(isDefaultOnlyTables ||
          isDefaultTerminalViewMode ||
          isFullScreenTablesMode) && (
          <SmartTradeButton
            data-tut={'createSM'}
            style={{
              height: '3rem',
              width: '30rem',
              backgroundColor: theme.palette.green.main,
              margin: '0.5rem 0.8rem',
              borderRadius: '0.8rem',
              boxShadow: '0px 0px 0.5rem #74787E',
            }}
            onClick={() => {
              updateTerminalViewMode('smartOrderMode')
            }}
          >
            Create an advanced trade
          </SmartTradeButton>
        )}
      </TitleTabsGroup>
    </>
  )
}

const TradingTabsWrapper = compose(
  queryRendererHoc({
    query: getActiveStrategies,
    name: 'getActiveStrategiesQuery',
    fetchPolicy: 'cache-only',
    variables: (props: INextQueryProps) => ({
      activeStrategiesInput: {
        page: props.pageSmartTrades,
        perPage: props.perPageSmartTrades,
        activeExchangeKey: props.selectedKey.keyId,
        marketType: props.marketType,
        allKeys: props.showSmartTradesFromAllAccounts,
        ...(!props.showAllSmartTradePairs
          ? {}
          : { specificPair: props.currencyPair }),
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    showLoadingWhenQueryParamsChange: false,
  }),
  queryRendererHoc({
    query: getOpenOrderHistory,
    name: `getOpenOrderHistoryQuery`,
    fetchPolicy: 'cache-and-network',
    variables: (props: INextQueryProps) => ({
      openOrderInput: {
        activeExchangeKey: props.selectedKey.keyId,
        marketType: props.marketType,
        allKeys: props.showOpenOrdersFromAllAccounts,
        page: props.pageOpenOrders,
        perPage: props.perPageOpenOrders,
        ...(!props.showAllOpenOrderPairs
          ? {}
          : { specificPair: props.currencyPair }),
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    showLoadingWhenQueryParamsChange: false,
  }),
  queryRendererHoc({
    query: getActivePositions,
    name: `getActivePositionsQuery`,
    fetchPolicy: 'cache-only',
    variables: (props: INextQueryProps) => ({
      input: {
        keyId: props.selectedKey.keyId,
        allKeys: props.showPositionsFromAllAccounts,
        ...(!props.showAllPositionPairs
          ? {}
          : { specificPair: props.currencyPair }),
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    showLoadingWhenQueryParamsChange: false,
  })
)(TradingTabs)

export default React.memo(
  TradingTabsWrapper,
  (prevProps: any, nextProps: any) => {
    if (
      prevProps.isDefaultTerminalViewMode ===
        nextProps.isDefaultTerminalViewMode &&
      prevProps.isDefaultOnlyTables === nextProps.isDefaultOnlyTables &&
      prevProps.tab === nextProps.tab &&
      prevProps.marketType === nextProps.marketType &&
      prevProps.selectedKey.keyId === nextProps.selectedKey.keyId &&
      prevProps.theme.palette.type === nextProps.theme.palette.type &&
      prevProps.currencyPair === nextProps.currencyPair &&
      prevProps.showAllPositionPairs === nextProps.showAllPositionPairs &&
      prevProps.showAllOpenOrderPairs === nextProps.showAllOpenOrderPairs &&
      prevProps.showAllSmartTradePairs === nextProps.showAllSmartTradePairs &&
      prevProps.showPositionsFromAllAccounts ===
        nextProps.showPositionsFromAllAccounts &&
      prevProps.showOpenOrdersFromAllAccounts ===
        nextProps.showOpenOrdersFromAllAccounts &&
      prevProps.showSmartTradesFromAllAccounts ===
        nextProps.showSmartTradesFromAllAccounts &&
      prevProps.pageOpenOrders === nextProps.pageOpenOrders &&
      prevProps.perPageOpenOrders === nextProps.perPageOpenOrders &&
      prevProps.pageSmartTrades === nextProps.pageSmartTrades &&
      prevProps.perPageSmartTrades === nextProps.perPageSmartTrades
    ) {
      return true
    }

    return false
  }
)
