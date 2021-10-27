import styled from 'styled-components'

import { Title } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import { Paper } from '@material-ui/core'

export const WhiteText = styled(Title)`
  font-size: 1.4rem;
  font-family: Avenir Next Demi;
`

export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
  height: 55rem;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`

export const GreenText = styled(WhiteText)`
  color: #53DF11;
`