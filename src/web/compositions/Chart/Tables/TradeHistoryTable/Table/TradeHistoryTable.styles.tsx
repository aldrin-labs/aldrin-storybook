import React from 'react'
import styled from 'styled-components'
import MdArrowUpward from '@material-ui/icons/ArrowUpward'

import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Table, Title, Cell } from '@sb/components/OldTable/Table'

export const StyledTypography = styled(
  ({ textColor, ...rest }: { textColor: string; rest: any }) => (
    <TypographyFullWidth {...rest} />
  )
)`
  && {
    color: ${(props) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

export const StyledTitle = styled(TypographyFullWidth)`
  line-height: 18px;
  font-size: 0.9rem;
  color: #16253d;
  font-weight: bold;
  padding: 6px 0 0 1rem;
  @media (min-width: 2560px) {
    line-height: 35px;
  }
`

export const StyledCell = styled(Cell)`
  padding: 0 1rem;

  & span,
  & p {
    font-size: 0.9rem;
    font-weight: bold;
    padding-left: 0;
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
