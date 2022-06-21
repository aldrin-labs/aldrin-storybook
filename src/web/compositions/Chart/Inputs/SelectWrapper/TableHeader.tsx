import React, { useMemo, useCallback } from 'react'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import { marketsByCategories } from '@core/config/marketsByCategories'

import { ISelectData, SelectTabType } from './SelectWrapper.types'
import { filterSelectorDataByTab } from './SelectWrapper.utils'
import {
  StyledTab,
  StyledHeader,
  ExpandIconContainer,
} from './SelectWrapperStyles'

const TableHeader = ({
  tab,
  data,
  tokenMap,
  favouritePairsMap,
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
  favouritePairsMap: Map<string, string>
  setSelectorMode: (mode: string) => void
  onTabChange: (tab: string) => void
}) => {
  const filterSelectorDataForTab = useCallback(
    (tab) => {
      return filterSelectorDataByTab({
        tab,
        data,
        allMarketsMap,
        favouritePairsMap,
        tokenMap,
      })
    },
    [data, allMarketsMap, favouritePairsMap, tokenMap]
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
        <ExpandIconContainer>
          {isAdvancedSelectorMode ? (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.293 16.949L13.414 14.828L16.586 18L18 16.586L14.828 13.414L16.949 11.293H11.293V16.949ZM6.707 1.051L4.586 3.172L1.414 0L0 1.414L3.172 4.586L1.051 6.707H6.707V1.051ZM11.293 6.707H16.949L14.828 4.586L18 1.414L16.586 0L13.414 3.172L11.293 1.051V6.707ZM6.707 11.293H1.051L3.172 13.414L0 16.586L1.414 18L4.586 14.828L6.707 16.949V11.293Z"
                fill="#F8FAFF"
              />
            </svg>
          ) : (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 12.344L15.879 14.465L12.707 11.293L11.293 12.707L14.465 15.879L12.344 18H18V12.344ZM0 5.656L2.121 3.535L5.293 6.707L6.707 5.293L3.535 2.121L5.656 0H0V5.656ZM18 0H12.344L14.465 2.121L11.293 5.293L12.707 6.707L15.879 3.535L18 5.656V0ZM0 18H5.656L3.535 15.879L6.707 12.707L5.293 11.293L2.121 14.465L0 12.344V18Z"
                fill="#F8FAFF"
              />
            </svg>
          )}
        </ExpandIconContainer>
      </Row>
      <Row
        width="calc(100%)"
        justify="flex-start"
        padding="0 0 0 1rem"
        // style={{ borderLeft: '.1rem solid #383B45' }}
      >
        <StyledTab
          isSelected={tab === 'all'}
          onClick={() => onTabChange('all')}
        >
          All{' '}
          <span
            style={{
              color: tab === 'all' ? '#fbf2f2' : '#96999C',
              marginLeft: '0.5rem',
            }}
          >
            {`(${dataWithoutCustomMarkets.length})`}
          </span>
        </StyledTab>
        <StyledTab
          isSelected={tab === 'favourite'}
          onClick={() => onTabChange('favourite')}
        >
          Favourite{' '}
          <span
            style={{
              color: tab === 'favourite' ? '#fbf2f2' : '#96999C',
              marginLeft: '0.5rem',
            }}
          >
            {`(${favouritePairsMap.size})`}
          </span>
        </StyledTab>
        <StyledTab
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
        </StyledTab>{' '}
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
        {isAdvancedSelectorMode && (
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
        )}
      </Row>
    </StyledHeader>
  )
}

const MemoizedTableHeader = React.memo(TableHeader)

export { MemoizedTableHeader as TableHeader }
