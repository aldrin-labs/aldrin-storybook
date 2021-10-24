import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AldrinLogo from '@icons/Aldrin.svg'
import StakeBtn from '@icons/stakeBtn.png'
import { Button } from '../Button'

import { Body } from '../Layout'
import {
  HeaderWrap,
  LogoLink,
  LinksBlock,
  LogoBlock,
  WalletBlock,
  Logo,
  NavLink,
  MainLinksBlock,
} from './styles'
// TODO: Refactor popup
import { FeedbackPopup } from '@sb/compositions/Chart/components/UsersFeedbackPopup'
import ListingRequestPopup from '@sb/compositions/Chart/components/ListingRequestPopup/ListingRequestPopup'

import { DropDown } from './Dropdown'


export const Header = () => {

  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [listingPopupOpen, setListingPopupOpen] = useState(false)

  return (
    <Body>
      <HeaderWrap>
        <LogoBlock>
          <LogoLink to={'/'}>
            <Logo src={AldrinLogo} />
          </LogoLink>
          <Button
            backgroundImage={StakeBtn}
            as={Link}
            to="/staking"
            fontSize="xs"
            padding="md"
            borderRadius="xxl"
          >
            Stake RIN
          </Button>
        </LogoBlock>
        <LinksBlock>
          <NavLink
            as="button"
            onClick={() => setFeedbackPopupOpen(true)}
          >
            Feedback &amp; Support
          </NavLink>
          <NavLink
            as="button"
            onClick={() => setListingPopupOpen(true)}
          >
            Request Listing
          </NavLink>
        </LinksBlock>
        <MainLinksBlock>
          <DropDown text="Trading">
            <NavLink to="/chart">Chart</NavLink>
            <NavLink to="/swaps">Swap</NavLink>
          </DropDown>
          <NavLink to="/rebalance">Rebalance</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink as="a" target="_blank" href="https://wallet.aldrin.com/">Wallet</NavLink>
          <NavLink to="/pools">Liquidity Pools</NavLink>
          <NavLink as="a" target="_blank" href="https://rin.aldrin.com/">Token</NavLink>
        </MainLinksBlock>
        <WalletBlock>Wallet</WalletBlock>
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