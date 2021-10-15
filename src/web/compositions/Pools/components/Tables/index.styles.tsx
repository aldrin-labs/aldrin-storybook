import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Text } from '@sb/components/Typography'
import { Row } from '../../../AnalyticsRoute/index.styles'

export const LiquidityDataContainer = styled(Row)`
  width: 50%;
  border-right: 0.1rem solid #383b45;
  height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 2rem;
  justify-content: space-around;
`
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  // table-layout: fixed;
`
export const TableHeader = styled.thead`
  td {
    padding: 1rem 2rem;
  }
`
export const BorderButton = styled(BtnCustom)`
  border: 0.1rem solid ${(props) => props.borderColor || '#41454E'};
  width: ${(props) => props.width || 'auto'};
  padding: ${(props) => props.padding || '0 2rem'};
  height: 4rem;
  text-transform: none;
  color: ${(props) => props.color || '#fbf2f2'};
  border-radius: 1.5rem;
  font-size: 1.4rem;
`
export const TableBody = styled.tbody`
  height: 90%;
  overflow: auto;
`

export const TableRow = styled.tr``

export const RowTd = styled.td`
  width: auto;
  padding: 0 2rem;
  font-family: 'Avenir Next';
  border-top: 0.2rem solid #383b45;
  color: #f5f5fb;
  font-size: 1.5rem;
`

export const RowDataTd = styled(RowTd)`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`

export const RowDataTdText = styled(Text)`
  white-space: nowrap;
`

export const RowDataTdTopText = styled(RowDataTdText)`
  padding-bottom: 0.5rem;
`

export const TextColumnContainer = styled(Row)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: 1rem 0;
`
export const IconsContainer = styled.div`
  position: relative;
  height: 3rem;
  width: 5rem;
`

type TokenIconContainerProps = {
  zIndex?: string | number
  left?: string
  right?: string
}

export const TokenIconContainer = styled.div`
  position: absolute;
  left: ${(props: TokenIconContainerProps) => props.left};
  right: ${(props: TokenIconContainerProps) => props.right};
  z-index: ${(props: TokenIconContainerProps) => props.zIndex};
`

export const SearchInput = styled.input`
  color: #f2fbfb;
  background: #383b45;
  border: 0.1rem solid #3a475c;
  border-radius: 1.5rem;
  font-family: 'Avenir Next Thin';
  height: 4rem;
  width: ${(props) => props.width || '100%'};
  padding: 0 2rem;
  outline: none;
  &::placeholder {
    font-size: 1.7rem;
    font-family: 'Avenir Next Thin';
  }
`
