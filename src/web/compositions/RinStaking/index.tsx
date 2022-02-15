import React from 'react'

import AldrinLogo from '@icons/Aldrin.svg'

import { Content } from '../../components/Layout'
import Coins from '../Staking/components/RinStakingBlock/bg.png'
import {
  LogoWrap,
  AbsoluteImg,
} from '../Staking/components/RinStakingBlock/styles'
import StakingComponent from './components/StakingComponent'
import { StakingPage } from './styles'

export const RinStaking = () => {
  return (
    <StakingPage>
      <Content>
        <LogoWrap radius="12px">
          <img src={AldrinLogo} height="70" alt="Aldrin" />
          <AbsoluteImg src={Coins} height="auto" left="87.5%" alt="Aldrin" />
        </LogoWrap>
        <StakingComponent />
        {/* <BlockWithHints /> */}
      </Content>
    </StakingPage>
  )
}
