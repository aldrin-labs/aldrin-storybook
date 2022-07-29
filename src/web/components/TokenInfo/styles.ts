import styled from 'styled-components'

import { Row } from '../Layout'
import { InlineText } from '../Typography'

const TokenInfoContainer = styled(Row)`
  width: 100%;
  flex-direction: column;
  background: ${(props) => props.theme.colors.white5};
  border-radius: 0.5em;
  padding: 0.75em;
`

const TokenIconLinksContainer = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const IconContainer = styled(Row)`
  width: 2em;
  height: 2em;
`

const MintAddressText = styled(InlineText)`
  letter-spacing: -0.82px;
`

const ExplorerContainer = styled(Row)`
  width: 2em;
  height: 2em;
  justify-content: center;
  align-items: center;
`

export {
  TokenInfoContainer,
  TokenIconLinksContainer,
  ExplorerContainer,
  IconContainer,
  MintAddressText,
}
