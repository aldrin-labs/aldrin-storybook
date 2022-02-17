import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { WideContent } from '@sb/components/Layout'
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

import { FooterButton, FooterContainer, MediaContainer } from './styles'

export const Footer = () => {
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [listingPopupOpen, setListingPopupOpen] = useState(false)
  return (
    <WideContent>
      <FooterContainer>
        <MediaContainer>
          <LinkToTwitter />
          <LinkToCoinGecko />
          <LinkToCoinMarketcap />
          <LinkToMedium />
          <LinkToTelegram />
          <LinkToDiscord />
        </MediaContainer>
        <Row>
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
    </WideContent>
  )
}
