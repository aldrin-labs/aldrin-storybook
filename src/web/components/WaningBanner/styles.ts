import styled from 'styled-components'

import { BORDER_RADIUS, COLORS } from '../../../variables/variables'
import { Text } from '../Typography'

export const BannerContainer = styled.div`
  background: ${COLORS.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 40px 10px 0;
  border-radius: ${BORDER_RADIUS.md};
`

export const BannerText = styled(Text)`
  margin: 0 20px;
`
