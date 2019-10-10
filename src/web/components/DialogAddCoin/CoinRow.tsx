import SvgIcon from '@sb/components/SvgIcon'
import { importCoinIcon } from '@core/utils/MarketCapUtils'
import { addMainSymbol } from '@sb/components/index'

import { Add, Done, VisibilityOff } from '@material-ui/icons'

const CoinRow = ({ symbol, priceUSD, alreadyExist = false }) => {
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
        <SvgIcon
          style={{
            marginRight: '.5rem',
            position: 'relative',
            top: '0.275rem',
          }}
          width={`1.7rem`}
          height={`1.7rem`}
          src={importCoinIcon(symbol)}
        />
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
          {addMainSymbol(priceUSD, true)}
        </span>
      </span>
      {alreadyExist ? (
        <Done style={{ color: '#29AC80' }} />
      ) : (
        <Add style={{ color: '#4a8de5' }} />
      )}
    </div>
  )
}

export default CoinRow
