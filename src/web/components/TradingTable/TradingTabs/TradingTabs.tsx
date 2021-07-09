import React, { useState } from 'react'

import { IProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import SvgIcon from '@sb/components/SvgIcon'
import FullScreen from '@icons/fullscreen.svg'
import { SmartTradeButton } from '@sb/components/TraidingTerminal/styles'

const TradingTabs = ({
  tab,
  theme,
  handleTabChange,
  terminalViewMode,
  isSmartOrderMode,
  isFullScreenTablesMode,
  isDefaultTerminalViewMode,
  isDefaultOnlyTablesMode,
  updateTerminalViewMode,
}: IProps) => {
  const [modeBeforeExpand, saveModeBeforeExpand] = useState('')

  // const activeTradesLength = getActiveStrategies.strategies.filter(
  //   (a) =>
  //     a !== null &&
  //     (a.enabled ||
  //       (a.conditions.isTemplate && a.conditions.templateStatus !== 'disabled'))
  // ).length

  return (
    <>
      <TitleTabsGroup theme={theme}>
        {isDefaultOnlyTablesMode || isFullScreenTablesMode ? (
          <TitleTab
            onClick={() => {
              if (!modeBeforeExpand) {
                saveModeBeforeExpand(terminalViewMode)
              }

              // depend which state should be after click
              switch (true) {
                case isDefaultOnlyTablesMode: {
                  updateTerminalViewMode('fullScreenTables')
                  break
                }
                case isFullScreenTablesMode: {
                  updateTerminalViewMode(modeBeforeExpand)
                  saveModeBeforeExpand('')
                  break
                }
                default: {
                }
              }
            }}
            style={{ width: '8rem', padding: 0 }}
            theme={theme}
          >
            <SvgIcon src={FullScreen} width="2rem" height="2rem" />
          </TitleTab>
        ) : null}
        {isDefaultOnlyTablesMode || isFullScreenTablesMode ? (
          <DarkTooltip
            title={'Watch and manage your active Smart trades from here.'}
          >
            <TitleTab
              data-tut={'smart-trades'}
              theme={theme}
              active={tab === 'activeTrades'}
              onClick={() => handleTabChange('activeTrades')}
              style={{ width: '50%' }}
            >
              Smart trades{' '}
              {/* {activeTradesLength > 0
                ? `(
          ${activeTradesLength}
          )`
                : ''} */}
            </TitleTab>
          </DarkTooltip>
        ) : null}
        {isDefaultOnlyTablesMode || isFullScreenTablesMode ? (
          <TitleTab
            theme={theme}
            active={tab === 'strategiesHistory'}
            onClick={() => handleTabChange('strategiesHistory')}
            style={{ width: '50%' }}
          >
            Smart Trades History
          </TitleTab>
        ) : null}
        {isDefaultTerminalViewMode && (
          <>
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
            <TitleTab
              theme={theme}
              active={tab === 'feeTiers'}
              onClick={() => handleTabChange('feeTiers')}
            >
              Fee Tiers
            </TitleTab>
            <TitleTab
              theme={theme}
              active={tab === 'balances'}
              onClick={() => handleTabChange('balances')}
            >
              Market Balances
            </TitleTab>
          </>
        )}
        {!isSmartOrderMode && (
          <SmartTradeButton
            data-tut={'createSM'}
            style={{
              height: '3rem',
              width: '30rem',
              color: theme?.palette.white.main,
              backgroundColor: '#157E23',
              borderRadius: 0,
              boxShadow: '0px 0px 0.5rem #74787E',
            }}
            onClick={() => {
              updateTerminalViewMode('smartOrderMode')
            }}
          >
            Create Smart Trade
          </SmartTradeButton>
        )}
      </TitleTabsGroup>
    </>
  )
}

export default TradingTabs
