import styled from 'styled-components'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import { InlineText } from '../Typography'

const TokenInfoContainer = styled(RowContainer)`
  background: ${(props) => props.theme.colors.white5};
  border-radius: 0.5em;
  padding: 0.75em;
`

const IconContainer = styled(Row)`
  width: 2em;
  height: 2em;
`

const MintAddressText = styled(InlineText)`
  letter-spacing: -0.82px;
`

export { TokenInfoContainer, IconContainer, MintAddressText }
