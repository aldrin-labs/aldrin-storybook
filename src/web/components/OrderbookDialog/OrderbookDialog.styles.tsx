import styled from 'styled-components'

import { TrendingFlat as Arrow } from '@material-ui/icons'
import { StyledPaper as Paper } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

export const StyledPaper = styled(Paper)`
  @media (max-width: 1440px) {
    max-width: 750px;
  }

  @media (min-width: 1400px) {
    max-width: 880px;
  }

  @media (min-width: 1921px) {
    max-width: 1250px;
  }

  @media (min-width: 2560px) {
    max-width: 1450px;
  }
`

export const StyledArrow = styled(Arrow)`
  color: #2f7619;
  width: 5%;
  margin-top: 20px;

  @media (min-width: 1921px) {
    margin-top: 1.8rem;
  }

  @media (min-width: 2560px) {
    margin-top: 2.4rem;
  }
`
