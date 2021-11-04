import { Theme, withTheme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import TablesSwitcher from './components/Tables/TablesSwitcher/TablesSwitcher'
import { BlockTemplate } from './index.styles'
import { withRegionCheck } from '@core/hoc/withRegionCheck'
import { Page, Content, Row, Cell, WideContent } from '@sb/components/Layout'
import { RootRow } from './components/Charts/styles'


const Pools = ({ theme }: { theme: Theme }) => {
  const [isWarningPopupOpen, openWarningPopup] = useState(true)

  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  return (
    <Page>
      <WideContent>
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

const Wrapper = compose(
  withTheme(),
  withRegionCheck,
)(Pools)

export { Wrapper as PoolsComponent }
