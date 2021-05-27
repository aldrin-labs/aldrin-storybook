import React from 'react'

import {
  MainContainer,
  CardContainer,
  WhiteButton,
  Header,
  HeaderContainer,
  Description,
  Socials,
  ButtonContainer,
  TwitterLink,
  DiscordLink,
  TelegramLink,
} from './styles'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '../../compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'

import Banner from '@icons/Banner_coming-soon.svg'
import ArrowCard from '@icons/arrows.svg'
import PoolCard from '@icons/Pool.svg'
import WalletCard from '@icons/walletCard.svg'
import Candies from '../../../icons/candies.svg'
import ChartCard from '@icons/chart.svg'
import Alameda from '@icons/alamedaLight.svg'
import Serum from '@icons/Logo&Serum.svg'
import Chrome from '@icons/chrome.svg'
import { CCAIProviderURL } from '@sb/dexUtils/utils'

export const Homepage = () => {
  return (
    <MainContainer>
      <RowContainer>
        <CardContainer
          style={{ marginTop: '3rem', minHeight: '25rem' }}
          width={'calc(100% - 5.5rem)'}
        >
          <img src={Banner} width={'100%'} />
          {/* <WhiteButton
            style={{ position: 'absolute', right: '10rem' }}
            width={'21rem'}
            padding={'0 3rem'}
            needHover={true}
            href={`https://ido.cryptocurrencies.ai/`}
          >
            Learn More
            <svg
              width="20"
              height="8"
              viewBox="0 0 20 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                fill="#F8FAFF"
              />
            </svg>
          </WhiteButton> */}
        </CardContainer>
      </RowContainer>
      <RowContainer align={'flex-start'} style={{ marginTop: '1.5rem' }}>
        <Row
          direction={'column'}
          height={'60%'}
          width={'calc((98.5% - 4rem) / 3)'}
        >
          <CardContainer style={{ paddingRight: '1.5rem' }}>
            <HeaderContainer>
              <Header fontSize={'6rem'}>DEX</Header>
              <Description fontSize={'2.25rem'} width={'75%'}>
                One of the fastest DEXs in the world, built on the Serum and
                Solana technology. User-friendly DeFi experience with low fees.
              </Description>
              <WhiteButton
                needHover={true}
                style={{ marginBottom: '-1rem' }}
                width={'18rem'}
                padding={'0 3rem'}
                href={'/chart'}
              >
                Trade Now
                <svg
                  width="20"
                  height="8"
                  viewBox="0 0 20 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                    fill="#F8FAFF"
                  />
                </svg>
              </WhiteButton>
            </HeaderContainer>
            <SvgIcon src={Candies} width={'100%'} height={'100%'} />
          </CardContainer>
        </Row>
        <Row
          height={'60%'}
          direction={'column'}
          width={'calc((100% - 4rem) / 3)'}
          style={{ paddingRight: '1.5rem' }}
        >
          <CardContainer
            style={{ marginBottom: '1.5rem', marginTop: '0.1rem' }}
          >
            <SvgIcon src={WalletCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header style={{ marginTop: '0.8rem' }}>Wallet</Header>
                <Description>
                  Hold and trade the top cryptocurrencies on
                  <strong>CCAI  Wallet™</strong>.
                </Description>
              </RowContainer>
              <Row direction={'column'}>
                <WhiteButton
                  // style={{ marginBottom: '3rem' }}
                  needHover={true}
                  width={'22rem'}
                  padding={'0 2rem'}
                  href={`${CCAIProviderURL}/`}
                >
                  Go to Wallet
                  <svg
                    width="20"
                    height="8"
                    viewBox="0 0 20 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                      fill="#F8FAFF"
                    />
                  </svg>
                </WhiteButton>
                {/* <WhiteButton
                  style={{ cursor: 'pointer' }}
                  needHover={true}
                  width={'22rem'}
                  padding={'0 2rem'}
                >
                  Install Plug-In
                  <SvgIcon src={Chrome} width={'2.3rem'} height={'2.3rem'} />
                </WhiteButton> */}
              </Row>
            </HeaderContainer>
          </CardContainer>
          <CardContainer>
            <SvgIcon src={ChartCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header style={{ marginTop: '0.8rem' }}>Analytics</Header>
                <Description style={{ marginBottom: '1rem' }}>
                  Transparent analysis of all markets on Serum in simple charts.
                </Description>
              </RowContainer>
              <WhiteButton
                needHover={true}
                width={'30rem'}
                padding={'0 2rem'}
                href={'/analytics'}
              >
                View Analytics
                <svg
                  width="20"
                  height="8"
                  viewBox="0 0 20 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                    fill="#F8FAFF"
                  />
                </svg>
              </WhiteButton>
            </HeaderContainer>
          </CardContainer>
        </Row>
        <Row
          height={'60%'}
          direction={'column'}
          width={'calc(((100% - 4rem) / 3) - 1.7rem)'}
        >
          <CardContainer
            style={{ marginBottom: '1.5rem', marginTop: '0.1rem' }}
          >
            <SvgIcon src={ArrowCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header>Swap</Header>
                <Description style={{ marginBottom: '-1rem' }}>
                  Low-fee and instant Swaps. Made possible by Solana.
                </Description>
              </RowContainer>
              <WhiteButton
                style={{ cursor: 'auto' }}
                needHover={false}
                width={'30rem'}
                padding={'0 2rem'}
              >
                Coming Soon
              </WhiteButton>
            </HeaderContainer>
          </CardContainer>
          <CardContainer>
            <SvgIcon src={PoolCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header>Pools</Header>
                <Description style={{ marginBottom: '-1rem' }}>
                  Provide liquidity and earn a fees.
                </Description>
              </RowContainer>
              <WhiteButton
                style={{ cursor: 'auto' }}
                needHover={false}
                width={'30rem'}
                padding={'0 2rem'}
              >
                Coming Soon
              </WhiteButton>
            </HeaderContainer>
          </CardContainer>
        </Row>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <Row
          width={'18%'}
          height={'7rem'}
          justify={'space-around'}
          style={{ marginLeft: '2rem' }}
        >
          <Text fontSize={'1.7rem'}>In partnership with</Text>
          {/* <SvgIcon src={Alameda} height={'auto'} width={'40%'} /> */}
          <SvgIcon src={Serum} height={'auto'} width={'28%'} />
        </Row>
        <Socials justify={'space-around'} width={'20%'}>
          <TwitterLink />
          <TelegramLink />
          <DiscordLink />
        </Socials>
      </RowContainer>
    </MainContainer>
  )
}
