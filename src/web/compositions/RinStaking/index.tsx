import React from 'react'

import AldrinLogo from '@icons/Aldrin.svg'

import Coins from '../Staking/components/RinStakingBlock/bg.png'
import {
  LogoWrap,
  AbsoluteImg,
} from '../Staking/components/RinStakingBlock/styles'
import StakingComponent from './components/StakingComponent'
import { StakingPage, StakingContent } from './styles'

export const RinStaking = () => {
  return (
    <StakingPage>
      <StakingContent>
        <LogoWrap radius="12px">
          <img src={AldrinLogo} height="70" alt="Aldrin" />
          <AbsoluteImg src={Coins} height="auto" left="87.5%" alt="Aldrin" />
        </LogoWrap>
        <StakingComponent />
        {/* <BlockWithHints /> */}
      </StakingContent>
    </StakingPage>
  )
}
