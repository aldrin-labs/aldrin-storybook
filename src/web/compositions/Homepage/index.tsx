import React from 'react'

import {
  LinkToDiscord,
  LinkToMedium,
  LinkToTelegram,
  LinkToTwitter,
  LinkToYouTube,
  MainContainer,
  MainContainerForSmallScreens,
  NewLink,
  StyledA,
} from './styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import newBanner from '@icons/newBanner.svg'
import newBannerForSmallScreens from '@icons/newBannerForSmallScreens.svg'
import swapsIcon from '@icons/swapsIcon.svg'
import rebalanceIcon from '@icons/rebalanceIcon.svg'
import sunWalletIcon from '@icons/sunWalletIcon.svg'
import analyticsIcon from '@icons/analyticsicon.svg'
import serumCCAILogo from '@icons/serumCCAILogo.svg'

import SvgIcon from '@sb/components/SvgIcon'
import { MobileFooter } from '../Chart/components/MobileFooter/MobileFooter'

export const Homepage = () => {
  return (
    <>
      <MainContainer>
        <RowContainer padding={'5rem 25rem'} justify={'space-between'}>
          <LinkToTwitter />
          <LinkToTelegram />
          <LinkToDiscord />
          <LinkToMedium />
          <LinkToYouTube />
        </RowContainer>
        <RowContainer padding={'0 25rem'}>
          <SvgIcon width={'100%'} height={'auto'} src={newBanner} />
        </RowContainer>
        <RowContainer padding={'5rem 25rem'} justify={'space-between'}>
          <NewLink to="/chart">Trading</NewLink>
          <StyledA
            href={'https://wallet.cryptocurrencies.ai'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Wallet
          </StyledA>
          <NewLink to="/analytics">Analytics</NewLink>
          {/* <NewLink to="/pools">Liquidity Pools</NewLink> */}
          {/* <NewLink to="/swaps">Swap</NewLink> */}
          {/* <NewLink to="/rebalance">Rebalance</NewLink> */}
        </RowContainer>
      </MainContainer>
      <MainContainerForSmallScreens>
        <RowContainer
          justify={'space-between'}
          height="15rem"
          padding="0rem 3rem"
          style={{
            backgroundColor: '#222429',
            borderBottom: '0.1rem solid #383B45',
          }}
        >
          <SvgIcon src={serumCCAILogo} width={'40%'} height={'auto'} />
          <Row justify={'space-between'} width={'35%'}>
            <LinkToTwitter />
            <LinkToTelegram />
            <LinkToDiscord />
          </Row>
        </RowContainer>
        <RowContainer padding="5rem 3rem">
          <SvgIcon
            src={newBannerForSmallScreens}
            width={'100%'}
            height={'auto'}
          />
        </RowContainer>
        <RowContainer
          align={'baseline'}
          padding={'2rem 3rem'}
          justify={'space-between'}
        ></RowContainer>{' '}
      </MainContainerForSmallScreens>
    </>
  )
}
