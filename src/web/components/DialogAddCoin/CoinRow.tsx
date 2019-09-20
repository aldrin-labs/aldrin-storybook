import SvgIcon from '@sb/components/SvgIcon'
import { importCoinIcon } from '@core/utils/MarketCapUtils'
import { addMainSymbol } from '@sb/components/index'

const CoinRow = ({ symbol, priceUSD }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      </span>
      <span style={{ color: '#2F7619', position: 'relative', top: '.275rem' }}>
        {addMainSymbol(priceUSD, true)}
      </span>
    </div>
  )
}

export default CoinRow
