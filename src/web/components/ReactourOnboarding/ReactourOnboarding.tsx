import React from 'react'
import Tour from 'reactour'
import { withTheme } from '@sb/types/materialUI'

import Onboard from '@icons/onboard.svg'
import styled from 'styled-components'

const Logo = styled.img`
  width: 5rem;
  height: auto;
`

export const FinishBtn = styled.button`
  width: 8rem;
  height: 3.5rem;
  border: none;
  background-color: #c7ffd0;
  color: #000;
  font-size: 1.4rem;
  font-weight: bolder;
  border-radius: 0.5rem;
`
export const Block = styled.div`
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  align-items: center;
  padding: 0 2rem;
  height: 35%;
  width: 100%;
  background: #09acc7;
  display: flex;
  justify-content: space-between;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
`
export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 0;
`
export const BolderText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1.6rem;
  padding: 1.5rem 1.5rem;
  display: flex;
  align-items: center;
  font-family: DM Sans;
`
export const Text = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 1.6rem;
  padding: ${(props) => props.padding || '0 1.5rem'};
  display: flex;
  align-items: center;
  font-family: DM Sans;
`
const Box = ({ height = '30rem' }) => {
  return {
    padding: '0 0 1rem 0',
    width: '45rem',
    height,
    backgroundColor: '#0E1016',
    color: 'white',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '0.1rem solid #E0E5EC',
    boxShadow: '0px 0px 1.5rem #D1D9E6',
  }
}
export const tourConfig = [
  {
    selector: '[data-tut="reactour__style"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <BolderText>
          Hey, welcome to Cryptocurrencies.ai smart trading terminal!
        </BolderText>
        <Text>
          {' '}
          If you want to trade on a classic terminal, you can switch to it in
          one click.{' '}
        </Text>
        <Text padding={'1.5rem 1.5rem'}>
          {' '}
          Let us quickly show you our exchange.
        </Text>
      </Container>
    ),
    style: Box({ height: '32rem' }),
  },
  {
    selector: '[data-tut="spot&futures"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2rem 1.5rem'}>
          You can switch between Spot and Futures.
        </Text>{' '}
        <BolderText>Currently you’re in the futures mode.</BolderText>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="menu"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2rem 1.5rem'}>
          This menu offers other Cryptocurrencies.ai exchange features.
        </Text>
        <Text>
          <em>
            Data will be shown depending on your selection of spot or futures
            mode.
          </em>
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="total"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2rem 1.5rem'}>
          Total balance of all your spot and futures accounts.
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="smart&basic"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2rem 1.5rem'}>
          Easily switch between Smart and Basic terminal.
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="createSM"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2rem 1.5rem'}>
          Create smart orders by clicking this button. Click here to learn more
          about smart order.
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="smart-trades"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>

        <Text padding={'2rem 1.5rem'}>
          Manage your open Smart trades in this table.
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="balances"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>

        <Text padding={'2rem 1.5rem'}>
          View the balance of your account and deposit or withdraw funds.
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="deposit"]',
    content: () => (
      <Container>
        <Block>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2.5rem 1.5rem 0 1.5rem'}>
          All deposits are made into your spot wallet.
        </Text>
        <Text padding={'1.5rem 1.5rem'}>
          <em>
            To fund your futures account you have to transfer funds from spot to
            futures on futures portfolio page, futures trading terminal or
            accounts page in settings.
          </em>
        </Text>
      </Container>
    ),
    style: Box({ height: '33rem' }),
  },
]

export default withTheme()
