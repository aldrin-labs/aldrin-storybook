import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { GridCard } from '@sb/compositions/Profile/Profile.styles'
import { Typography } from '@sb/compositions/Profile/compositions/ProfileSidebar/ProfileSidebar.styles'

export const GridBlock = styled(GridCard)`
  margin-top: ${(props) => (props.needMarginTop ? '1.5rem' : '0')};
  height: ${(props) =>
    props.needMarginTop ? `calc(${props.height} - 1.5rem)` : `${props.height}`};

  margin-left: ${(props) => (props.needMarginLeft ? '1.5rem' : '0')};
  width: ${(props) =>
    props.needMarginLeft ? `calc(${props.width} - 1.5rem)` : `${props.width}`};
`

export const LogsGrid = styled(Grid)`
  display: flex;
  height: calc(51% - 1.5rem);
  margin-top: 1.5rem;
`

export const GridTitle = styled.div`
  background-color: #f2f4f6;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-bottom: 0.1rem solid #e0e5ec;
  text-align: center;
`

export const TextTitle = styled(Typography)`
  margin: 0;
  padding: 1.2rem 0;
  color: #16253d;
  font-size: 1.2rem;
  text-transform: uppercase;
`

export const SettingsLeftBlock = styled(Grid)`
  width: 58.3%;
  margin-right: 1.5rem;
`

export const SettingsRightBlock = styled(Grid)`
  width: calc(41.7% - 1.5rem);
`
