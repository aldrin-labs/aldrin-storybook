import React from 'react'
import Tour from 'reactour'
import { withTheme } from '@sb/types/materialUI'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import Onboard from '@icons/onboard.svg'
import styled, { ThemeConsumer } from 'styled-components'

const Logo = styled.img`
  width: 5rem;
  height: auto;
`

export const FinishBtn = styled.button`
  width: 8rem;
  height: 3.5rem;
  border: none;
  background-color: #7380eb;
  color: #fff;
  font-size: 1.4rem;
  font-weight: bolder;
  border-radius: 0.5rem;
  outline: none;
`
export const Block = styled.div`
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  align-items: center;
  padding: 0 2rem;
  height: 35%;
  width: 100%;
  background: ${(props) => props.theme.palette.green.onboarding};
  display: flex;
  color: #fff;
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
    width: '55rem',
    height,
    backgroundColor: theme.palette.white.onboarding,
    color: theme.palette.grey.onboard,
    borderRadius: '.3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ABBAD1',
    boxShadow: '0px 0px 10px #D1D9E6',
    //border: '0.1rem solid #E0E5EC',
    //boxShadow: '0px 0px 1.5rem #D1D9E6',
  }
}

export const smartTerminal = [
  {
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <BolderText padding={'2.5rem 1.5rem 0 1.5rem'}>
          This is advanced mode!
        </BolderText>
        <Text padding={'1.5rem 1.5rem'}>
          If you want to trade on the Basic terminal, you can switch to it in
          one click.
        </Text>
        <Text padding={'1.5rem 1.5rem'}>
          Let us quickly show you how to use it.
        </Text>
      </Container>
    ),
    style: Box({ theme, height: '33rem' }),
  },
  {
    selector: '[data-tut="deposit"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'1.5rem 1.5rem'}>
          {' '}
          Smart order was designed to automate your manual trading by
          simultaneously setting the entry point, Stop Loss and Take Profit with
          advanced options.
        </Text>
        <Text padding={'0.5rem 1.5rem'}>
          To promote healthy trading behaviour it is a requirement to enter Stop
          Loss and Take Profit.
        </Text>
        <Text padding={'0.5rem 1.5rem'}>
          It’s easy, let’s explore the steps.{' '}
        </Text>
      </Container>
    ),
    style: Box({ height: '37rem' }),
  },
  {
    selector: '[data-tut="step1"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <BolderText padding={'1.5rem 1.5rem'}>Step 1: Enter</BolderText>
        <Text padding={'0.5rem 1.5rem'}>
          Here you can set conditions to enter your position. You can set
          leverage, side, order type and amount. You can use advanced settings
          such as averaging, trailing enrty or entering a position by a
          Tradingview alert. Hover over the fields to see the tooltips.
        </Text>
      </Container>
    ),
    style: Box({ height: '37rem' }),
  },
  {
    selector: '[data-tut="step2"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <BolderText padding={'1.5rem 1.5rem'}>Step 2: Stop Loss</BolderText>
        <Text padding={'0.5rem 1.5rem'}>
          Set conditions to exit your position if it's in a loss. Specify the
          exact price or set loss level in %. Use our advanced settings such as
          Timeout or exit a position by a Tradingview alert.
        </Text>
      </Container>
    ),
    style: Box({ height: '37rem' }),
  },
  {
    selector: '[data-tut="step3"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <BolderText padding={'1.5rem 1.5rem'}>Step 3: Take profit</BolderText>
        <Text padding={'0.5rem 1.5rem'}>
          Set conditions to exit your position if it's in a profit. Specify the
          exact price or set profit level in %. Use our advanced settings such
          as Trailing, multiple targets or exit a position by a Tradingview
          alert.
        </Text>
      </Container>
    ),
    style: Box({ height: '37rem' }),
  },
  {
    selector: '[data-tut="createBtn"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'0.5rem 1.5rem'}>
          When you set your entry conditions, Stop Loss and Take Profit – you
          can track the performance of your position in the smart trade tab.
        </Text>
        <Text padding={'1.5rem 1.5rem'}>
          <a
            style={{
              color: '#7380eb',
              textDecoration: 'none',
            }}
            href="https://cryptocurrencies.ai/smartTrading"
            target="_blank"
          >
            Click here to learn more about smart order.
          </a>
        </Text>
      </Container>
    ),
    style: Box({ height: '37rem' }),
  },
]

export const tourConfig = [
  {
    selector: '[data-tut="reactour__style"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <BolderText>
          Hey, welcome to Cryptocurrencies.Ai's smart trading terminal!
        </BolderText>
        <Text>
          {' '}
          If you want to trade on a basic terminal, you can switch to it in one
          click.{' '}
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
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2rem 1.5rem'}>
          You can switch between Spot and Futures.
        </Text>{' '}
        <BolderText>Currently you’re in the Spot mode.</BolderText>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="menu"]',
    content: () => (
      <Container>
        <Block theme={theme}>
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
        <Block theme={theme}>
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
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'2rem 1.5rem'}>
          Easily switch between Basic and Advanced terminal. You can trade with
          Smart orders on Advanced terminal.
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="basic-terminal"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>

        <Text padding={'2rem 1.5rem'}>
          Place orders with or without preset Stop Loss and Take Profit.
        </Text>
      </Container>
    ),
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="balances"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>

        <Text padding={'2rem 1.5rem'}>
          View the balance of your account and deposit or withdraw funds.
        </Text>

        <a
          href="https://develop.app.cryptocurrencies.ai/profile/deposit"
          style={{
            textDecoration: 'none',
            marginLeft: '19rem',
            marginTop: '2rem',
          }}
        >
          <BtnCustom
            btnWidth="10rem"
            height="2.5rem"
            fontSize=".9rem"
            padding=".2rem 0 .1rem 0"
            margin="0 0 .4rem 0"
            borderRadius=".4rem"
            textTransform="none"
            btnColor={theme.palette.white.main}
            borderColor={theme.palette.blue.main}
            backgroundColor={theme.palette.blue.main}
            hoverColor={theme.palette.white.main}
            hoverBackground={theme.palette.blue.main}
            transition={'all .4s ease-out'}
          >
            Deposit now
          </BtnCustom>
        </a>
      </Container>
    ),
    showNavigation: false,
    style: Box({ height: '30rem' }),
  },
  {
    selector: '[data-tut="createSM"]',
    content: () => (
      <Container>
        <Block theme={theme}>
          <Logo src={Onboard} />
          Denis from Cryptocurrencies.ai
        </Block>
        <Text padding={'1.5rem 1.5rem'}>
          The main point of advanced terminal is ability to place Smart orders.
          Create it by this button and manage in the Smart Trades tab in the
          table.
        </Text>
        <Text padding={'1.5rem 1.5rem'}>
          <a
            style={{
              color: '#7380eb',
              textDecoration: 'none',
            }}
            href="https://cryptocurrencies.ai/smartTrading"
            target="_blank"
          >
            Click here to learn more about smart order.
          </a>
        </Text>
      </Container>
    ),
    style: Box({ height: '33rem' }),
  },
  {
    selector: '[data-tut="deposit"]',
    content: () => (
      <Container>
        <Block theme={theme}>
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
