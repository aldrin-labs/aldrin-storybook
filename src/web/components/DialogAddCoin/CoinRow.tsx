import React from 'react'
import LazyLoad from 'react-lazyload'

import SvgIcon from '@sb/components/SvgIcon'
import { importCoinIcon, onErrorImportCoinUrl } from '@core/utils/MarketCapUtils'
import { addMainSymbol } from '@sb/components/index'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import { Add, Done, VisibilityOff } from '@material-ui/icons'

const CoinRow = ({
  symbol,
  priceUSD,
  alreadyExist = false,
  dustFiltered = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: alreadyExist ? '#F9FBFD' : '#fff',
        padding: '.8rem 1.2rem',
      }}
    >
      <span>
        <LazyLoad once height={`1.7rem`} >
          <SvgIcon
            style={{
              marginRight: '.5rem',
              position: 'relative',
              top: '0.275rem',
            }}
            width={`1.7rem`}
            height={`1.7rem`}
            src={importCoinIcon(symbol)}
            onError={onErrorImportCoinUrl}
          />
        </LazyLoad>
        <span style={{ position: 'relative', bottom: '.2rem' }}>{symbol}</span>

        <span
          style={{
            color: '#29AC80',
            position: 'relative',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            left: '.8rem',
            bottom: '.2rem',
          }}
        >
          {addMainSymbol(roundAndFormatNumber(priceUSD, 8, true), true)}
        </span>
      </span>
      {alreadyExist ? (
        dustFiltered ? (
          <VisibilityOff
            style={{
              width: '1.5rem',
              height: '1.5rem',
              position: 'relative',
              top: '.3rem',
            }}
          />
        ) : (
          <Done style={{ color: '#29AC80', width: '2rem', height: '2rem' }} />
        )
      ) : (
        <Add
          style={{
            color: '#4a8de5',
            width: '2.4rem',
            height: '2.4rem',
            position: 'relative',
            left: '.4rem',
          }}
        />
      )}
    </div>
  )
}

export default CoinRow
