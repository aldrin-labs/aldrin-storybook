import styled from 'styled-components'

import { Row } from '@sb/components/Layout'

export const RootRow = styled(Row)`
  justify-content: space-betwenen;
  margin-top: 40px;
  height: ${(props) => props.height || '100%'};
  width: 100%;
`
