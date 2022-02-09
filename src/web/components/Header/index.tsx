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
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33333 1.70837H4.95833V6.58337H3.33333V8.20837H2.25V6.58337H0.625V1.70837H2.25V0.083374H3.33333V1.70837ZM1.70833 2.79171V5.50004H3.875V2.79171H1.70833ZM8.75 4.41671H10.375V9.29171H8.75V10.9167H7.66667V9.29171H6.04167V4.41671H7.66667V2.79171H8.75V4.41671ZM7.125 5.50004V8.20837H9.29167V5.50004H7.125Z"
                  fill="#C1C1C1"
                />
              </svg>
              Trade
            </NavLink>
            <NavLink to="/swap" activeClassName="selected">
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.47285 3.30625L4.70693 4.07217L3.33327 2.6985V9.83333H2.24993V2.6985L0.87681 4.07217L0.110352 3.30625L2.7916 0.625L5.47285 3.30625ZM10.8895 7.69375L8.20827 10.375L5.52702 7.69375L6.29293 6.92783L7.66714 8.3015L7.6666 1.16667H8.74994V8.3015L10.1236 6.92783L10.8895 7.69375Z"
                  fill="#C1C1C1"
                />
              </svg>
              Swap
            </NavLink>
            <NavLink to="/pools" activeClassName="selected">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.00008 10.6667C7.23776 10.6667 8.42474 10.1751 9.29991 9.29991C10.1751 8.42474 10.6667 7.23776 10.6667 6.00008C10.6667 4.7624 10.1751 3.57542 9.29991 2.70025C8.42474 1.82508 7.23776 1.33341 6.00008 1.33341C4.7624 1.33341 3.57542 1.82508 2.70025 2.70025C1.82508 3.57542 1.33341 4.7624 1.33341 6.00008C1.33341 7.23776 1.82508 8.42474 2.70025 9.29991C3.57542 10.1751 4.7624 10.6667 6.00008 10.6667ZM6.00008 11.8334C2.77833 11.8334 0.166748 9.22183 0.166748 6.00008C0.166748 2.77833 2.77833 0.166748 6.00008 0.166748C9.22183 0.166748 11.8334 2.77833 11.8334 6.00008C11.8334 9.22183 9.22183 11.8334 6.00008 11.8334ZM6.00008 8.33342C6.61892 8.33342 7.21241 8.08758 7.65 7.65C8.08758 7.21241 8.33342 6.61892 8.33342 6.00008C8.33342 5.38124 8.08758 4.78775 7.65 4.35017C7.21241 3.91258 6.61892 3.66675 6.00008 3.66675C5.38124 3.66675 4.78775 3.91258 4.35017 4.35017C3.91258 4.78775 3.66675 5.38124 3.66675 6.00008C3.66675 6.61892 3.91258 7.21241 4.35017 7.65C4.78775 8.08758 5.38124 8.33342 6.00008 8.33342ZM6.00008 9.50008C5.07182 9.50008 4.18159 9.13133 3.52521 8.47496C2.86883 7.81858 2.50008 6.92834 2.50008 6.00008C2.50008 5.07182 2.86883 4.18159 3.52521 3.52521C4.18159 2.86883 5.07182 2.50008 6.00008 2.50008C6.92834 2.50008 7.81858 2.86883 8.47496 3.52521C9.13133 4.18159 9.50008 5.07182 9.50008 6.00008C9.50008 6.92834 9.13133 7.81858 8.47496 8.47496C7.81858 9.13133 6.92834 9.50008 6.00008 9.50008ZM6.00008 7.16675C5.69066 7.16675 5.39392 7.04383 5.17512 6.82504C4.95633 6.60625 4.83342 6.3095 4.83342 6.00008C4.83342 5.69066 4.95633 5.39392 5.17512 5.17512C5.39392 4.95633 5.69066 4.83342 6.00008 4.83342C6.3095 4.83342 6.60625 4.95633 6.82504 5.17512C7.04383 5.39392 7.16675 5.69066 7.16675 6.00008C7.16675 6.3095 7.04383 6.60625 6.82504 6.82504C6.60625 7.04383 6.3095 7.16675 6.00008 7.16675Z"
                  fill="#C1C1C1"
                />
              </svg>
              Pools & Farms
            </NavLink>
            <NavLink to="/staking" activeClassName="selected">
              <svg
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.7151 8.86669L11.4162 9.28727C11.4595 9.31317 11.4953 9.34983 11.5202 9.39369C11.545 9.43755 11.5581 9.48711 11.5581 9.53752C11.5581 9.58794 11.545 9.63749 11.5202 9.68135C11.4953 9.72521 11.4595 9.76187 11.4162 9.78777L6.30041 12.8573C6.20969 12.9118 6.10584 12.9406 6 12.9406C5.89416 12.9406 5.79031 12.9118 5.69958 12.8573L0.583747 9.78777C0.54049 9.76187 0.504685 9.72521 0.479824 9.68135C0.454963 9.63749 0.441895 9.58794 0.441895 9.53752C0.441895 9.48711 0.454963 9.43755 0.479824 9.39369C0.504685 9.34983 0.54049 9.31317 0.583747 9.28727L1.28491 8.86669L6 11.6959L10.7151 8.86669ZM10.7151 6.12502L11.4162 6.5456C11.4595 6.5715 11.4953 6.60817 11.5202 6.65202C11.545 6.69588 11.5581 6.74544 11.5581 6.79585C11.5581 6.84627 11.545 6.89582 11.5202 6.93968C11.4953 6.98354 11.4595 7.02021 11.4162 7.0461L6 10.2959L0.583747 7.0461C0.54049 7.02021 0.504685 6.98354 0.479824 6.93968C0.454963 6.89582 0.441895 6.84627 0.441895 6.79585C0.441895 6.74544 0.454963 6.69588 0.479824 6.65202C0.504685 6.60817 0.54049 6.5715 0.583747 6.5456L1.28491 6.12502L6 8.95419L10.7151 6.12502ZM6.29983 0.763604L11.4162 3.8331C11.4595 3.859 11.4953 3.89567 11.5202 3.93952C11.545 3.98338 11.5581 4.03294 11.5581 4.08335C11.5581 4.13377 11.545 4.18332 11.5202 4.22718C11.4953 4.27104 11.4595 4.30771 11.4162 4.3336L6 7.58335L0.583747 4.3336C0.54049 4.30771 0.504685 4.27104 0.479824 4.22718C0.454963 4.18332 0.441895 4.13377 0.441895 4.08335C0.441895 4.03294 0.454963 3.98338 0.479824 3.93952C0.504685 3.89567 0.54049 3.859 0.583747 3.8331L5.69958 0.763604C5.79031 0.709095 5.89416 0.680298 6 0.680298C6.10584 0.680298 6.20969 0.709095 6.30041 0.763604H6.29983ZM6 1.94369L2.43408 4.08335L6 6.22302L9.56591 4.08335L6 1.94369Z"
                  fill="#C1C1C1"
                />
              </svg>
              Staking
            </NavLink>
            <DropDown
              text={
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4524 6.5001C11.4524 5.98939 11.0345 5.57153 10.5238 5.57153C10.0131 5.57153 9.59525 5.98939 9.59525 6.5001C9.59525 7.01082 10.0131 7.42868 10.5238 7.42868C11.0345 7.42868 11.4524 7.01082 11.4524 6.5001ZM3.40477 6.5001C3.40477 5.98939 2.98692 5.57153 2.4762 5.57153C1.96549 5.57153 1.54763 5.98939 1.54763 6.5001C1.54763 7.01082 1.96549 7.42868 2.4762 7.42868C2.98692 7.42868 3.40477 7.01082 3.40477 6.5001ZM7.42858 6.5001C7.42858 5.98939 7.01073 5.57153 6.50001 5.57153C5.9893 5.57153 5.57144 5.98939 5.57144 6.5001C5.57144 7.01082 5.9893 7.42868 6.50001 7.42868C7.01073 7.42868 7.42858 7.01082 7.42858 6.5001Z"
                      fill="#C1C1C1"
                    />
                    <path
                      d="M6.5001 1.54773C5.98939 1.54773 5.57153 1.96559 5.57153 2.4763C5.57153 2.98702 5.98939 3.40487 6.5001 3.40487C7.01082 3.40487 7.42868 2.98702 7.42868 2.4763C7.42868 1.96559 7.01082 1.54773 6.5001 1.54773ZM6.5001 9.59535C5.98939 9.59535 5.57153 10.0132 5.57153 10.5239C5.57153 11.0346 5.98939 11.4525 6.5001 11.4525C7.01082 11.4525 7.42868 11.0346 7.42868 10.5239C7.42868 10.0132 7.01082 9.59535 6.5001 9.59535ZM6.5001 5.57154C5.98939 5.57154 5.57153 5.9894 5.57153 6.50011C5.57153 7.01082 5.98939 7.42868 6.5001 7.42868C7.01082 7.42868 7.42868 7.01082 7.42868 6.50011C7.42868 5.9894 7.01082 5.57154 6.5001 5.57154Z"
                      fill="#C1C1C1"
                    />
                  </svg>
                  More
                </>
              }
            >
              {/* {feedbackLinks} */}
              <NavLink
                left
                to="/rebalance"
                activeClassName="selected-from-dropdown"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.49066 0.381226C3.61241 0.381226 4.55498 1.14845 4.82222 2.18678H9.71288V3.39049H4.82222C4.55498 4.42882 3.61241 5.19604 2.49066 5.19604C1.16109 5.19604 0.083252 4.11821 0.083252 2.78863C0.083252 1.45906 1.16109 0.381226 2.49066 0.381226ZM2.49066 3.99234C3.15545 3.99234 3.69436 3.45342 3.69436 2.78863C3.69436 2.12385 3.15545 1.58493 2.49066 1.58493C1.82587 1.58493 1.28696 2.12385 1.28696 2.78863C1.28696 3.45342 1.82587 3.99234 2.49066 3.99234Z"
                    fill="#C1C1C1"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.50918 10.6127C7.38742 10.6127 6.44486 9.84548 6.17761 8.80715H1.28696V7.60345H6.17761C6.44486 6.56512 7.38742 5.79789 8.50918 5.79789C9.83875 5.79789 10.9166 6.87573 10.9166 8.2053C10.9166 9.53487 9.83875 10.6127 8.50918 10.6127ZM8.50918 9.409C9.17397 9.409 9.71288 8.87009 9.71288 8.2053C9.71288 7.54051 9.17397 7.0016 8.50918 7.0016C7.84439 7.0016 7.30547 7.54051 7.30547 8.2053C7.30547 8.87009 7.84439 9.409 8.50918 9.409Z"
                    fill="#C1C1C1"
                  />
                </svg>
                Rebalancer
              </NavLink>
              <NavLink
                left
                to="/dashboard"
                activeClassName="selected-from-dropdown"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.083252 6.04167H3.33325V10.375H0.083252V6.04167ZM7.66659 3.33333H10.9166V10.375H7.66659V3.33333ZM3.87492 0.625H7.12492V10.375H3.87492V0.625ZM1.16659 7.125V9.29167H2.24992V7.125H1.16659ZM4.95825 1.70833V9.29167H6.04159V1.70833H4.95825ZM8.74992 4.41667V9.29167H9.83325V4.41667H8.74992Z"
                    fill="#C1C1C1"
                  />
                </svg>
                Dashboard
              </NavLink>
              <NavLink
                left
                as="a"
                target="_blank"
                href="https://github.com/aldrin-exchange/aldrin-sdk"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.49992 10.9166C2.50829 10.9166 0.083252 8.4916 0.083252 5.49998C0.083252 2.50835 2.50829 0.083313 5.49992 0.083313C8.49154 0.083313 10.9166 2.50835 10.9166 5.49998C10.9166 8.4916 8.49154 10.9166 5.49992 10.9166ZM5.49992 9.83331C6.64919 9.83331 7.75139 9.37677 8.56405 8.56411C9.37671 7.75145 9.83325 6.64925 9.83325 5.49998C9.83325 4.35071 9.37671 3.24851 8.56405 2.43585C7.75139 1.62319 6.64919 1.16665 5.49992 1.16665C4.35065 1.16665 3.24845 1.62319 2.43579 2.43585C1.62313 3.24851 1.16659 4.35071 1.16659 5.49998C1.16659 6.64925 1.62313 7.75145 2.43579 8.56411C3.24845 9.37677 4.35065 9.83331 5.49992 9.83331ZM6.04159 4.95831H7.66659L4.95825 8.74998V6.04165H3.33325L6.04159 2.24998V4.95831Z"
                    fill="#C1C1C1"
                  />
                </svg>
                SDK
              </NavLink>
              <NavLink
                left
                as="a"
                target="_blank"
                href="https://docs.aldrin.com"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.49992 10.9166C2.50829 10.9166 0.083252 8.4916 0.083252 5.49998C0.083252 2.50835 2.50829 0.083313 5.49992 0.083313C8.49154 0.083313 10.9166 2.50835 10.9166 5.49998C10.9166 8.4916 8.49154 10.9166 5.49992 10.9166ZM5.49992 9.83331C6.64919 9.83331 7.75139 9.37677 8.56405 8.56411C9.37671 7.75145 9.83325 6.64925 9.83325 5.49998C9.83325 4.35071 9.37671 3.24851 8.56405 2.43585C7.75139 1.62319 6.64919 1.16665 5.49992 1.16665C4.35065 1.16665 3.24845 1.62319 2.43579 2.43585C1.62313 3.24851 1.16659 4.35071 1.16659 5.49998C1.16659 6.64925 1.62313 7.75145 2.43579 8.56411C3.24845 9.37677 4.35065 9.83331 5.49992 9.83331ZM4.95825 2.79165H6.04159V3.87498H4.95825V2.79165ZM4.95825 4.95831H6.04159V8.20831H4.95825V4.95831Z"
                    fill="#C1C1C1"
                  />
                </svg>
                Read Me
              </NavLink>
              <NavLink
                left
                as="a"
                target="_blank"
                href="https://rin.aldrin.com/"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.49992 10.9167C2.50829 10.9167 0.083252 8.49167 0.083252 5.50004C0.083252 2.50842 2.50829 0.083374 5.49992 0.083374C8.49154 0.083374 10.9166 2.50842 10.9166 5.50004C10.9166 8.49167 8.49154 10.9167 5.49992 10.9167ZM5.49992 9.83337C6.64919 9.83337 7.75139 9.37683 8.56405 8.56417C9.37671 7.75151 9.83325 6.64931 9.83325 5.50004C9.83325 4.35077 9.37671 3.24857 8.56405 2.43591C7.75139 1.62325 6.64919 1.16671 5.49992 1.16671C4.35065 1.16671 3.24845 1.62325 2.43579 2.43591C1.62313 3.24857 1.16659 4.35077 1.16659 5.50004C1.16659 6.64931 1.62313 7.75151 2.43579 8.56417C3.24845 9.37683 4.35065 9.83337 5.49992 9.83337ZM7.39575 3.60421L6.31242 6.31254L3.60409 7.39587L4.68742 4.68754L7.39575 3.60421Z"
                    fill="#C1C1C1"
                  />
                </svg>
                Roadmap
              </NavLink>
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
