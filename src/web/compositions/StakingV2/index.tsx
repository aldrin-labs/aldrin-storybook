import React, { useState } from 'react'
import { compose } from 'recompose'

import { Page } from '@sb/components/Layout'
import { queryRendererHoc } from '@sb/components/QueryRenderer'

import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getStakingInfo } from '@core/graphql/queries/staking/getStakingInfo'

import CoinsBg from './Components/Icons/coins.webp'
import { RinStaking } from './Components/Popups/RinStaking/index'
import {
  MarinadeStaking,
  // MSolStaking,
} from './Components/Popups/SolStaking/index'
import { StSolStaking } from './Components/Popups/StSolStaking/index'
import { TableRow } from './Components/TableRow'
import { stakeTokens } from './config'
import {
  StyledWideContent,
  ThinHeading,
  TotalStakedCard,
  TotalStakedRow,
  TotalStaked,
  ImageContainer,
} from './index.styles'

const StakingPage: React.FC = ({ getStakingInfoQuery }) => {
  const [isRinStakingPopupOpen, setIsRinStakingPopupOpen] = useState(false)
  const [isMSolStakingPopupOpen, setIsMSolStakingPopupOpen] = useState(false)
  const [isStSolStakingPopupOpen, setIsStSolStakingPopupOpen] = useState(false)

  return (
    <Page>
      <StyledWideContent>
        <TotalStakedRow>
          <TotalStakedCard>
            <ThinHeading>Total Staked</ThinHeading>
            <TotalStaked>$ 4.42m</TotalStaked>
          </TotalStakedCard>
          <ImageContainer>
            <img alt="rin" src={CoinsBg} width="100%" height="100%" />
          </ImageContainer>
        </TotalStakedRow>
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsStSolStakingPopupOpen={setIsStSolStakingPopupOpen}
          setIsMSolStakingPopupOpen={setIsMSolStakingPopupOpen}
          token="RIN"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsStSolStakingPopupOpen={setIsStSolStakingPopupOpen}
          setIsMSolStakingPopupOpen={setIsMSolStakingPopupOpen}
          token="stSOL"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsStSolStakingPopupOpen={setIsStSolStakingPopupOpen}
          setIsMSolStakingPopupOpen={setIsMSolStakingPopupOpen}
          token="mSOL"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsStSolStakingPopupOpen={setIsStSolStakingPopupOpen}
          setIsMSolStakingPopupOpen={setIsMSolStakingPopupOpen}
          token="PLD"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsStSolStakingPopupOpen={setIsStSolStakingPopupOpen}
          setIsMSolStakingPopupOpen={setIsMSolStakingPopupOpen}
          token="RPC"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsStSolStakingPopupOpen={setIsStSolStakingPopupOpen}
          setIsMSolStakingPopupOpen={setIsMSolStakingPopupOpen}
          token="PU238"
        />
      </StyledWideContent>
      {isRinStakingPopupOpen && (
        <RinStaking
          open={isRinStakingPopupOpen}
          onClose={() => setIsRinStakingPopupOpen(false)}
        />
      )}
      {isMSolStakingPopupOpen && (
        <MarinadeStaking
          open={isMSolStakingPopupOpen}
          onClose={() => setIsMSolStakingPopupOpen(false)}
          getDexTokensPricesQuery={getDexTokensPrices}
        />
      )}
      {isStSolStakingPopupOpen && (
        <StSolStaking
          open={isStSolStakingPopupOpen}
          onClose={() => setIsStSolStakingPopupOpen(false)}
        />
      )}
    </Page>
  )
}
// TODO: types
export default compose(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  }),
  queryRendererHoc({
    query: getStakingInfo,
    name: 'getStakingInfoQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(StakingPage)
