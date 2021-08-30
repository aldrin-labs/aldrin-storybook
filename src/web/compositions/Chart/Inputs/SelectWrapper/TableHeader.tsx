import React from 'react'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledTab, StyledHeader } from './SelectWrapperStyles'
import { marketsByCategories } from '@core/config/marketsByCategories'

import { SvgIcon } from '@sb/components'
import ExpandTableIcon from '@icons/expandIcon.svg'
import SqueezeTableIcon from '@icons/squeezeIcon.svg'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

export const TableHeader = ({
  theme,
  tab,
  data,
  tokenMap,
  favouritePairsMap,
  isAdvancedSelectorMode,
  setSelectorMode,
  onTabChange,
  allMarketsMap,
}) => {
  const dataWithoutCustomMarkets = data.filter((el) => !el.isCustomUserMarket)

  return (
    <StyledHeader theme={theme} isAdvancedSelectorMode={isAdvancedSelectorMode}>
      <Row
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
      </Row>
      <Row
        width="calc(100% - 10rem)"
        justify="flex-start"
        padding="0 0 0 1rem"
        style={{ borderLeft: '.1rem solid #383B45' }}
      >
        <StyledTab
          theme={theme}
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
          theme={theme}
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
          theme={theme}
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
            {`(${
              dataWithoutCustomMarkets.filter((el) => {
                const [base] = el.symbol.split('_')
                const baseTokenInfo = tokenMap?.get(
                  getTokenMintAddressByName(base)
                )

                return !baseTokenInfo?.name?.includes('Wrapped')
              }).length
            })`}
          </span>
        </StyledTab>
        <StyledTab
          theme={theme}
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
            {`(${
              dataWithoutCustomMarkets.filter((el) =>
                el.symbol.includes('USDT')
              ).length
            })`}
          </span>
        </StyledTab>
        <StyledTab
          theme={theme}
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
            {`(${
              dataWithoutCustomMarkets.filter((el) =>
                el.symbol.includes('USDC')
              ).length
            })`}
          </span>
        </StyledTab>
        <StyledTab
          theme={theme}
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
            {`(${
              dataWithoutCustomMarkets.filter((el) => {
                const [base, quote] = el.symbol.split('_')
                return quote === 'SOL'
              }).length
            })`}
          </span>
        </StyledTab>{' '}
        <StyledTab
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
        </StyledTab>
        {isAdvancedSelectorMode && (
          <>
            {Object.entries(marketsByCategories).map(
              ([category, categoriesData]) => {
                return (
                  <StyledTab
                    theme={theme}
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
                      {`(${
                        data.filter((el) => {
                          const [base, quote] = el.symbol.split('_')
                          return (
                            categoriesData?.tokens?.includes(base) &&
                            !el.isCustomUserMarket
                          )
                        }).length
                      })`}
                    </span>
                  </StyledTab>
                )
              }
            )}
            <StyledTab
              theme={theme}
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
                {`(${
                  dataWithoutCustomMarkets.filter(
                    (el) =>
                      el.symbol.includes('BULL') || el.symbol.includes('BEAR')
                  ).length
                })`}
              </span>
            </StyledTab>
            <StyledTab
              theme={theme}
              isSelected={tab === 'customMarkets'}
              onClick={() => onTabChange('customMarkets')}
            >
              Custom markets{' '}
              <span
                style={{
                  color: tab === 'public' ? '#fbf2f2' : '#96999C',
                  marginLeft: '0.5rem',
                }}
              >
                {`(${
                  data.filter(
                    (el) =>
                      allMarketsMap?.has(el.symbol) &&
                      allMarketsMap?.get(el.symbol).isCustomUserMarket
                  ).length
                })`}
              </span>
            </StyledTab>
          </>
        )}
      </Row>
    </StyledHeader>
  )
}
