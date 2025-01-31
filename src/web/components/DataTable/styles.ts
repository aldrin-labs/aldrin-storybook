import { FONTS, COLORS, TRANSITION } from '@variables/variables'
import styled from 'styled-components'

import { FlexBlock, Body } from '../Layout'

export const TableBody = styled(Body)`
  width: 100%;
  overflow: auto;
`

export const Table = styled.table`
  width: 100%;
  font-family: ${FONTS.main};
  border-collapse: collapse;
`

export const Thead = styled.thead``
export const Tr = styled.tr`
  border-top: 1px solid ${(props) => props.theme.colors.white3};
  border-bottom: 1px solid ${(props) => props.theme.colors.white3};
  background: rgba(0, 0, 0, 0);
  transition: ${TRANSITION};
`

export const ThContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.colors.white1};
`

export const Th = styled.th`
  font-size: 0.8em;
  font-weight: normal;
  text-align: left;
  border-bottom: 1px solid ${(props) => props.theme.colors.white4};
  border-top: 1px solid ${(props) => props.theme.colors.white4};
  padding: 4px 8px;

  &.sortable {
    user-select: none;
    cursor: pointer;
  }
`

export const Tbody = styled.tbody`
  ${Tr}:not(.no-hover):hover {
    background: ${(props) => props.theme.colors.white4};
  }
`

export const Td = styled.td`
  padding: 8px;
`

export const ArrowContainer = styled.div`
  width: 24px;
  text-align: center;
  color: ${(props) => props.theme.colors.white1};
`

export const NoDataBlock = styled(FlexBlock)`
  font-size: 24px;
  height: 100%;
  align-items: center;
  font-weight: 600;
  color: ${COLORS.hint};
  text-align: center;
`
