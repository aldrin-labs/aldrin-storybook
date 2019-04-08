import React from 'react'
import { IProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'
import { withTheme } from '@material-ui/styles'

const TradingTabs = ({
  tabIndex,
  handleTabChange,
  theme: {
    palette: {
      text: { primary },
    },
  },
}: IProps) => (
  <div>
    <TitleTabsGroup
      value={tabIndex}
      onChange={handleTabChange}
      indicatorColor="secondary"
      textColor="primary"
    >
      <TitleTab label="Open orders" primary={primary} />
      <TitleTab label="Order history" primary={primary} />
      <TitleTab label="Trade history" primary={primary} />
      {/*<TitleTab label="Funds" primary={primary} />*/}
    </TitleTabsGroup>
  </div>
)

export default withTheme()(TradingTabs)
