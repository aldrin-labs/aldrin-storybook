import React from 'react'
import styled from 'styled-components'
import MdArrowUpward from '@material-ui/icons/ArrowUpward'

import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Table, Title } from '@sb/components/OldTable/Table'

export const StyledTypography = styled(
  ({ textColor, ...rest }: { textColor: string; rest: any }) => (
    <TypographyFullWidth {...rest} />
  )
)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

export const TriggerTitle = styled(Title)`
  cursor: pointer;
  position: relative;
  padding: 0;
  transition: opacity 0.75s ease-in-out;
  height: 21px;
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
