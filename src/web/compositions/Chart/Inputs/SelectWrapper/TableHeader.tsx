import React from 'react'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledTab, StyledHeader } from './SelectWrapperStyles'
import { marketsByCategories } from '@core/config/marketsByCategories'

import { ISelectData, SelectTabType } from './SelectWrapper.types'
import { ITheme } from '../../../../types/materialUI'

interface TableHeaderProps {
  theme: ITheme
  tab: SelectTabType
  isAdvancedSelectorMode: boolean
  setSelectorMode: (mode: string) => void
  onTabChange: (tab: SelectTabType) => void
  marketsByTab: { [c: string]: ISelectData }
}

interface TabProps {
  label: string
  theme: ITheme
  tabName: SelectTabType
  activeTab: SelectTabType
  onTabChange: (tab: SelectTabType) => void
  itemsLength: number
}

const Tab: React.FC<TabProps> = (props) => {
  const { theme, tabName, activeTab, onTabChange, itemsLength, label } = props
  return (
    <StyledTab
      theme={theme}
      isSelected={tabName === activeTab}
      onClick={() => onTabChange(tabName)}
    >
      {label}&nbsp;
      <span
        style={{
          color: tabName === activeTab ? '#fbf2f2' : '#96999C',
          marginLeft: '0.5rem',
        }}
      >
        ({itemsLength})
      </span>
    </StyledTab>
  )
}

const TableHeader = (props: TableHeaderProps) => {
  const {
    theme,
    tab,
    marketsByTab,
    isAdvancedSelectorMode,
    onTabChange,
  } = props


  if (!marketsByTab) {
    return null
  }

  const dataWithoutCustomMarkets = marketsByTab['all'].filter((el) => !el.isCustomUserMarket)

  const defaultTabs = [
    { tabName: 'all', label: 'All', size: dataWithoutCustomMarkets.length },
    { tabName: 'favourite', label: 'Favourite', size: marketsByTab['favourite'].length },
    { tabName: 'solanaNative', label: 'Solana Native', size: marketsByTab['solanaNative'].length },
    { tabName: 'usdt', label: 'USDT', size: marketsByTab['usdt'].length },
    { tabName: 'usdc', label: 'USDC', size: marketsByTab['usdc'].length },
    { tabName: 'sol', label: 'SOL', size: marketsByTab['sol'].length },
  ]

  const advancedTabs = isAdvancedSelectorMode ?
    [
      ...Object.entries(marketsByCategories).map(
        // TODO: Check this working properly
        ([category, categoriesData]) => ({ tabName: category, label: categoriesData.name, size: marketsByTab[category].length })
      ),
      { tabName: 'leveraged', label: 'Leveraged tokens', size: marketsByTab['leveraged'].length }

    ] : []

  return (
    <StyledHeader theme={theme} isAdvancedSelectorMode={isAdvancedSelectorMode}>
      {/* <Row
        width="10rem"
        onClick={() => {
          setSelectorMode(isAdvancedSelectorMode ? 'basic' : 'advanced')
        }}
      >
        <SvgIcon
          src={isAdvancedSelectorMode ? SqueezeTableIcon : ExpandTableIcon}
          width={'25%'}
          height={'auto'}
        />
      </Row> */}
      <Row
        width="calc(100%)"
        justify="flex-start"
        padding="0 0 0 1rem"
      // style={{ borderLeft: '.1rem solid #383B45' }}
      >
        {[...defaultTabs, ...advancedTabs].map((t) =>
          <Tab
            theme={theme}
            tabName={t.tabName}
            activeTab={tab}
            onTabChange={onTabChange}
            label={t.label}
            itemsLength={t.size}
            key={`tab_${t.tabName}`}
          />
        )}


        {/* <StyledTab
          theme={theme}
          isSelected={tab === 'topGainers'}
          onClick={() => {
            onTabChange('topGainers')
          }}
        >
          Top Gainers 24h
        </StyledTab>
        <StyledTab
          theme={theme}
          isSelected={tab === 'topLosers'}
          onClick={() => {
            onTabChange('topLosers')
          }}
        >
          Top Losers 24h
        </StyledTab> */}
      </Row>
    </StyledHeader>
  )
}

const MemoizedTableHeader = React.memo(TableHeader)

export { MemoizedTableHeader as TableHeader }
