import styled from 'styled-components'

import { Grid } from '@material-ui/core'

export const ProfileContainer = styled(Grid)`
  width: 93.4vw;
  height: 84.2vh;
  margin: 1vh 3.3vw;
`

export const GridCard = styled(Grid)`
  background: #ffffff;
  border-radius: 0.1rem solid #e0e5ec;
  box-shadow: 0px 0px 1.5rem rgba(8, 22, 58, 0.1);
  border-radius: 1.5rem;
`

export const SidebarContainer = styled(GridCard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem 1.2rem 1.2rem;
  margin-right: 1.5rem;
  text-align: center;
`

export const MainContainer = styled.div`
  height: 100%;
  width: calc(83.3% - 1.5rem);
`
