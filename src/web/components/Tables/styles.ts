import styled from 'styled-components'
import TableHead from '@material-ui/core/TableHead'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

export const PlaceHolder = styled.div`
  height: 400px;
`

export const StyledTableHead = styled(TableHead)`
  @media (max-width: 600px) {
    display: none;
  }
`
