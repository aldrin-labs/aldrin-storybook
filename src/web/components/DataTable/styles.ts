import styled from 'styled-components'
import { FONTS, UCOLORS, COLORS, TRANSITION } from '@variables/variables'
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
  border-top: 1px solid ${UCOLORS.gray4};
  border-bottom: 1px solid ${UCOLORS.gray4};
  background: rgba(0, 0, 0, 0);
  transition: ${TRANSITION};
`

export const ThContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Th = styled.th`
  font-size: 0.8em;
  font-weight: normal;
  text-align: left;
  border-bottom: 1px solid ${UCOLORS.gray4};
  border-top: 1px solid ${UCOLORS.gray4};
  padding: 4px 8px;

  &.sortable {
    user-select: none;
    cursor: pointer;
  }
`

export const Tbody = styled.tbody`
  ${Tr}:not(.no-hover):hover {
    background: ${UCOLORS.gray5};
  }
`

export const Td = styled.td`
  padding: 8px;
`

export const ArrowContainer = styled.div`
  width: 24px;
  text-align: center;
`

export const NoDataBlock = styled(FlexBlock)`
  font-size: 24px;
  padding: 40px 0;
  font-weight: 600;
  color: ${COLORS.hint};
  text-align: center;
`
