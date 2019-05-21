import * as React from 'react'

import { Typography, Link } from '@material-ui/core'

import BinanceLogo from '@icons/Binance_logo.svg'
import CoinBasePro from '@icons/CoinBasePro.svg'

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
    icon: BinanceLogo,
  },
  {
    icon: CoinBasePro,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
  },
  {
    icon: BinanceLogo,
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
