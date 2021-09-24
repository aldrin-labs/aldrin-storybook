import React from 'react'

import { IProps } from './TradingTabs.types'
import {
  TitleTab,
  TitleTabsGroup,
  StyledTitleTab,
  ExpandTableButton,
  StyledTitleTabForMobile,
} from './TradingTabs.styles'
import SvgIcon from '@sb/components/SvgIcon'

import ExpandTableIcon from '@icons/expandIcon.svg'
import SqueezeTableIcon from '@icons/squeezeIcon.svg'

const TradingTabs = ({
  tab,
  theme,
  handleTabChange,
  updateTerminalViewMode,
  terminalViewMode,
}: IProps) => {
  return (
    <>
      <TitleTabsGroup theme={theme}>
        <StyledTitleTabForMobile
          theme={theme}
          active={tab === 'balances'}
          onClick={() => handleTabChange('balances')}
          style={{ width: '20%' }}
        >
          Balances
        </StyledTitleTabForMobile>
        <TitleTab
          theme={theme}
          active={tab === 'openOrders'}
          onClick={() => handleTabChange('openOrders')}
        >
          Open orders{' '}
        </TitleTab>
        <TitleTab
          theme={theme}
          active={tab === 'tradeHistory'}
          onClick={() => handleTabChange('tradeHistory')}
        >
          Recent Trade history
        </TitleTab>
        <StyledTitleTab
          theme={theme}
          active={tab === 'feeTiers'}
          onClick={() => handleTabChange('feeTiers')}
        >
          Fee Tiers
        </StyledTitleTab>
        <StyledTitleTab
          theme={theme}
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
          theme={theme}
        >
          <SvgIcon
            src={
              terminalViewMode === 'fullScreenTablesMobile'
                ? SqueezeTableIcon
                : ExpandTableIcon
            }
            width={'25%'}
            height={'auto'}
          />
        </ExpandTableButton>
      </TitleTabsGroup>
    </>
  )
}

export default TradingTabs
