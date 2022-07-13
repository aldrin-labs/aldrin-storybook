import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const LogoContainer = styled(RowContainer)`
  svg {
    path {
      fill: ${(props) => props.theme.colors.white1};
    }
  }
`
