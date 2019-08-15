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
  padding-top: 6px;
  line-height: 18px;
  font-size: 0.9rem;
  color: #16253d;
  font-weight: bold;

  @media (min-width: 2560px) {
    line-height: 35px;
  }
`

export const StyledCell = styled(Cell)`
  padding: 0 0.32rem;

  & span,
  & p {
    font-size: 0.9rem;
    font-weight: bold;
  }

  & p {
    text-align: left;
  }
`

export const CardTitle = styled(StyledTitle)`
  font-family: Trebuchet MS;
  font-style: normal;
  font-weight: normal;
  text-transform: capitalize;
  letter-spacing: auto;
  font-size: 1.4rem;
  line-height: 35px;
  padding-top: 2px;
`

export const TriggerTitle = styled(Title)`
  height: auto;
  cursor: pointer;
  position: relative;
  padding: 0;
  transition: opacity 0.75s ease-in-out;
  background: #f2f4f6;
  color: #16253d;
  border-bottom: 1px solid #e0e5ec;

  &:hover {
    opacity: 0.85;
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
