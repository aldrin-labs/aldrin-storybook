import React, { useState } from 'react'

import { Page } from '@sb/components/Layout'

import TestSvg from './Components/Icons/test.svg'
import { RinStaking } from './Components/Popups/RinStaking/index'
import { SolStaking } from './Components/Popups/SolStaking/index'
import { TableRow } from './Components/TableRow'
import {
  StyledWideContent,
  ThinHeading,
  TotalStakedCard,
  TotalStakedRow,
  TotalStaked,
} from './index.styles'

export const StakingPage: React.FC = () => {
  const [isRinStakingPopupOpen, setIsRinStakingPopupOpen] = useState(false)
  const [isSolStakingPopupOpen, setIsSolStakingPopupOpen] = useState(false)

  const [PLD, setPLD] = useState(false)
  const [RPC, setRPC] = useState(false)
  const [PU238, setPU238] = useState(false)

  return (
    <Page>
      <StyledWideContent>
        <TotalStakedRow>
          <TotalStakedCard>
            <ThinHeading>Total Staked</ThinHeading>
            <TotalStaked>$ 4.42m</TotalStaked>
          </TotalStakedCard>
          <div>
            <img src={TestSvg} />
          </div>
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
          token="SOL"
        />
        <TableRow
          setIsRinStakingPopupOpen={setIsRinStakingPopupOpen}
          setIsSolStakingPopupOpen={setIsSolStakingPopupOpen}
          setPLDPopup={setPLD}
          setRPCPopup={setRPC}
          setPU238Popup={setPU238}
          token="SOL"
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
