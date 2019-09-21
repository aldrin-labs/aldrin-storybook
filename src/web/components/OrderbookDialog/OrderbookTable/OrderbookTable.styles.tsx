import styled from 'styled-components'
import { Body, Table, HeadCell } from '@sb/components/OldTable/Table'
import { StyledCell } from '@sb/compositions/Chart/Tables/TradeHistoryTable/Table/TradeHistoryTable.styles'

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

export const StyledBodyCell = styled(StyledCell)`
  padding: 0.1rem 1rem;
`
