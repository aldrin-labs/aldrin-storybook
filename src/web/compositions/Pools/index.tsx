import { Theme, withTheme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import TablesSwitcher from './components/Tables/TablesSwitcher/TablesSwitcher'
import { BlockTemplate } from './index.styles'



const Pools = ({ theme }: { theme: Theme }) => {
  const [isWarningPopupOpen, openWarningPopup] = useState(true)

  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  return (
    <RowContainer
      direction={'column'}
      padding={'2rem 13rem'}
      justify={'flex-start'}
      style={{
        background: theme.palette.grey.additional,
      }}
    >
      <RowContainer justify={'space-between'}>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
          style={{ position: 'relative' }}
        >
          <TotalVolumeLockedChart theme={theme} />
        </BlockTemplate>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
          style={{ position: 'relative' }}
        >
          <TradingVolumeChart theme={theme} />
        </BlockTemplate>
      </RowContainer>

      <TablesSwitcher theme={theme} />

      {/* <WarningPopup
        theme={theme}
        open={isWarningPopupOpen}
        onClose={() => openWarningPopup(false)}
        isPoolsPage={true}
      /> */}
    </RowContainer>
  )
}

const Wrapper = compose(withTheme())(Pools)

export { Wrapper as PoolsComponent }
