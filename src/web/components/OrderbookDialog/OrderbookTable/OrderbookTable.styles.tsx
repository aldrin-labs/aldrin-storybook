import styled from 'styled-components'
import { Body, Table, HeadCell } from '@sb/components/OldTable/Table'

export const Wrapper = styled(Table)`
  width: 30%;
  height: 100%;
  margin-top: 1rem;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  display: flex;
`

export const StyledBody = styled(Body)`
  height: 50%;
`

export const StyledHeadCell = styled(HeadCell)`
  width: auto;
  flex-basis: 50%;
  padding-left: 0;
`
