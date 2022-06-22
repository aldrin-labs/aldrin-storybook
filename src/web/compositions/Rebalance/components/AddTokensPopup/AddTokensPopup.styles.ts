import { Paper } from '@material-ui/core'
import styled from 'styled-components'

import { Title } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'

export const WhiteText = styled(Title)`
  font-size: 1.4rem;
  font-family: Avenir Next Demi;
`

export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
  height: 55rem;
  background: ${(props) => props.theme.colors.gray6};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`

export const GreenText = styled(WhiteText)`
  color: #53df11;
`
