import styled, { keyframes } from 'styled-components'
import MdArrowDropUp from '@material-ui/icons/ArrowDropUp'
import Collapse from '@material-ui/core/Collapse'
import MdArrowUpward from '@material-ui/icons/ArrowUpward'

import { TypographyFullWidth } from '@sb/styles/cssUtils'

import {
  Table,
  Title,
} from '@sb/components/OldTable/Table'

export const StyledTypography = styled(TypographyFullWidth)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

export const TriggerTitle = styled(Title)`
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  transition: opacity 0.75s ease-in-out;
  height: 2.875rem;
  &:hover {
    opacity: 0.85;
  }
`

export const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

export const CollapsibleTable = styled(Table)`
  position: absolute;
  top: 0;
  max-height: calc(70% - 37px);
  z-index: 10;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

export const TradeHistoryTableCollapsible = styled(CollapsibleTable)`
  max-height: 50%;

  @media (max-width: 1080px) {
    bottom: 0.5rem;
  }
`

export const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 2rem;
  transform: ${(props) =>
    props.variant.up ? 'rotate(0deg)' : 'rotate(180deg)'};

  position: absolute;
  left: 0.25rem;

  bottom: 15%;
  transition: all 0.5s ease;

  ${TriggerTitle}:hover & {
    animation: ${(props) =>
        props.variant.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
`

export const JumpDownArrow = keyframes`
0% {
  bottom: 15%;
}
50% {
  bottom: -10%;
}
100% {
  bottom: 15%;

}
`
export const JumpUpArrow = keyframes`
0% {
  bottom: 15%;
}
50% {
  bottom: 50%;
}
100% {
  bottom: 15%;
}
`

export const StyledArrow = styled(MdArrowUpward)`
  min-width: 20%;
  color: ${(props: { direction: string; color: string }) => props.color};

  transform: ${(props: { direction: string; color: string }) =>
    props.direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'};
`
