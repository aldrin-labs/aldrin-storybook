import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WarningPopup } from '@sb/compositions/Chart/components/WarningPopup'

import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import { BlockTemplate } from './index.styles'
import TablesSwitcher from './components/Tables/TablesSwitcher/TablesSwitcher'
import { getPools } from '@sb/dexUtils/pools'
import { useConnection } from '@sb/dexUtils/connection'
import { PublicKey } from '@solana/web3.js'
import { createBasketViaWallet } from '@sb/dexUtils/poolsTests'
import { useWallet } from '@sb/dexUtils/wallet'

const Pools = ({ theme }: { theme: Theme }) => {
  const [isWarningPopupOpen, openWarningPopup] = useState(true)

  const { wallet } = useWallet()
  const connection = useConnection()

  useEffect(() => {
    getPools(
      connection,
      new PublicKey('RinKtB5mZkTYfVvhCyLrwGxaYsfXruZg4r4AmzPM4wx')
    )

    wallet &&
      createBasketViaWallet({
        wallet,
        connection,
        poolPublicKey: new PublicKey(
          'HwTyFCPy3xi842Be2PyU4ZPu3YmaxorV5RY4b77Pb898'
        ),
        baseTokenAddress: new PublicKey(
          'HwTyFCPy3xi842Be2PyU4ZPu3YmaxorV5RY4b77Pb898'
        ),
        quoteTokenAddress: new PublicKey(
          'HwTyFCPy3xi842Be2PyU4ZPu3YmaxorV5RY4b77Pb898'
        ),
        userAmountTokenA: 0,
        userAmountTokenB: 0,
        userPoolTokenAccount: null,
      })
  }, [])

  return (
    <RowContainer
      direction={'column'}
      padding={'2rem 3rem'}
      justify={'flex-start'}
      style={{
        minHeight: '100%',
        background: theme.palette.grey.additional,
      }}
    >
      <RowContainer justify={'space-between'}>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
          style={{ position: 'relative' }}
        >
          <TotalVolumeLockedChart theme={theme} />
        </BlockTemplate>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
          style={{ position: 'relative' }}
        >
          <TradingVolumeChart theme={theme} />
        </BlockTemplate>
      </RowContainer>

      <TablesSwitcher theme={theme} />

      {/* <WarningPopup
        theme={theme}
        open={isWarningPopupOpen}
        onClose={() => openWarningPopup(false)}
        isPoolsPage={true}
      /> */}
    </RowContainer>
  )
}

const Wrapper = compose(withTheme())(Pools)

export { Wrapper as PoolsComponent }
