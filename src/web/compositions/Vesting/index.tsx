import React, { useState } from 'react'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { useWallet } from '@sb/dexUtils/wallet'
import { withTheme } from '@material-ui/core/styles'
import { compose } from 'recompose'
import { RowContainer } from '../AnalyticsRoute/index.styles'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { ClaimBlock } from './ClaimBlock'

const VestingPage = ({
  theme,
  publicKey,
}: {
  theme: any
  publicKey: string
}) => {
  const { wallet } = useWallet()

  return (
    <RowContainer height={'100%'}>
      {!publicKey ? (
        <BtnCustom
          theme={theme}
          onClick={wallet.connect}
          needMinWidth={false}
          btnWidth="auto"
          height="auto"
          fontSize="1.4rem"
          padding="2rem 8rem"
          borderRadius="1.1rem"
          borderColor={theme.palette.blue.serum}
          btnColor={'#fff'}
          backgroundColor={theme.palette.blue.serum}
          textTransform={'none'}
          margin={'4rem 0 0 0'}
          transition={'all .4s ease-out'}
          style={{ whiteSpace: 'nowrap' }}
        >
          Connect wallet
        </BtnCustom>
      ) : (
        <ClaimBlock theme={theme} />
      )}
    </RowContainer>
  )
}

export default compose(withTheme(), withPublicKey)(VestingPage)
