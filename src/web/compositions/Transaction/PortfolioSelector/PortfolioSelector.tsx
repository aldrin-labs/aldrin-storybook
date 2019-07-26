import React, { Component } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'

import { ReactSelectCustom } from '../TransactionPage.styles'

class PortfolioSelector extends Component {
  render() {
    const { getMyPortfoliosQuery } = this.props

    const MyPortfoliosOptions = getMyPortfoliosQuery.myPortfolios.map(
      (item: { _id: string; name: string }) => {
        return {
          label: item.name,
          value: item._id,
        }
      }
    )
    return (
      <ReactSelectCustom
        value={MyPortfoliosOptions[0]}
        // onChange={(
        //   optionSelected: {
        //     label: string
        //     value: string
        //   } | null
        // ) => onRebalanceTimerChange(optionSelected)}
        isSearchable={false}
        options={MyPortfoliosOptions}
        singleValueStyles={{
          color: '#16253D',
          fontSize: '0.84rem',
          padding: '0',
        }}
        indicatorSeparatorStyles={{}}
        controlStyles={{
          background: 'transparent',
          border: 'none',
          width: 150,
        }}
        menuStyles={{
          width: 235,
          padding: '5px 8px',
          borderRadius: '14px',
          textAlign: 'center',
        }}
        optionStyles={{
          color: '#7284A0',
          background: 'transparent',
          textAlign: 'center',
          fontSize: '0.62rem',
          '&:hover': {
            borderRadius: '14px',
            color: '#16253D',
            background: '#E7ECF3',
          },
        }}
      />
    )
  }
}

export default compose(
  queryRendererHoc({
    query: getMyPortfoliosQuery,
    name: 'getMyPortfoliosQuery',
  })
)(PortfolioSelector)
