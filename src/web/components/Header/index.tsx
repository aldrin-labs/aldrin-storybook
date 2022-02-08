import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

import ListingRequestPopup from '@sb/compositions/Chart/components/ListingRequestPopup/ListingRequestPopup'
import { FeedbackPopup } from '@sb/compositions/Chart/components/UsersFeedbackPopup'

import AldrinLogo from '@icons/Aldrin.svg'

// TODO: Refactor popup

import { Body } from '../Layout'
import { DropDown } from './Dropdown'
import {
  HeaderWrap,
  LogoLink,
  LogoBlock,
  WalletContainer,
  Logo,
  NavLink,
  MainLinksWrap,
  MainLinksBlock,
} from './styles'
import { WalletBlock } from './WalletBlock'

export const Header = () => {
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [listingPopupOpen, setListingPopupOpen] = useState(false)

  const { pathname } = useLocation()

  const isTradingActive =
    pathname.includes('/chart') || pathname.includes('/swap')

  const feedbackLinks = (
    <>
      <NavLink as="button" onClick={() => setFeedbackPopupOpen(true)}>
        Feedback &amp; Support
      </NavLink>
      <NavLink as="button" onClick={() => setListingPopupOpen(true)}>
        Request Listing
      </NavLink>
    </>
  )

  return (
    <Body>
      <HeaderWrap>
        <LogoBlock>
          <LogoLink to="/">
            <Logo src={AldrinLogo} />
          </LogoLink>
        </LogoBlock>
        <MainLinksWrap>
          <MainLinksBlock>
            <NavLink to="/chart" activeClassName="selected">
              Trade
            </NavLink>
            <NavLink to="/swap" activeClassName="selected">
              Swap
            </NavLink>
            <NavLink show="md" to="/pools" activeClassName="selected">
              Pools & Farms
            </NavLink>
            <NavLink show="lg" to="/staking" activeClassName="selected">
              Staking
            </NavLink>
            <DropDown hide="lg" text="More">
              {feedbackLinks}
              <NavLink to="/rebalance" activeClassName="selected">
                Rebalancer
              </NavLink>
              <NavLink to="/dashboard" activeClassName="selected">
                Dashboard
              </NavLink>
              <NavLink
                hide="lg"
                as="a"
                target="_blank"
                href="https://github.com/aldrin-exchange/aldrin-sdk"
              >
                SDK
              </NavLink>
              <NavLink
                hide="lg"
                as="a"
                target="_blank"
                href="https://docs.aldrin.com"
              >
                Read Me
              </NavLink>
              <NavLink
                hide="lg"
                as="a"
                target="_blank"
                href="https://rin.aldrin.com/"
              >
                Roadmap
              </NavLink>
              {/* <NavLink
                hide="lg"
                as="a"
                target="_blank"
                href="https://docs.aldrin.com/dex/how-to-get-started-on-aldrin-dex"
              >
                FAQ
              </NavLink>{' '} */}
            </DropDown>
          </MainLinksBlock>
        </MainLinksWrap>
        <WalletContainer>
          <WalletBlock />
        </WalletContainer>
      </HeaderWrap>
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
    </Body>
  )
}
