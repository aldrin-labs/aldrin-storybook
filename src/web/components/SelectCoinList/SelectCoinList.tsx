import * as React from 'react'
import { compose } from 'recompose'

import ReactSelectComponent from '@sb/components/ReactSelectComponent/index'

import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'

import { IRow } from './SelectCoinList.types'

class SelectCoinList extends React.PureComponent {
  combineDataToSelectOptions = (markets) => {
    const {
      needAdditionalFiltering = false,
      needAdditionalMapping = false,
      additionalFiltering,
      additionalMapping,
      changeRowToShow = null,
    } = this.props

    let splittedMarkets = []

    markets.forEach((market) => {
      market.name.split('/').forEach((v: string) => splittedMarkets.push(v))
    })

    splittedMarkets = [...new Set(splittedMarkets)].map((coin) => ({ symbol: coin }))

    const coinOptions = splittedMarkets
      .slice()
      // .filter((a) => a.priceUSD !== 0)
      .filter(needAdditionalFiltering ? additionalFiltering : (a) => a)
      .map(needAdditionalMapping ? additionalMapping : (a) => a)
      .sort((a: IRow, b: IRow) => a.symbol.localeCompare(b.symbol))
      .map(({ name, symbol, priceUSD, priceBTC, alreadyExist = false, dustFiltered = false }) => ({
        name,
        label: symbol,
        value: symbol,
        priceUSD,
        priceBTC,
        alreadyExist,
        dustFiltered,
      }))

    if (changeRowToShow) {
      return coinOptions.map((option) => changeRowToShow(option))
    }

    return coinOptions
  }

  render() {
    const { placeholder = '', inputValue = undefined, filterCoin = '', markets, ...otherPropsForSelect } = this.props

    const options = this.combineDataToSelectOptions(markets)

    return (
      <ReactSelectComponent
        options={options}
        inputValue={inputValue}
        placeholder={filterCoin || placeholder}
        {...otherPropsForSelect}
      />
    )
  }
}

export default compose(
  // ForwarderRefHoc,
  // queryRendererHoc({
  //   query: assetBySymbolByExchangeQuery,
  //   variables: { input: { search: '' } },
  //   fetchPolicy: 'cache-and-network',
  //   withOutSpinner: true,
  //   withTableLoader: true,
  //   withoutLoading: true,
  // })
  withMarketUtilsHOC
)(SelectCoinList)
