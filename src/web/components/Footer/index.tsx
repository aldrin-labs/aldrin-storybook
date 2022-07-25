import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '@sb/components/Logo'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
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
  ListingButton,
} from './styles'

export const Footer = () => {
  const isMobile = useMobileSize()

  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)

  return (
    <FooterContainer data-testid="footer">
      {!isMobile && (
        <FooterLeft>
          <Logo width="64px" />
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
        <ListingButton
          data-testid="footer-request-listing-btn"
          href="https://github.com/aldrin-exchange/aldrin-registry"
          target="_blank"
        >
          Request Listing
        </ListingButton>{' '}
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
    </FooterContainer>
  )
}
