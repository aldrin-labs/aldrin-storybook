import React from 'react'
import { useWallet } from '@sb/dexUtils/wallet'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Sollet from '@icons/sollet.svg'
import Mathwallet from '@icons/mathwallet.svg'
import Solong from '@icons/solong.svg'

import useStateWithCallback from '@sb/utils/useStateWithCallback'

const WalletBlockComponent = () => {
  const { setProvider, providerUrl: baseProviderUrl } = useWallet()

  const [providerUrl, updateProviderUrl] = useStateWithCallback(
    baseProviderUrl,
    (value: string) => {
      setTimeout(() => setProvider(value), 200)
    }
  )
  const isSolletActive = providerUrl === 'https://www.sollet.io'
  const isMathWalletActive = providerUrl === 'https://www.mathwallet.org'
  const isSolflareActive = providerUrl === 'https://solflare.com/access-wallet'
  const isSolongWallet = providerUrl === 'https://solongwallet.com'

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <BtnCustom
        btnWidth={'12.5rem'}
        height={'4rem'}
        btnColor={isSolongWallet ? '#AAF2C9' : '#ECF0F3'}
        fontSize={'1.2rem'}
        margin={'0 0.5rem 0 1rem'}
        borderColor={isSolongWallet ? '#AAF2C9' : '#3A475C'}
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          textTransform: 'none',
        }}
        onClick={() => {
          updateProviderUrl('https://solongwallet.com')
        }}
      >
        <SvgIcon src={Solong} width={'20%'} height={'70%'} />
        Solong
      </BtnCustom>
      <BtnCustom
        btnWidth={'12.5rem'}
        height={'4rem'}
        btnColor={isSolletActive ? '#AAF2C9' : '#ECF0F3'}
        fontSize={'1.2rem'}
        margin={'0 0.5rem 0 1rem'}
        borderColor={isSolletActive ? '#AAF2C9' : '#3A475C'}
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          textTransform: 'none',
        }}
        onClick={() => {
          updateProviderUrl('https://www.sollet.io')
        }}
      >
        <SvgIcon src={Sollet} width={'20%'} height={'70%'} /> Sollet.io
      </BtnCustom>
      {/* <BtnCustom
        btnWidth={'12.5rem'}
        height={'4rem'}
        btnColor={isMathWalletActive ? '#AAF2C9' : '#ECF0F3'}
        fontSize={'1.2rem'}
        margin={'0 1rem 0 0.5rem'}
        borderColor={isMathWalletActive ? '#AAF2C9' : '#3A475C'}
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          textTransform: 'none',
        }}
        onClick={() => {
          updateProviderUrl('https://www.mathwallet.org')
        }}
      >
        <SvgIcon src={Mathwallet} width={'20%'} height={'70%'} /> Math Wallet
      </BtnCustom> */}
    </div>
  )
}

export const WalletBlock = React.memo(WalletBlockComponent)
