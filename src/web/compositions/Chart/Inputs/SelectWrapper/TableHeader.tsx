import React from 'react'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledTab } from './SelectWrapperStyles'
import { marketsByCategories } from '@core/config/marketsByCategories'
import { Grid } from '@material-ui/core'

export const TableHeader = ({
  theme,
  tab,
  data,
  onTabChange,
  officialMarketsMap,
  marketType,
}) => {
  return (
    <RowContainer
      style={{
        height: '12rem',
        padding: '0.5rem',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'normal',
        alignItems: 'center',
        borderBottom: theme.palette.border.new,
        background: '#17181A',
      }}
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
          {`(${data.length})`}
        </span>
      </StyledTab>{' '}
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
          {`(${data.filter((el) => el.symbol.includes('USDT')).length})`}
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
          {`(${data.filter((el) => el.symbol.includes('USDC')).length})`}
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
            data.filter((el) => {
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
        Top Gainers{' '}
        <span
          style={{
            color: tab === 'topGainers' ? '#fbf2f2' : '#96999C',
            marginLeft: '0.5rem',
          }}
        ></span>
      </StyledTab>
      <StyledTab
        theme={theme}
        isSelected={tab === 'topLosers'}
        onClick={() => {
          onTabChange('topLosers')
        }}
      >
        Top Losers{' '}
        <span
          style={{
            color: tab === 'topLosers' ? '#fbf2f2' : '#96999C',
            marginLeft: '0.5rem',
          }}
        ></span>
      </StyledTab>
      {Object.entries(marketsByCategories).map(([category, categoriesData]) => {
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
      })}{' '}
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
            data.filter(
              (el) =>
                el.symbol.includes('BULL') ||
                (el.symbol.includes('BEAR') && !el.isCustomUserMarket)
            ).length
          })`}
        </span>
      </StyledTab>
      <StyledTab
        theme={theme}
        isSelected={tab === 'public'}
        onClick={() => onTabChange('public')}
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
                el.isCustomUserMarket &&
                !el.isPrivateCustomMarket &&
                !officialMarketsMap?.has(el.symbol)
            ).length
          })`}
        </span>
      </StyledTab>
      {marketType === 0 && (
        <>
          <Grid
            style={{
              padding: '1rem',
              background: tab === 'btc' ? theme.palette.grey.main : '',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: theme.palette.grey.light,
              fontWeight: 'bold',
            }}
            onClick={() => onTabChange('btc')}
          >
            BTC
          </Grid>
        </>
      )}
    </RowContainer>
  )
}
