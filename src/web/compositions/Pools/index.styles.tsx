import React from 'react'
import styled from 'styled-components'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

const BlockTemplate = styled(({ theme, ...props }) => <Row {...props} />)`
  box-shadow: 0px 0px 48px rgba(0, 0, 0, 0.55);
  background: ${(props) => props.theme.palette.dark.background};
  border-radius: 1.6rem;
`
export { BlockTemplate }
