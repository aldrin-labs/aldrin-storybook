import styled from 'styled-components'
import { GridCard } from '@sb/compositions/Profile/Profile.styles'

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
`

export const StatisticContainer = styled.div`
  width: 20%;
  margin-right: 1.5rem;
`

export const ContentContainer = styled.div`
  width: calc(80% - 1.5rem);
`

// 1.5 rem - margin
export const GridBlock = styled(GridCard)`
  margin-top: 1.5rem;
  height: ${(props) => `calc(${props.height} - 1.5rem)`};
`

export const PortfolioBlock = styled(GridCard)`
  height: 14%;
`
