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

import { Button } from '../Button'
import { FooterContainer, MediaContainer } from './styles'

export const Footer = () => {
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [listingPopupOpen, setListingPopupOpen] = useState(false)
  return (
    <FooterContainer style={{ height: '8rem' }}>
      <MediaContainer>
        <LinkToTwitter />
        <LinkToCoinGecko />
        <LinkToCoinMarketcap />
        <LinkToMedium />
        <LinkToTelegram />
        <LinkToDiscord />
      </MediaContainer>
      <Row>
        <Button onClick={() => setListingPopupOpen(true)} $variant="footer">
          Request Listing
        </Button>{' '}
        <Link to="/pools/create">
          <Button $variant="footer">Create Pool</Button>{' '}
        </Link>
        <Button onClick={() => setFeedbackPopupOpen(true)} $variant="footer">
          Feedback & Support
        </Button>{' '}
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
