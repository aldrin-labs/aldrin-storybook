import MdArrowUpward from '@material-ui/icons/ArrowUpward'
import React from 'react'
import styled from 'styled-components'

import { Table, Cell, Row } from '@sb/components/OldTable/Table'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

export const StyledRow = styled(Row)`
  height: 1.5rem;
`

export const StyledTitle = styled(TypographyFullWidth)`
  line-height: 1;
  font-size: 1rem;
  color: #7284a0;
  font-weight: bold;
  padding: 0.5rem 0 0.5rem 1rem;
`

export const StyledCell = styled(Cell)`
  padding: 0 1rem;

  & span,
  & p {
    font-size: 1rem;
    font-weight: bold;
    padding-left: 0;
  }

  @media (min-width: 1921px) {
    & span,
    & p {
      font-size: 0.8rem;
    }
  }
`

export const CollapsibleTable = styled(Table)`
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

export const TradeHistoryTableCollapsible = styled(CollapsibleTable)`
  @media (max-width: 1080px) {
    bottom: 0.8rem;
  }
`

export const StyledArrow = styled(
  ({
    direction,
    color,
    ...rest
  }: {
    direction: string
    color: string
    rest: any
  }) => <MdArrowUpward {...rest} />
)`
  min-width: 20%;
  color: ${(props: { direction: string; color: string }) => props.color};

  transform: ${(props: { direction: string; color: string }) =>
    props.direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'};
`
