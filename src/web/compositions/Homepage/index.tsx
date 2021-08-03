import React from 'react'

import {
  MainContainer,
  MainContainerForSmallScreens,
  NewLink,
  StyledA,
} from './styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import newBanner from '@icons/newBanner.svg'
import newBannerForSmallScreens from '@icons/newBannerForSmallScreens.svg'

import {
  LinkToDiscord,
  LinkToMedium,
  LinkToTelegram,
  LinkToTwitter,
  LinkToYouTube,
} from './SocialsLinksComponents'
import SvgIcon from '@sb/components/SvgIcon'

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
          {/* <NewLink to="/pools">Liquidity Pools</NewLink>
          <NewLink to="/swaps">Swap</NewLink>
          <NewLink to="/rebalance">Rebalance</NewLink> */}
        </RowContainer>
      </MainContainer>
      <MainContainerForSmallScreens>
        <RowContainer padding="0rem 3rem">
          <SvgIcon
            src={newBannerForSmallScreens}
            width={'100%'}
            height={'auto'}
          />
        </RowContainer>
      </MainContainerForSmallScreens>
    </>
  )
}
