import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'

import ExpandTableIcon from '@icons/expandIcon.svg'
import SqueezeTableIcon from '@icons/squeezeIcon.svg'

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
          <SvgIcon
            src={
              terminalViewMode === 'fullScreenTablesMobile'
                ? SqueezeTableIcon
                : ExpandTableIcon
            }
            width="25%"
            height="auto"
          />
        </ExpandTableButton>
      </TitleTabsGroup>
    </>
  )
}

export default TradingTabs
