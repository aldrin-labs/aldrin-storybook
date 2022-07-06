import React, { useEffect } from 'react'

import { Page, WideContent } from '@sb/components/Layout'

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
        <RootRow />
      </WideContent>
    </Page>
  )
}
