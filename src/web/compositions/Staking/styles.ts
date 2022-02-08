import { COLORS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { Block } from '@sb/components/Block'

export const StakingBlock = styled(Block)`
  background: ${COLORS.defaultGray};
`

export const Content = styled.div`
  max-width: ${BREAKPOINTS.xxl};
  margin: 20px auto;
`
