import React from 'react'
import Tour from 'reactour'
import styled from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'
import exclamationMarkNotification from '@icons/exclamationMarkNotification.svg'

import twitter from '@icons/twitter.svg'
import telegram from '@icons/telegram.svg'
import discord from '@icons/discord.svg'



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

export const WrapperForNotificationTour = styled.div`
  && > span[data-tour-elem="badge"] {
    display: none;
  }
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

const notificationBox = () => ({
  padding: '3rem',
  width: '50%',
  height: 'auto',
  backgroundColor: '#0E1016',
  borderRadius: '3rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '0.1rem solid #E0E5EC',
  maxWidth: 'initial',
})

export const NotificationBlock = styled.div``

export const NotificationBlockInitial = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
`

export const NotificationBlockFinal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const RegularText = styled.p`
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 1.6rem;
  color: #f5f5fb;
  letter-spacing: -0.523077px;
`

export const BoldText = styled.p`
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 1.6rem;
  color: #f5f5fb;
  letter-spacing: -0.523077px;
`

export const WarningText = styled.p`
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 1.6rem;
  color: #f29c38;
  letter-spacing: -0.523077px;
`

export const HeadingBoldText = styled.p`
  font-family: DM Sans;
  font-weight: bold;
  font-size: 2.6rem;
  color: #f5f5fb;
  letter-spacing: -0.784615px;
`

export const GotItButton = styled.button`
  width: 8rem;
  height: 3.5rem;
  border: none;
  background-color: #c7ffd0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bolder;
  border-radius: 0.5rem;
  width: 184px;
  height: 40px;

  background: #366ce5;
  border-radius: 8px;
`

export const notificationTourConfig = [
  {
    selector: '[data-tut="reactour__style"]',
    content: ({ close, goTo, inDOM, step }) => {
      return (
        <Container>
          <NotificationBlockInitial>
            <div>
              <HeadingBoldText>An important announcement!</HeadingBoldText>
              <BoldText>
                Tether is bringing the native USDT stablecoin to the Solana
                network.
              </BoldText>
            </div>
            <div>
              <SvgIcon
                src={exclamationMarkNotification}
                width="81px"
                height="auto"
              />
            </div>
          </NotificationBlockInitial>
          <NotificationBlock style={{ paddingBottom: '2rem' }}>
            <RegularText>
              This means that trading of all tokens paired with wUSDT (Wrapped
              USDT) will be stoped as of Friday, March 26, 2021.
            </RegularText>
            <RegularText>
              At the same time, we will open trading of all tokens paired with
              native USDT.
            </RegularText>
            <WarningText>
              To continue trading with high liquidity on native USDT pairs you
              have to cancel all open orders, settle all your funds and convert
              your wUSDT tokens to native USDT in your wallets.
            </WarningText>
            <WarningText>
              You can send funds from your wUSDT to native USDT easily using
              Cryptocurrencies.Ai wallet.
            </WarningText>
          </NotificationBlock>
          <NotificationBlock>
            <RegularText>Native USDT Mint Address:</RegularText>
            <BoldText>Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB</BoldText>
          </NotificationBlock>
          <NotificationBlockFinal>
            <div>
              <RegularText>Have any questions? Contact us:</RegularText>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/CCAI_Official"
                >
                  <SvgIcon
                    style={{ fill: 'white' }}
                    src={twitter}
                    width="16px"
                    height="auto"
                  />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://t.me/CryptocurrenciesAi"
                >
                  <SvgIcon
                    src={telegram}
                    width="16px"
                    height="auto"
                  />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://discord.gg/2EaKvrs"
                >
                  <SvgIcon
                    src={discord}
                    width="16px"
                    height="auto"
                  />
                </a>
              </div>
            </div>
            <div>
              <GotItButton onClick={() => close()}> Got it! </GotItButton>
            </div>
          </NotificationBlockFinal>
        </Container>
      )
    },
    style: notificationBox(),
  },
]

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
  // {
  //   selector: '[data-tut="farming"]',
  //   content: () => (
  //     <Container>
  //       <Block>Farming</Block>
  //       <Text padding={'4rem 1.5rem'}>
  //         Here is info about your DCFI farming. Click here to learn more.
  //       </Text>
  //     </Container>
  //   ),
  //   style: Box({ height: '25rem' }),
  // },
  {
    selector: '[data-tut="pairs"]',
    content: () => (
      <Container>
        <Block>Pairs</Block>
        <Text padding={'2.5rem 1.5rem'}>
          Choose any available trading pair in this menu.
        </Text>
        {/* <BolderText>Note: you can farm $DCFI when trading SRM/USDT.</BolderText> */}
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
          trading.There should be some SOL in your wallet to trade on DEX.
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
        <Text padding={'2.5rem 1.5rem'}>Here is your balance</Text>
        <Text>
          Unsettled balance are funds were traded but haven't returned to your
          wallet. Press "Settle" to transfer the funds back to your wallet.
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
