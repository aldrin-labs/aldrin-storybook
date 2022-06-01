import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import ListingRequestPopup from '@sb/compositions/Chart/components/ListingRequestPopup/ListingRequestPopup'
import { FeedbackPopup } from '@sb/compositions/Chart/components/UsersFeedbackPopup'
import {
  LinkToCoinGecko,
  LinkToCoinMarketcap,
  LinkToDiscord,
  LinkToMedium,
  LinkToTelegram,
  LinkToTwitter,
} from '@sb/compositions/Homepage/SocialsLinksComponents'

import { AldrinLogo } from '../Header/MenuIcons'
import { Column } from '../Layout'
import { InlineText } from '../Typography'
import { FooterButton, FooterContainer, MediaContainer } from './styles'

export const Footer = () => {
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [listingPopupOpen, setListingPopupOpen] = useState(false)
  return (
    <FooterContainer>
      <Column>
        <AldrinLogo width="60px" />
        <InlineText size="lg">Aldrin.com 2021 - ∞</InlineText>
      </Column>
      <MediaContainer>
        <LinkToTwitter />
        <LinkToCoinGecko />
        <LinkToCoinMarketcap />
        <LinkToMedium />
        <LinkToTelegram />
        <LinkToDiscord />
      </MediaContainer>
      <Row justify="flex-end">
        <FooterButton onClick={() => setListingPopupOpen(true)}>
          Request Listing
        </FooterButton>{' '}
        <FooterButton as={Link} to="/pools/create">
          Create Pool
        </FooterButton>
        <FooterButton onClick={() => setFeedbackPopupOpen(true)}>
          Feedback &amp; Support
        </FooterButton>{' '}
      </Row>
      <FeedbackPopup
        open={feedbackPopupOpen}
        onClose={() => {
          setFeedbackPopupOpen(false)
        }}
      />
      <ListingRequestPopup
        open={listingPopupOpen}
        onClose={() => {
          setListingPopupOpen(false)
        }}
      />
    </FooterContainer>
  )
}
