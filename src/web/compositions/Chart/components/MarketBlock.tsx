import React from 'react'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/core'
import { useLocation } from 'react-router-dom'
import { useMarket } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import MarketStats from './MarketStats/MarketStats'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

const selectStyles = (theme: Theme) => ({
  height: '100%',
  background: theme.palette.white.background,
  marginRight: '.8rem',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: theme.palette.white.background,
  border: `.1rem solid ${theme.palette.blue.serum}`,
  borderRadius: '0.75rem',
  boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
  width: '14rem',
  '& div': {
    fontFamily: 'Avenir Next Demi',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: theme.palette.dark.main,
    textTransform: 'uppercase',
  },
  '& svg': {
    color: theme.palette.blue.serum,
  },
  '.custom-select-box__control': {
    padding: '0 .75rem',
  },
  '.custom-select-box__menu': {
    minWidth: '130px',
    marginTop: '0',
    borderRadius: '0',
    boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
  },
})

const MarketBlock = ({
  theme,
  activeExchange = 'serum',
  marketType = 0,
}) => {
  const { market } = useMarket()
    const location = useLocation()

    const pair = location.pathname.split('/')[3]
    const quantityPrecision =
    market?.minOrderSize && getDecimalCount(market.minOrderSize)
    const pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)


    if (!location.pathname.split('/')[3]) {
      return null
    }

    return (
      <RowContainer justify={'space-between'} style={{ height: '6rem', padding: '0 3rem', borderBottom: theme.palette.border.new }}>
        <div data-tut="pairs" style={{ height: '100%', padding: '1rem 0', position: 'relative' }}>
          <AutoSuggestSelect
            value={pair}
            id={'pairSelector'}
            style={{ width: '20rem' }}
            activeExchange={activeExchange}
            selectStyles={{ ...selectStyles(theme) }}
            marketType={marketType}
            quantityPrecision={quantityPrecision}
            pricePrecision={pricePrecision}
          />
        </div>

        <MarketStats
          theme={theme}
          symbol={pair}
          marketType={marketType}
          exchange={activeExchange}
          quantityPrecision={quantityPrecision}
          pricePrecision={pricePrecision}
        />
      </RowContainer>
    )
}

export default compose(
  withTheme()
)(MarketBlock)
