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
  MainContainerForSmallScreens,
  TextContainer,
  BlockForText,
  ThinText,
  BannerHeader,
} from './styles'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '../../compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'

import Banner from '@icons/Banner.svg'
import ArrowCard from '@icons/arrows.svg'
import PoolCard from '@icons/Pool.svg'
import WalletCard from '@icons/walletCard.svg'
import Candies from '../../../icons/candies.svg'
import ChartCard from '@icons/chart.svg'
import Serum from '@icons/Logo&Serum.svg'
import Chrome from '@icons/chrome.svg'

import smallChartCard from '@icons/smallChartBanner.svg'
import smallBanner from '@icons/smallBanner.svg'
import smallPoolCard from '@icons/smallPools.svg'
import smallSwapsCard from '@icons/smallSwaps.svg'
import smallWalletCard from '@icons/smallWallet.svg'
import smallCandies from '@icons/smallCandies.svg'
import SerumCCAILogo from '@icons/serumCCAILogo.svg'
import Logo from '@icons/Banner_coming-soon.svg'

import { CCAIProviderURL } from '@sb/dexUtils/utils'

export const Homepage = () => {
  return (
    <>
      <MainContainer>
        <RowContainer>
          <CardContainer
            style={{ marginTop: '3rem', minHeight: '25rem' }}
            width={'calc(100% - 5.5rem)'}
          >
            <SvgIcon src={Banner} width={'100%'} height={'100%'} />
            <TextContainer>
              {' '}
              <Row style={{ flexWrap: 'nowrap' }} width={'60%'}>
                <SvgIcon width={'10%'} height={'10%'} src={Logo} />
                <BlockForText>
                  <BannerHeader
                    style={{
                      fontFamily: 'Avenir Next Thin',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Trade{' '}
                    <span
                      style={{
                        fontFamily: 'Avenir Next Bold',
                      }}
                    >
                      CCAI/USDC
                    </span>{' '}
                    on CCAI DEX and{' '}
                    <span
                      style={{
                        padding: '0 0 0.5rem 0',
                        fontFamily: 'Avenir Next Bold',
                      }}
                    >
                      WWT/ETH*
                    </span>{' '}
                    on Uniswap!{' '}
                  </BannerHeader>
                  <RowContainer margin={'2rem 0 0 0'} direction={'column'}>
                    <ThinText>
                      *CCAI token is not a native ERC20 token and was wrapped by
                      Wormhole Bridge. ERC20 CCAI token is called WWT.
                    </ThinText>
                    <ThinText>
                      <a
                        style={{
                          textDecoration: 'underline',
                          color: '#fbf2f2',
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://ccaiofficial.medium.com/how-to-transfer-ccai-token-from-erc20-to-solana-d36d835213c1"
                      >
                        Learn how to transfer CCAI Token from ERC20 to Solana.
                      </a>
                    </ThinText>
                  </RowContainer>
                </BlockForText>
              </Row>
              <Row direction={'column'}>
                {' '}
                <WhiteButton
                  width={'25rem'}
                  style={{ margin: '0 0 2rem 0', height: '5rem' }}
                  padding={'1rem 4rem'}
                  needHover={true}
                  href={`https://dex.cryptocurrencies.ai/chart/spot/CCAI_USDC`}
                >
                  Trade on CCAI DEX{' '}
                </WhiteButton>{' '}
                <WhiteButton
                  width={'25rem'}
                  style={{ height: '5rem' }}
                  padding={'1rem 4rem'}
                  needHover={true}
                  href={
                    'https://www.dextools.io/app/uniswap/pair-explorer/0x4a9e79219e9417ec6c0b67c42da387fb8a45230e'
                  }
                >
                  Trade on Uniswap
                </WhiteButton>
              </Row>
            </TextContainer>
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
                  Solana technology. User-friendly DeFi experience with low
                  fees.
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
                    Hold and trade the top cryptocurrencies on{' '}
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
                    Transparent analysis of all markets on Serum in simple
                    charts.
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
      <MainContainerForSmallScreens
        style={{ overflow: 'scroll', padding: '5rem 5rem' }}
      >
        <RowContainer justify={'flex-start'}>
          {' '}
          <img
            style={{
              height: '100%',
              width: '25rem',
            }}
            src={SerumCCAILogo}
          />
        </RowContainer>
        {/* <CardContainer style={{ margin: '4rem 0', height: 'auto' }}>
          <SvgIcon src={smallBanner} width={'100%'} height={'100%'} />
          <WhiteButton
            style={{
              position: 'absolute',
              right: '5rem',
              bottom: '4rem',
              height: '7rem',
              fontSize: '2.7rem',
              borderRadius: '2.4rem',
            }}
            width={'26rem'}
            padding={'0 3rem'}
            needHover={true}
            href={`https://ccai.cryptocurrencies.ai/`}
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
          </WhiteButton>
        </CardContainer> */}
        <CardContainer height={'auto'} style={{ margin: '4rem 0' }}>
          <SvgIcon src={smallCandies} width={'100%'} height={'100%'} />
          <HeaderContainer style={{ height: '86%', width: '66%' }}>
            <Header fontSize={'6rem'} style={{ lineHeight: 'auto' }}>
              DEX
            </Header>
            <Description
              fontSize={'2.6rem'}
              width={'100%'}
              style={{ lineHeight: '6rem', fontSize: '2.6rem' }}
            >
              One of the fastest DEXs in the world, built on the Serum and
              Solana technology. User-friendly DeFi experience with low fees.
            </Description>
          </HeaderContainer>
        </CardContainer>{' '}
        <CardContainer height={'auto'} style={{ margin: '4rem 0' }}>
          <SvgIcon src={smallWalletCard} width={'100%'} height={'100%'} />
          <HeaderContainer style={{ height: '86%', width: '66%' }}>
            <Header fontSize={'6rem'} style={{ lineHeight: 'auto' }}>
              Wallet{' '}
            </Header>
            <Description
              fontSize={'2.6rem'}
              width={'100%'}
              style={{ lineHeight: '6rem', fontSize: '2.6rem' }}
            >
              Hold and trade the top cryptocurrencies on{' '}
              <strong>CCAI  Wallet™</strong>.
            </Description>
          </HeaderContainer>
        </CardContainer>{' '}
        <CardContainer height={'auto'} style={{ margin: '4rem 0' }}>
          <SvgIcon src={smallChartCard} width={'100%'} height={'100%'} />
          <HeaderContainer style={{ height: '86%', width: '66%' }}>
            <Header fontSize={'6rem'} style={{ lineHeight: 'auto' }}>
              Analytics{' '}
            </Header>
            <Description
              fontSize={'2.6rem'}
              width={'100%'}
              style={{ lineHeight: '6rem', fontSize: '2.6rem' }}
            >
              Transparent analysis of all markets on Serum in simple charts.
            </Description>
          </HeaderContainer>
        </CardContainer>{' '}
        <CardContainer height={'auto'} style={{ margin: '4rem 0' }}>
          <SvgIcon src={smallSwapsCard} width={'100%'} height={'100%'} />
          <HeaderContainer style={{ height: '86%', width: '66%' }}>
            <Header fontSize={'6rem'} style={{ lineHeight: 'auto' }}>
              Swap{' '}
            </Header>
            <Description
              fontSize={'2.6rem'}
              width={'100%'}
              style={{ lineHeight: '6rem', fontSize: '2.6rem' }}
            >
              Low-fee and instant Swaps. Made possible by Solana.{' '}
            </Description>
          </HeaderContainer>
        </CardContainer>{' '}
        <CardContainer height={'auto'} style={{ margin: '4rem 0' }}>
          <SvgIcon src={smallSwapsCard} width={'100%'} height={'100%'} />
          <HeaderContainer style={{ height: '86%', width: '66%' }}>
            <Header fontSize={'6rem'} style={{ lineHeight: 'auto' }}>
              Pools{' '}
            </Header>
            <Description
              fontSize={'2.6rem'}
              width={'100%'}
              style={{ lineHeight: '6rem', fontSize: '2.6rem' }}
            >
              Provide liquidity and earn a fees.{' '}
            </Description>
          </HeaderContainer>
        </CardContainer>{' '}
      </MainContainerForSmallScreens>
    </>
  )
}
