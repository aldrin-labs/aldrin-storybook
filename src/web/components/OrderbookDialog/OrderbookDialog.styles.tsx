import styled from 'styled-components'

import { StyledPaper as Paper } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

export const StyledPaper = styled(Paper)`
  @media (max-width: 1440px) {
    max-width: 550px;
  }

  @media (min-width: 1400px) {
    max-width: 680px;
  }

  @media (min-width: 1921px) {
    max-width: 950px;
  }

  @media (min-width: 2560px) {
    max-width: 1250px;
  }
`
