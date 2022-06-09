import React, { useState } from 'react'
// TODO: Refactor popup

import ListingRequestPopup from '../../compositions/Chart/components/ListingRequestPopup/ListingRequestPopup'
import { FeedbackPopup } from '../../compositions/Chart/components/UsersFeedbackPopup'
import { Body } from '../Layout'
import { DropDown } from './Dropdown'
import {
  PoolsIcon,
  SwapIcon,
  TradeIcon,
  StakingIcon,
  RebalanceIcon,
  DashboardIcon,
  WalletIcon,
  SDKIcon,
  ReadmeIcon,
  RoadmapIcon,
  SupportIcon,
  RequestListingIcon,
  CreatePoolIcon,
  MoreIcon,
  AldrinLogo,
} from './MenuIcons'
import { RewardsBlock } from './RewardsBlock/RewardsBlock'
import {
  HeaderWrap,
  LogoLink,
  LogoBlock,
  WalletContainer,
  NavLink,
  MainLinksWrap,
  MainLinksBlock,
  Wrap,
} from './styles'
import { ThemeSwitcher } from './ThemeSwitcher'
import { WalletBlock } from './WalletBlock'

export const Header = ({
  currentTheme,
  setCurrentTheme,
}: {
  currentTheme: string
  setCurrentTheme: (a: string) => void
}) => {
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [listingPopupOpen, setListingPopupOpen] = useState(false)
  return (
    <Body>
      <Wrap>
        <HeaderWrap>
          <LogoBlock>
            <LogoLink to="/">
              <AldrinLogo />
            </LogoLink>
          </LogoBlock>
          <MainLinksWrap>
            <MainLinksBlock>
              <NavLink to="/chart" activeClassName="selected">
                <TradeIcon />
                Trade
              </NavLink>
              <NavLink to="/swap" activeClassName="selected">
                <SwapIcon />
                Swap
              </NavLink>
              <NavLink to="/pools" activeClassName="selected">
                <PoolsIcon />
                Pools &amp; Farms
              </NavLink>
              <NavLink to="/staking" activeClassName="selected">
                <StakingIcon />
                Staking
              </NavLink>
              <DropDown
                text={
                  <>
                    <MoreIcon />
                    More
                  </>
                }
              >
                <NavLink
                  left
                  to="/rebalance"
                  activeClassName="selected-from-dropdown"
                >
                  <RebalanceIcon />
                  Rebalancer
                </NavLink>
                <NavLink
                  left
                  to="/dashboard"
                  activeClassName="selected-from-dropdown"
                >
                  <DashboardIcon />
                  Dashboard
                </NavLink>

                <NavLink
                  left
                  as="a"
                  target="_blank"
                  href="https://wallet.aldrin.com"
                >
                  <WalletIcon />
                  Wallet
                </NavLink>
                <NavLink
                  left
                  as="a"
                  target="_blank"
                  href="https://github.com/aldrin-exchange/aldrin-sdk"
                >
                  <SDKIcon />
                  SDK
                </NavLink>
                <NavLink
                  left
                  as="a"
                  target="_blank"
                  href="https://docs.aldrin.com"
                >
                  <ReadmeIcon />
                  Read Me
                </NavLink>
                <NavLink
                  left
                  as="a"
                  target="_blank"
                  href="https://rin.aldrin.com/"
                >
                  <RoadmapIcon />
                  Roadmap
                </NavLink>
                <NavLink
                  left
                  as="span"
                  onClick={() => setFeedbackPopupOpen(true)}
                >
                  <SupportIcon />
                  Feedback &amp; Support
                </NavLink>
                <NavLink
                  left
                  as="span"
                  onClick={() => setListingPopupOpen(true)}
                >
                  <RequestListingIcon />
                  Request Listing
                </NavLink>
                <NavLink left to="/pools/create">
                  <CreatePoolIcon />
                  Create Pool
                </NavLink>
              </DropDown>
            </MainLinksBlock>
          </MainLinksWrap>
          <ThemeSwitcher
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
          <WalletContainer>
            <RewardsBlock />
            <WalletBlock />
          </WalletContainer>
        </HeaderWrap>
      </Wrap>
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
