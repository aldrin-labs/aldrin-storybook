import { Cell, Page, WideContent } from '@sb/components/Layout'
import React, { useEffect } from 'react'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import { RootRow } from './components/Charts/styles'
import { TableSwitcher } from './components/Tables/TablesSwitcher'

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
        {/* <Banner theme={theme} /> */}
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
            <TableSwitcher />
          </Cell>
        </RootRow>
      </WideContent>
    </Page>
  )
}
