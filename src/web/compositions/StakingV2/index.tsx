import React, { useState } from 'react'
import { compose } from 'recompose'

import { Page } from '@sb/components/Layout'
import { queryRendererHoc } from '@sb/components/QueryRenderer'

import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getStakingInfo } from '@core/graphql/queries/staking/getStakingInfo'

import CoinsBg from './Components/Icons/coins.webp'
import { RinStaking } from './Components/Popups/RinStaking/index'
import { SolStaking } from './Components/Popups/SolStaking/index'
import { TableRow } from './Components/TableRow'
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
  const [isSolStakingPopupOpen, setIsSolStakingPopupOpen] = useState(false)

  const [PLD, setPLD] = useState(false)
  const [RPC, setRPC] = useState(false)
  const [PU238, setPU238] = useState(false)

  console.log({ getStakingInfoQuery })

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
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          setPLDPopup={setPLD}
          setRPCPopup={setRPC}
          setPU238Popup={setPU238}
          token="RIN"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          setPLDPopup={setPLD}
          setRPCPopup={setRPC}
          setPU238Popup={setPU238}
          token="stSOL"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          setPLDPopup={setPLD}
          setRPCPopup={setRPC}
          setPU238Popup={setPU238}
          token="mSOL"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          setPLDPopup={setPLD}
          setRPCPopup={setRPC}
          setPU238Popup={setPU238}
          token="PLD"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          setPLDPopup={setPLD}
          setRPCPopup={setRPC}
          setPU238Popup={setPU238}
          token="RPC"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          setPLDPopup={setPLD}
          setRPCPopup={setRPC}
          setPU238Popup={setPU238}
          token="PU238"
        />
      </StyledWideContent>
      {isRinStakingPopupOpen && (
        <RinStaking
          open={isRinStakingPopupOpen}
          onClose={() => setIsRinStakingPopupOpen(false)}
        />
      )}
      {isSolStakingPopupOpen && (
        <SolStaking
          open={isSolStakingPopupOpen}
          onClose={() => setIsSolStakingPopupOpen(false)}
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
