import React from 'react'
import SelectExchangeByCurrencyPair from '@core/components/SelectExchangeByCurrencyPair/SelectExchangeByCurrencyPair'
import { withTheme } from '@material-ui/styles'
import { ExchangeListContainer } from './SelectExchange.styles'
import { IProps } from './SelectExchange.types'

@withTheme()
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
    const {
      activeExchange,
      currencyPair,
      theme: {
        palette: { divider },
      },
    } = this.props

    return (
      <ExchangeListContainer border={divider}>
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
