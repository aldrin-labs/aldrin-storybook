import React from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core/styles'

import { withPublicKey } from '@core/hoc/withPublicKey'
import { useWallet } from '@sb/dexUtils/wallet'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Text } from './Rebalance.styles'

const RebalanceComposition = ({
  publicKey,
  theme,
}: {
  publicKey: string
  theme: Theme
}) => {
  const { wallet } = useWallet()

  return (
    <>
      <RowContainer
        theme={theme}
        style={{ height: '100%', background: theme.palette.grey.additional }}
      >
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '75%',
            height: '80%',
            padding: '0',
          }}
          theme={theme}
        >
          {!publicKey && (
            <>
              <Text style={{ color: theme.palette.text.light }}>
                Connect your wallet to rebalance your coins
              </Text>
              {/* connect wallet */}
              <BtnCustom
                theme={theme}
                onClick={wallet.connect}
                needMinWidth={false}
                btnWidth="auto"
                height="auto"
                fontSize="1.4rem"
                padding="1rem 2rem"
                borderRadius=".8rem"
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
            </>
          )}
        </Card>
      </RowContainer>
    </>
  )
}

export default compose(withTheme(), withPublicKey)(RebalanceComposition)
