import React, { useEffect } from 'react'

import { Block, BlockContent } from '@sb/components/Block'
import { Cell, Page, WideContent } from '@sb/components/Layout'

import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import { RootRow } from './components/Charts/styles'
import { TableSwitcher } from './components/Tables/TablesSwitcher'
import { TableSwitcherWrap } from './index.styles'

export const PoolsComponent: React.FC = () => {
  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  return (
    <Page>
      <WideContent>
        {/* <WaningBanner bannerId="calcAccountsCreating">
          Under maintenance, available to claim rewards may not be displayed
          correctly.
        </WaningBanner> */}
        <RootRow>
          <Cell col={12} colLg={6}>
            <TotalVolumeLockedChart />
          </Cell>
          <Cell col={12} colLg={6}>
            <TradingVolumeChart />
          </Cell>
        </RootRow>
        <RootRow>
          <Cell col={12}>
            <Block>
              <BlockContent>
                <TableSwitcherWrap>
                  <TableSwitcher />
                </TableSwitcherWrap>
              </BlockContent>
            </Block>
          </Cell>
        </RootRow>
      </WideContent>
    </Page>
  )
}
