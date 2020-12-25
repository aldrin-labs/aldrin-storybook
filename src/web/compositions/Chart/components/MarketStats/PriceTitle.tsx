import React from 'react'
import { Theme } from '@material-ui/core'

import { PanelCardTitle } from '@sb/compositions/Chart/Chart.styles'

const PriceTitle = ({
  marketType,
  theme,
}: {
  marketType: number
  theme: Theme
}) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    {marketType === 0 && (
      <PanelCardTitle theme={theme} style={{ whiteSpace: 'nowrap' }}>
        Last price
      </PanelCardTitle>
    )}
    {marketType === 1 && (
      <PanelCardTitle
        theme={theme}
        style={{
          whiteSpace: 'nowrap',
          textDecoration: 'underline',
        }}
      >
        Mark price
      </PanelCardTitle>
    )}
  </div>
)

export default React.memo(PriceTitle)
