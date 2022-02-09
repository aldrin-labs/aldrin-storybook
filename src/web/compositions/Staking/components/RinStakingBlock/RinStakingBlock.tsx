import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'

import AldrinLogo from '@icons/Aldrin.svg'

import { StakingBlock } from '../../styles'
import { LogoWrap } from './styles'

export const RinStakingBlock: React.FC = (props) => {
  return (
    <StakingBlock>
      <LogoWrap>
        <img src={AldrinLogo} height="70" alt="Aldrin" />
      </LogoWrap>
      <BlockContent>
        <BlockTitle>Stake RIN</BlockTitle>
      </BlockContent>
    </StakingBlock>
  )
}
