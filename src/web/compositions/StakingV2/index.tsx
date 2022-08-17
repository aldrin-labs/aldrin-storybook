import React, { useState } from 'react'

import { Page } from '@sb/components/Layout'

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

export const StakingPage: React.FC = () => {
  const [isRinStakingPopupOpen, setIsRinStakingPopupOpen] = useState(false)
  const [isSolStakingPopupOpen, setIsSolStakingPopupOpen] = useState(false)

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
          token="RIN"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          token="stSOL"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          token="mSOL"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          token="PLD"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          token="RPC"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
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
