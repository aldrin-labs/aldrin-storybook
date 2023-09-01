import React, { useEffect } from 'react'
import { useTheme } from 'styled-components'

import { Block, BlockContent } from '@sb/components/Block'
import { Cell, Page, WideContent } from '@sb/components/Layout'
import { WaningBanner as WarningBanner } from '@sb/components/WaningBanner'

import { RootRow } from './components/Charts/styles'
import { TableSwitcher } from './components/Tables/TablesSwitcher'
import { TableSwitcherWrap } from './index.styles'

export const PoolsComponent: React.FC = () => {
  const theme = useTheme()
  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  return (
    <Page>
      <WideContent>
        <WarningBanner bannerId="underMaintenance">
          Under maintenance, pools info might not be displayed correctly.
        </WarningBanner>
        {/* <RootRow data-testid="pools-charts-row" height="auto">
          <Cell col={12} colLg={6}>
            <TotalVolumeLockedChart data-testid="pools-tvl-chart" />
          </Cell>
          <Cell col={12} colLg={6}>
            <TradingVolumeChart data-testid="pools-volume-chart" />
          </Cell>
        </RootRow> */}
        <RootRow height="auto">
          <Cell col={12}>
            <Block>
              <BlockContent>
                <TableSwitcherWrap>
                  <TableSwitcher theme={theme} />
                </TableSwitcherWrap>
              </BlockContent>
            </Block>
          </Cell>
        </RootRow>
      </WideContent>
    </Page>
  )
}
