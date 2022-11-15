import React, { useState } from 'react'

import Logo from '@sb/components/Logo'
import { FeedbackPopup } from '@sb/compositions/Chart/components/UsersFeedbackPopup'

import ListingRequestPopup from '../../compositions/Chart/components/ListingRequestPopup/ListingRequestPopup'
import { CreateSerumMarketModal } from '../CreateSerumMarketModal'
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
  MigrationToolIcon,
} from './MenuIcons'
import { RinBalance } from './RinBalance'
import {
  Wrapper,
  Container,
  WalletContainer,
  NavLink,
  MainLinksWrap,
  MainLinksBlock,
  Left,
  Right,
  ListMarketButton,
} from './styles'
import { ThemeSwitcher } from './ThemeSwitcher'
import { WalletBlock } from './WalletBlock'

export const Header = React.memo(
  ({ setCurrentTheme }: { setCurrentTheme: (a: string) => void }) => {
    const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
    const [listingPopupOpen, setListingPopupOpen] = useState(false)
    const [addMarketModalOpen, setAddMarketModalOpen] = useState(false)

    return (
      <>
        <Wrapper>
          <Container>
            <Left>
              <Logo />
              <RinBalance />
              <MainLinksWrap>
                <MainLinksBlock>
                  <NavLink
                    data-testid="header-link-to-trade"
                    to="/chart"
                    activeClassName="selected"
                  >
                    <TradeIcon />
                    <span>Trade</span>
                  </NavLink>
                  <NavLink
                    data-testid="header-link-to-swap"
                    to="/swap"
                    activeClassName="selected"
                  >
                    <SwapIcon />
                    <span>Swap</span>
                  </NavLink>
                  <NavLink
                    data-testid="header-link-to-pools"
                    to="/pools"
                    activeClassName="selected"
                  >
                    <PoolsIcon />
                    <span>Pools &amp; Farms</span>
                  </NavLink>
                  <NavLink
                    data-testid="header-link-to-staking"
                    to="/staking"
                    activeClassName="selected"
                  >
                    <StakingIcon />
                    <span>Staking</span>
                  </NavLink>
                  <DropDown
                    text={
                      <>
                        <MoreIcon />
                        <span>More</span>
                      </>
                    }
                  >
                    <NavLink
                      $left
                      to="/rebalance"
                      activeClassName="selected-from-dropdown"
                    >
                      <RebalanceIcon />
                      <span>Rebalancer</span>
                    </NavLink>
                    <NavLink
                      $left
                      to="/dashboard"
                      activeClassName="selected-from-dropdown"
                    >
                      <DashboardIcon />
                      <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                      $left
                      as="a"
                      target="_blank"
                      href="https://wallet.aldrin.com"
                    >
                      <WalletIcon />
                      <span>Wallet</span>
                    </NavLink>
                    <NavLink
                      $left
                      as="a"
                      target="_blank"
                      href="https://github.com/aldrin-exchange/aldrin-sdk"
                    >
                      <SDKIcon />
                      <span>SDK</span>
                    </NavLink>
                    <NavLink
                      $left
                      as="a"
                      target="_blank"
                      href="https://docs.aldrin.com"
                    >
                      <ReadmeIcon />
                      <span>Read Me</span>
                    </NavLink>
                    <NavLink
                      $left
                      as="a"
                      target="_blank"
                      href="https://rin.aldrin.com/"
                    >
                      <RoadmapIcon />
                      <span>Roadmap</span>
                    </NavLink>
                    <NavLink
                      $left
                      as="span"
                      onClick={() => setFeedbackPopupOpen(true)}
                    >
                      <SupportIcon />
                      <span>Feedback &amp; Support</span>
                    </NavLink>
                    <NavLink
                      $left
                      as="span"
                      onClick={() => setListingPopupOpen(true)}
                    >
                      <RequestListingIcon />
                      <span>Request Listing</span>
                    </NavLink>
                    <NavLink $left to="/pools/create">
                      <CreatePoolIcon />
                      <span>Create Pool</span>
                    </NavLink>
                    <NavLink $left to="/migrationTool">
                      <MigrationToolIcon />
                      <span>Migration Tool</span>
                    </NavLink>
                  </DropDown>
                </MainLinksBlock>
              </MainLinksWrap>
            </Left>
            <Right>
              <ThemeSwitcher setCurrentTheme={setCurrentTheme} />
              <WalletContainer>
                <WalletBlock />
              </WalletContainer>
              <ListMarketButton onClick={() => setAddMarketModalOpen(true)}>
                🔥 List Market
              </ListMarketButton>
            </Right>
          </Container>
        </Wrapper>
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
        {addMarketModalOpen && (
          <CreateSerumMarketModal onClose={() => setAddMarketModalOpen(true)} />
        )}
      </>
    )
  }
)
