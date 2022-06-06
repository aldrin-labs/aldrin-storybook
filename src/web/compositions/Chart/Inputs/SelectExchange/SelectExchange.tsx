import React from 'react'

import SelectExchangeByCurrencyPair from '@core/components/SelectExchangeByCurrencyPair/SelectExchangeByCurrencyPair'

import { ExchangeListContainer } from './SelectExchange.styles'
import { IProps } from './SelectExchange.types'

export default class SelectExchange extends React.Component<IProps> {
  onSelectChange = async (
    optionSelected: { label: string; value: string } | null
  ) => {
    const { changeActiveExchangeMutation } = this.props

    if (optionSelected) {
      await changeActiveExchangeMutation({
        variables: {
          exchange: {
            name: optionSelected.label,
            symbol: optionSelected.value,
          },
        },
      })
    }
  }

  render() {
    const { activeExchange, currencyPair, selectStyles } = this.props

    return (
      <ExchangeListContainer border="#e0e5ec" selectStyles={selectStyles}>
        <SelectExchangeByCurrencyPair
          onChange={this.onSelectChange}
          defaultValue={[
            { label: activeExchange.name, value: activeExchange.symbol },
          ]}
          currencyPair={currencyPair}
        />
      </ExchangeListContainer>
    )
  }
}
