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
  NotifyButton,
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
            <RewardsBlock />
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
          <NotifyButton>
            <svg
              width="14"
              height="15"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.2503 12.0505C13.6899 11.4515 12.6408 10.5506 12.6408 7.59961C12.6418 6.54061 12.2715 5.51438 11.5936 4.69747C10.9157 3.88056 9.97258 3.32406 8.92652 3.12371V2.52269C8.92652 2.40147 8.9025 2.28143 8.85584 2.16944C8.80917 2.05745 8.74078 1.95569 8.65455 1.86997C8.56832 1.78426 8.46596 1.71626 8.3533 1.66987C8.24064 1.62349 8.11989 1.59961 7.99795 1.59961C7.87601 1.59961 7.75526 1.62349 7.64261 1.66987C7.52995 1.71626 7.42758 1.78426 7.34136 1.86997C7.25513 1.95569 7.18673 2.05745 7.14007 2.16944C7.0934 2.28143 7.06938 2.40147 7.06938 2.52269V3.12371C6.02333 3.32406 5.08022 3.88056 4.40232 4.69747C3.72442 5.51438 3.35411 6.54061 3.35511 7.59961C3.35511 10.5506 2.30604 11.4515 1.7456 12.0505C1.58574 12.22 1.49779 12.4442 1.50004 12.6765C1.50015 12.798 1.52434 12.9182 1.57122 13.0303C1.61811 13.1424 1.68677 13.2443 1.77328 13.33C1.85979 13.4158 1.96245 13.4837 2.07539 13.5299C2.18834 13.5762 2.30935 13.5999 2.4315 13.5996H13.5685C13.6907 13.5999 13.8117 13.5762 13.9246 13.5299C14.0376 13.4837 14.1402 13.4158 14.2268 13.33C14.3133 13.2443 14.3819 13.1424 14.4288 13.0303C14.4757 12.9182 14.4999 12.798 14.5 12.6765C14.5011 12.4436 14.4117 12.2193 14.2503 12.0505Z"
                stroke="#5B5A72"
                strokeWidth="2"
              />
              <path
                d="M7 2.09961H9V3.09961L8.5 3.64961H8H7.5L7 3.09961V2.09961Z"
                fill="#5B5A72"
              />
              <path
                d="M10 15C10 15.5304 9.78929 16.0391 9.41421 16.4142C9.03914 16.7893 8.53043 17 8 17C7.46957 17 6.96086 16.7893 6.58579 16.4142C6.21071 16.0391 6 15.5304 6 15L8 15H10Z"
                fill="#5B5A72"
              />
            </svg>
          </NotifyButton>
          <WalletContainer>
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
