import React from 'react'
import Tour from 'reactour'
import styled from 'styled-components'

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
  padding: 0 0;
  height: 20%;
  width: 100%;
  background: #09acc7;
  display: flex;
  justify-content: center;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
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
        <Block>Welcome aboard!</Block>
        <BolderText>Welcome to Cryptocurrencies.ai x Serum DEX!</BolderText>
        <Text>Let us clarify some important points for trading here.</Text>
      </Container>
    ),
    style: Box({ height: '32rem' }),
  },
  {
    selector: '[data-tut="analytics"]',
    content: () => (
      <Container>
        <Block>Analytics</Block>
        <Text padding={'4rem 1.5rem'}>
          You can watch $SRM analytics under this tab.
        </Text>
      </Container>
    ),
    style: Box({ height: '27rem' }),
  },
  {
    selector: '[data-tut="farming"]',
    content: () => (
      <Container>
        <Block>Farming</Block>
        <Text padding={'4rem 1.5rem'}>
          Here is info about your DCFI farming. Click here to learn more.
        </Text>
      </Container>
    ),
    style: Box({ height: '25rem' }),
  },
  {
    selector: '[data-tut="pairs"]',
    content: () => (
      <Container>
        <Block>Pairs</Block>
        <Text padding={'2.5rem 1.5rem'}>
          Choose any available trading pair in this menu.
        </Text>
        <BolderText>Note: you can farm $DCFI when trading SRM/USDT.</BolderText>
      </Container>
    ),
    style: Box({ height: '27rem' }),
  },
  {
    selector: '[data-tut="wallet"]',
    content: () => (
      <Container>
        <Block>Wallet</Block>
        <Text padding={'1rem 1.5rem'}>
          Connect your Sollet.io wallet here to start trading.
        </Text>
        <Text padding={'1rem 1.5rem'}>
          Note: remember to create the address of token you want to trade before
          trading.
        </Text>
        <Text padding={'1rem 1.5rem'}>
          Note 2: there should be some SOL in your wallet to trade on DEX.
        </Text>
      </Container>
    ),
    style: Box({ height: '37rem' }),
  },
  {
    selector: '[data-tut="balances"]',
    content: () => (
      <Container>
        <Block>Balances</Block>
        <Text padding={'2.5rem 1.5rem'}>Here is your balances</Text>
        <Text>
          Unsettled balance is your funds that was traded already but didn’t
          return to wallet. Press “Settle” to return it.
        </Text>
        <Text padding={'1rem 1.5rem'}>
          To use auto settle, first enable auto approval in your wallet during
          connection.
        </Text>
      </Container>
    ),
    style: Box({ height: '32rem' }),
  },
]
