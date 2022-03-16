import styled from 'styled-components'

import { InlineText } from '@sb/components/Typography'
import { ContentBlock } from '@sb/compositions/Staking/styles'

export const RewardsContainer = styled(ContentBlock)`
  width: 48%;
  height: auto;
  padding: 0;
`
export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70%;
  background: #000;
  border-radius: 1rem 1rem 0 0;
  padding: 6rem;
`

export const RewardDescription = styled(InlineText)`
  text-align: right;
`
