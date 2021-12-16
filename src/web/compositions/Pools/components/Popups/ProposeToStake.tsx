import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { Paper, Theme, withTheme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Button } from '@sb/components/Button'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  BlueButton,
  Title,
} from '@sb/compositions/Chart/components/WarningPopup'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { useConnection } from '@sb/dexUtils/connection'
import { STAKING_FARMING_TOKEN_DIVIDER } from '@sb/dexUtils/staking/config'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useWallet } from '@sb/dexUtils/wallet'
import { COLORS } from '@variables/variables'
import React from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import styled from 'styled-components'

export const StyledPaper = styled(Paper)`
  border-radius: 1.5rem;
  width: 60rem;
  height: auto;
  background: #222429;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
`
export const Number = styled.span`
  font-family: Avenir Next Demi;
  color: ${COLORS.success};
  margin: ${(props) => props.margin || '0 10px 0 0'};
  font-size: 2.4rem;
`

const ProposeToStakePopup = ({
  theme,
  close,
  open,
  getStakingPoolInfoQuery,
}: {
  theme: Theme
  close: () => void
  open: boolean
  getStakingPoolInfoQuery: { getStakingPoolInfo: StakingPool }
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const stakingPool = getStakingPoolInfoQuery.getStakingPoolInfo

  const allStakingFarmingStates = stakingPool?.farming || []

  const [allStakingFarmingTickets, refreshFarmingTickets] =
    useAllStakingTickets({
      wallet,
      connection,
    })

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    allStakingFarmingTickets
  )
  const currentFarmingState = getCurrentFarmingStateFromAll(
    allStakingFarmingStates
  )

  const tokensTotal =
    currentFarmingState?.tokensTotal / STAKING_FARMING_TOKEN_DIVIDER

  const apr = (tokensTotal / totalStaked) * 100 * 12

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify="space-between">
        <Title>Would you like to stake your RIN rewards?</Title>
      </RowContainer>
      <RowContainer direction="column" style={{ marginBottom: '2rem' }}>
        <WhiteText theme={theme}>
          Total trading fees on Aldrin’s AMM are 0.3%. Liquidity Providers will
          receive 0.20%, 0.05% will go to product development, while the
          remaining 0.05% will be used to buy back and distribute RIN to RIN
          stakers.
        </WhiteText>
      </RowContainer>
      <RowContainer justify="space-between" style={{ margin: '3rem 0' }}>
        <WhiteText theme={theme}>Current APR:</WhiteText>
        <Number>{stripByAmount(apr, 2)}%</Number>
      </RowContainer>
      <RowContainer justify="space-between" style={{ margin: '2rem 0' }}>
        <Button
          style={{
            width: '33%',
            background: 'transparent',
            color: COLORS.error,
            borderColor: COLORS.error,
            height: '4.5rem',
            fontSize: '1.4rem',
            borderRadius: '1rem',
          }}
          theme={theme}
          onClick={close}
        >
          No, Thanks
        </Button>
        <Link
          style={{ width: '65%', height: '4.5rem', textDecoration: 'none' }}
          to="/staking"
        >
          <BlueButton style={{ width: '100%' }} theme={theme}>
            Yes, definitely
          </BlueButton>
        </Link>
      </RowContainer>
    </DialogWrapper>
  )
}

export default compose(
  withTheme(),
  queryRendererHoc({
    query: getStakingPoolInfo,
    name: 'getStakingPoolInfoQuery',
    fetchPolicy: 'cache-and-network',
  })
)(ProposeToStakePopup)
