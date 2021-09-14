import React, { useState } from 'react'

import { Theme, withTheme } from '@material-ui/core'
import { useWallet } from '@sb/dexUtils/wallet'

import ConnectWallet from './components/ConnectWallet/ConnectWallet'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'

const Dashboard = ({ theme }: { theme: Theme }) => {
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { connected } = useWallet()

  if (!connected) return <ConnectWallet theme={theme} />
  if (isDataLoading)
    return (
      <RowContainer height="100%">
        <Row width="50%" justify="center">
          <LoadingWithHint
            loaderSize={'16rem'}
            loaderTextStyles={{
              fontFamily: 'Avenir Next Demi',
              fontSize: '2rem',
            }}
            hintTextStyles={{ justifyContent: 'flex-start' }}
          />
        </Row>
      </RowContainer>
    )
}

export default withTheme()(Dashboard)
