import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Index from '@sb/components/Logo'
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

import {
  FooterButton,
  FooterContainer,
  MediaContainer,
  Copyright,
  FooterLeft,
} from './styles'

export const Footer = () => {
  const isMobile = useMobileSize()

  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [listingPopupOpen, setListingPopupOpen] = useState(false)

  return (
    <FooterContainer data-testid="footer">
      {!isMobile && (
        <FooterLeft>
          <Index width="70px" />
          <Copyright>Aldrin.com 2021 - ∞</Copyright>
        </FooterLeft>
      )}

      <MediaContainer>
        <LinkToTwitter />
        <LinkToCoinGecko />
        <LinkToCoinMarketcap />
        <LinkToMedium />
        <LinkToTelegram />
        <LinkToDiscord />
      </MediaContainer>
      <Row width="35%" justify="flex-end">
        <FooterButton
          data-testid="footer-request-listing-btn"
          onClick={() => setListingPopupOpen(true)}
        >
          Request Listing
        </FooterButton>{' '}
        <FooterButton
          data-testid="footer-create-pool-btn"
          as={Link}
          to="/pools/create"
        >
          Create Pool
        </FooterButton>
        <FooterButton
          data-testid="footer-feedback-btn"
          onClick={() => setFeedbackPopupOpen(true)}
        >
          Feedback &amp; Support
        </FooterButton>{' '}
      </Row>

      <FeedbackPopup
        data-testid="footer-feedback-popup"
        open={feedbackPopupOpen}
        onClose={() => {
          setFeedbackPopupOpen(false)
        }}
      />
      <ListingRequestPopup
        data-testid="footer-listing-btn"
        open={listingPopupOpen}
        onClose={() => {
          setListingPopupOpen(false)
        }}
      />
    </FooterContainer>
  )
}
