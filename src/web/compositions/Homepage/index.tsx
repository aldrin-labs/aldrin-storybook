import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import newBanner from '@icons/newBanner.png'
import newBannerForSmallScreens from '@icons/newBannerForSmallScreens.png'

import { CCAIProviderURL } from '@sb/dexUtils/utils'
import {
  LinkToDiscord,
  LinkToMedium,
  LinkToTelegram,
  LinkToTwitter,
  LinkToYouTube,
} from './SocialsLinksComponents'
import {
  LinksRow,
  MainContainer,
  NewLink,
  StyledA,
  StyledImg,
  StyledPicture,
} from './styles'

export const Homepage = () => {
  return (
    <>
      <MainContainer direction="column">
        <LinksRow height="15%" padding="5rem 25rem" justify="space-between">
          <LinkToTwitter />
          <LinkToTelegram />
          <LinkToDiscord />
          <LinkToMedium />
          <LinkToYouTube />
        </LinksRow>
        <RowContainer height="70%" padding="0">
          <StyledPicture>
            <source
              srcSet={newBannerForSmallScreens}
              media="(max-width: 600px)"
            />
            <StyledImg srcSet={newBanner} alt="My default image" />
          </StyledPicture>
        </RowContainer>
        <LinksRow height="15%" padding="5rem 25rem" justify="space-between">
          <NewLink to="/chart">Trading</NewLink>
          <StyledA
            href={CCAIProviderURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Wallet
          </StyledA>
          <NewLink to="/analytics">Analytics</NewLink>
          {/* <NewLink to="/pools">Liquidity Pools</NewLink>
          <NewLink to="/swaps">Swap</NewLink>
          <NewLink to="/rebalance">Rebalance</NewLink> */}
        </LinksRow>
      </MainContainer>
    </>
  )
}
