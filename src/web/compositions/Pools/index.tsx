import { Theme, withTheme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import TablesSwitcher from './components/Tables/TablesSwitcher/TablesSwitcher'
import { withRegionCheck } from '@core/hoc/withRegionCheck'
import { Page, Content, Row, Cell, WideContent } from '@sb/components/Layout'
import { RootRow } from './components/Charts/styles'
import { FarmingConditionsUpdateBanner } from './components/Popups/FarmingConditionsUpdateBanner'

const Pools = ({ theme }: { theme: Theme }) => {
  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  return (
    <Page>
      <WideContent>
        <FarmingConditionsUpdateBanner theme={theme} />
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
            <TablesSwitcher theme={theme} />
          </Cell>
        </RootRow>
      </WideContent>
    </Page>
  )
}

const Wrapper = compose(withTheme(), withRegionCheck)(Pools)

export { Wrapper as PoolsComponent }
