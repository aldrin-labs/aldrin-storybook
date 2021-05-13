import React from 'react'
import styled from 'styled-components'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

const BlockTemplate = styled(({ theme, ...props }) => <Row {...props} />)`
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.palette.dark.background};
  border-radius: 0.8rem;
`
export { BlockTemplate }
