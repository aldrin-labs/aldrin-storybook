import * as React from 'react'

import { Typography, Link } from '@material-ui/core'


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

export default class Welcome extends React.Component {
  state = {
    selected: -1,
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
                addExhange={this.addExchange}
                selectExgange={(index) => this.setState({selected: index})}
                selected={this.state.selected}
              />
            </ExchangeContainer>
          </ContentContainer>
          <ButtonContainer>
          <StyledBeginButton>
            Import
          </StyledBeginButton>
        </ButtonContainer>
      </Wrapper>
    )
  }
}
