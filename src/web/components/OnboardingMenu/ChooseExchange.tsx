import * as React from 'react'

import { Typography, Link } from '@material-ui/core'

import binance from '@icons/exchages/binance-logo.png'
import coinbase from '@icons/exchages/gdax_logo.png'
import Bittrex from '@icons/exchages/Bittrex-Logotype.png'
import KuCoin from '@icons/exchages/800px-KuCoin-logo.png'
import Poloniex from '@icons/exchages/Poloniex-logo-800px.png'
import Cryptopia from '@icons/exchages/Cryptopia.png'
import OKEx from '@icons/exchages/Official_logo_of_OKEx.png'
import Kraken from '@icons/exchages/Kraken-Logo-2.png'

import {
  Wrapper,
  StyledTypography,
  ContentContainer,
  SubHeader,
  StyledBeginButton,
  ButtonContainer,
  ExchangeContainer,
} from './styles'
import ExchangeTable from './ExchangeTable'

const exchangeList = [
  {
    name: 'binance',
    active: true,
    icon: binance,
  },
  {
    icon: coinbase,
  },
  {
    icon: Bittrex,
  },
  {
    icon: KuCoin,
  },
  {
    icon: Poloniex,
  },
  {
    icon: Cryptopia,
  },
  {
    icon: OKEx,
  },
  {
    icon: Kraken,
  },
  {
    addButton: true,
  },
]

export default class Welcome extends React.Component {
  state = {
    selected: -1,
  }

  confirmExchange = () => {
    const {
      selectExchange,
      changePage,
     } = this.props
    if (this.state.selected > -1) {
      this.props.selectExchange((exchangeList[this.state.selected]).name)
      this.props.changePage('ImportKey')
    }
  }

  addExchange = () => {
    this.setState({ selected: -1 })
    console.log('aaaa')
  }

  render() {
    return (
      <Wrapper>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
        >
          Select Exchange
        </Typography>
        <SubHeader>
          <StyledTypography
              color="inherit"
              align="center"
              variant="h6"
            >
              Import your wallet to get started
            </StyledTypography>
          </SubHeader>
          <ContentContainer>
            <ExchangeContainer>
              <ExchangeTable
                exchangeList={exchangeList}
                addExhange={this.addExchange}
                selectExgange={(index) => this.setState({selected: index})}
                selected={this.state.selected}
              />
            </ExchangeContainer>
          </ContentContainer>
          <ButtonContainer>
          <StyledBeginButton onClick={this.confirmExchange}>
            Import
          </StyledBeginButton>
        </ButtonContainer>
      </Wrapper>
    )
  }
}
