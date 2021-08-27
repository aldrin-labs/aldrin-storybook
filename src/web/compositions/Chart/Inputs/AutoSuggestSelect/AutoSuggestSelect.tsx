import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

// import stableCoins from '@core/config/stableCoins'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
// import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
// import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'

// import TextInputLoader from '@sb/components/Placeholders/TextInputLoader'

import { IProps } from './AutoSuggestSeletec.types'
import { ExchangePair, SelectR } from './AutoSuggestSelect.styles'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import { updateFavoritePairs } from '@core/graphql/mutations/chart/updateFavoritePairs'
import SelectWrapper from '../SelectWrapper/SelectWrapper'
import useMobileSize from '@webhooks/useMobileSize'

const IntegrationReactSelect = (props: IProps) => {
  const {
    theme: {
      palette: { divider },
    },
    theme,
    selectStyles,
    updateFavoritePairsMutation,
    activeExchange,
    market,
    marketName,
    markets,
    allMarketsMap,
    tokenMap,
    isMintsPopupOpen,
    setIsMintsPopupOpen,
  } = props

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobileSize() || true

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleChange = ({ value }: { value: string }) => {
    const { history } = props

    if (!value) {
      return
    }

    closeMenu()
    history.push(`/chart/spot/${value}`)

    return
  }

  return (
    <>
      <ExchangePair
        id={'ExchangePair'}
        border={divider}
        selectStyles={selectStyles}
        fixed={isMenuOpen}
      >
        <div
          onClick={isMobile && toggleMenu}
          style={{ display: 'flex', width: '100%' }}
        >
          <SelectR
            style={{ width: '100%' }}
            value={
              !isMenuOpen &&
              marketName && {
                marketName,
                label: marketName,
              }
            }
            fullWidth={true}
            isDisabled={true}
          />
        </div>
        <SelectWrapper
          id={'selectWrapper'}
          theme={theme}
          updateFavoritePairsMutation={updateFavoritePairsMutation}
          onSelectPair={handleChange}
          closeMenu={closeMenu}
          marketType={1}
          activeExchange={activeExchange}
          markets={markets}
          allMarketsMap={allMarketsMap}
          market={market}
          tokenMap={tokenMap}
          isMintsPopupOpen={isMintsPopupOpen}
          setIsMintsPopupOpen={setIsMintsPopupOpen}
          marketName={marketName}
        />
      </ExchangePair>
    </>
  )
}

export default compose(
  withRouter,
  withTheme(),
  queryRendererHoc({
    query: GET_VIEW_MODE,
    name: 'getViewModeQuery',
  }),
  queryRendererHoc({
    query: GET_CHARTS,
    name: 'getCharts',
  }),
  graphql(CHANGE_CURRENCY_PAIR, {
    name: 'changeCurrencyPairMutation',
  }),
  graphql(updateFavoritePairs, {
    name: 'updateFavoritePairsMutation',
  }),
  graphql(ADD_CHART, { name: 'addChartMutation' }),
  withMarketUtilsHOC
)(IntegrationReactSelect)
