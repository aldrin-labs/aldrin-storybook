import React, { useEffect } from 'react'

import { Page, WideContent } from '@sb/components/Layout'

import { Switcher } from './components/TablesSwitcher'
import { RootRow } from './index.styles'

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
        <RootRow>
          <Switcher />
        </RootRow>
      </WideContent>
    </Page>
  )
}
