import React, { useMemo, useCallback } from 'react'

import { SvgIcon } from '@sb/components'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'


import ExpandTableIcon from '@icons/expandIcon.svg'
import SqueezeTableIcon from '@icons/squeezeIcon.svg'

import { ISelectData, SelectTabType } from './SelectWrapper.types'
import { filterSelectorDataByTab } from './SelectWrapper.utils'
import { StyledTab, StyledHeader } from './SelectWrapperStyles'

const TableHeader = ({
  tab,
  data,
  tokenMap,
  favouriteMarkets,
  isAdvancedSelectorMode,
  setSelectorMode,
  onTabChange,
  allMarketsMap,
}: {
  tab: SelectTabType
  data: ISelectData
  isAdvancedSelectorMode: boolean
  allMarketsMap: Map<string, any>
  tokenMap: Map<string, any>
  favouriteMarkets: string[]
  setSelectorMode: (mode: string) => void
  onTabChange: (tab: string) => void
}) => {
  const filterSelectorDataForTab = useCallback(
    (tab) => {
      return filterSelectorDataByTab({
        tab,
        data,
        allMarketsMap,
        favouriteMarkets,
        tokenMap,
      })
    },
    [data, allMarketsMap, favouriteMarkets, tokenMap]
  )

  const dataWithoutCustomMarkets = useMemo(
    () => data.filter((el) => !el.isCustomUserMarket),
    [data]
  )

  return (
    <StyledHeader isAdvancedSelectorMode={isAdvancedSelectorMode}>
      <Row
        width="6rem"
        onClick={() => {
          setSelectorMode(isAdvancedSelectorMode ? 'basic' : 'advanced')
        }}
      >
        <SvgIcon
          src={isAdvancedSelectorMode ? SqueezeTableIcon : ExpandTableIcon}
          width="35%"
          height="auto"
        />
      </Row>
      <Row
        width="calc(100%)"
        justify="flex-start"
        padding="0 0 0 1rem"
        // style={{ borderLeft: '.1rem solid #383B45' }}
      >
        <StyledTab
          isSelected={tab === 'live'}
          onClick={() => onTabChange('live')}
        >
          Live{' '}
          <span
            style={{
              color: tab === 'live' ? '#fbf2f2' : '#96999C',
            }}
          >
            {/* {`(${dataWithoutCustomMarkets.length})`} */}
          </span>
        </StyledTab>
        <StyledTab
          isSelected={tab === 'deprecated'}
          onClick={() => onTabChange('deprecated')}
        >
          Deprecated{' '}
          <span
            style={{
              color: tab === 'deprecated' ? '#fbf2f2' : '#96999C',
            }}
          >
            {/* {`(${favouriteMarkets.length})`} */}
          </span>
        </StyledTab>
        {/* <StyledTab
          isSelected={tab === 'solanaNative'}
          onClick={() => onTabChange('solanaNative')}
        >
          Solana Native{' '}
          <span
            style={{
              color: tab === 'solanaNative' ? '#fbf2f2' : '#96999C',
              marginLeft: '0.5rem',
            }}
          >
            {`(${filterSelectorDataForTab('solanaNative').length})`}
          </span>
        </StyledTab>
        <StyledTab
          isSelected={tab === 'usdt'}
          onClick={() => onTabChange('usdt')}
        >
          USDT{' '}
          <span
            style={{
              color: tab === 'usdt' ? '#fbf2f2' : '#96999C',
              marginLeft: '0.5rem',
            }}
          >
            {`(${filterSelectorDataForTab('usdt').length})`}
          </span>
        </StyledTab>
        <StyledTab
          isSelected={tab === 'usdc'}
          onClick={() => onTabChange('usdc')}
        >
          USDC
          <span
            style={{
              color: tab === 'usdc' ? '#fbf2f2' : '#96999C',
              marginLeft: '0.5rem',
            }}
          >
            {`(${filterSelectorDataForTab('usdc').length})`}
          </span>
        </StyledTab>
        <StyledTab
          isSelected={tab === 'sol'}
          onClick={() => onTabChange('sol')}
        >
          SOL{' '}
          <span
            style={{
              color: tab === 'sol' ? '#fbf2f2' : '#96999C',
              marginLeft: '0.5rem',
            }}
          >
            {`(${filterSelectorDataForTab('sol').length})`}
          </span>
        </StyledTab>{' '} */}
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
        {/* {isAdvancedSelectorMode && (
          <>
            {Object.entries(marketsByCategories).map(
              ([category, categoriesData]) => {
                return (
                  <StyledTab
                    isSelected={tab === category}
                    onClick={() => onTabChange(category)}
                  >
                    {categoriesData.name}

                    <span
                      style={{
                        color: tab === category ? '#fbf2f2' : '#96999C',
                        marginLeft: '0.5rem',
                      }}
                    >
                      {`(${filterSelectorDataForTab(category).length})`}
                    </span>
                  </StyledTab>
                )
              }
            )}
            <StyledTab
              isSelected={tab === 'leveraged'}
              onClick={() => onTabChange('leveraged')}
            >
              Leveraged tokens{' '}
              <span
                style={{
                  color: tab === 'leveraged' ? '#fbf2f2' : '#96999C',
                  marginLeft: '0.5rem',
                }}
              >
                {`(${filterSelectorDataForTab('leveraged').length})`}
              </span>
            </StyledTab>
          </>
        )} */}
      </Row>
    </StyledHeader>
  )
}

const MemoizedTableHeader = React.memo(TableHeader)

export { MemoizedTableHeader as TableHeader }
