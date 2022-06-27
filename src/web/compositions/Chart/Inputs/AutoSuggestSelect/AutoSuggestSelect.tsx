import { withTheme } from '@material-ui/core/styles'
import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { withMarketUtilsHOC } from '@sb/hoc'

import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
// import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
// import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'

// import TextInputLoader from '@sb/components/Placeholders/TextInputLoader'

import SelectWrapper from '../SelectWrapper/SelectWrapper'
import { ExchangePair, SelectR } from './AutoSuggestSelect.styles'
import { IProps } from './AutoSuggestSeletec.types'

const IntegrationReactSelect = (props: IProps) => {
  const {
    theme: {
      palette: { divider },
    },
    theme,
    selectStyles,
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
  const isMobile = useMobileSize()

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
  }

  return (
    <>
      <ExchangePair
        id="ExchangePair"
        border={divider}
        selectStyles={selectStyles}
        fixed={isMenuOpen}
        onMouseEnter={!isMobile && toggleMenu}
        onMouseLeave={!isMobile && toggleMenu}
      >
        <div
          role="button"
          onClick={isMobile && toggleMenu}
          style={{ display: 'flex', width: '100%' }}
        >
          <SelectR
            style={{ width: '100%' }}
            value={
              marketName && {
                marketName,
                label: marketName,
              }
            }
            fullWidth
            isDisabled
          />
        </div>

        {isMenuOpen && (
          <SelectWrapper
            id="selectWrapper"
            theme={theme}
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
        )}
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
  graphql(ADD_CHART, { name: 'addChartMutation' }),
  withMarketUtilsHOC
)(IntegrationReactSelect)
