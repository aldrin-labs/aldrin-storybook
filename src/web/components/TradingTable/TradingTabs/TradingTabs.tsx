import React from 'react'

import {
  TitleTab,
  TitleTabsGroup,
  StyledTitleTab,
  ExpandTableButton,
  StyledTitleTabForMobile,
} from './TradingTabs.styles'
import { IProps } from './TradingTabs.types'

const TradingTabs = ({
  tab,
  handleTabChange,
  updateTerminalViewMode,
  terminalViewMode,
}: IProps) => {
  return (
    <>
      <TitleTabsGroup>
        <StyledTitleTabForMobile
          active={tab === 'balances'}
          onClick={() => handleTabChange('balances')}
          style={{ width: '20%' }}
        >
          Balances
        </StyledTitleTabForMobile>
        <TitleTab
          active={tab === 'openOrders'}
          onClick={() => handleTabChange('openOrders')}
        >
          Open orders{' '}
        </TitleTab>
        <TitleTab
          active={tab === 'tradeHistory'}
          onClick={() => handleTabChange('tradeHistory')}
        >
          Recent Trade history
        </TitleTab>
        <StyledTitleTab
          active={tab === 'feeTiers'}
          onClick={() => handleTabChange('feeTiers')}
        >
          Fee Tiers
        </StyledTitleTab>
        <StyledTitleTab
          active={tab === 'balances'}
          onClick={() => handleTabChange('balances')}
        >
          Market Balances
        </StyledTitleTab>
        <ExpandTableButton
          onClick={() => {
            if (terminalViewMode === 'default') {
              updateTerminalViewMode('fullScreenTablesMobile')
            } else {
              updateTerminalViewMode('default')
            }
          }}
        >
          {terminalViewMode === 'fullScreenTablesMobile' ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.293 16.949L13.414 14.828L16.586 18L18 16.586L14.828 13.414L16.949 11.293H11.293V16.949ZM6.707 1.051L4.586 3.172L1.414 0L0 1.414L3.172 4.586L1.051 6.707H6.707V1.051ZM11.293 6.707H16.949L14.828 4.586L18 1.414L16.586 0L13.414 3.172L11.293 1.051V6.707ZM6.707 11.293H1.051L3.172 13.414L0 16.586L1.414 18L4.586 14.828L6.707 16.949V11.293Z"
                fill="#F8FAFF"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 12.344L15.879 14.465L12.707 11.293L11.293 12.707L14.465 15.879L12.344 18H18V12.344ZM0 5.656L2.121 3.535L5.293 6.707L6.707 5.293L3.535 2.121L5.656 0H0V5.656ZM18 0H12.344L14.465 2.121L11.293 5.293L12.707 6.707L15.879 3.535L18 5.656V0ZM0 18H5.656L3.535 15.879L6.707 12.707L5.293 11.293L2.121 14.465L0 12.344V18Z"
                fill="#F8FAFF"
              />
            </svg>
          )}
        </ExpandTableButton>
      </TitleTabsGroup>
    </>
  )
}

export default TradingTabs
