import styled from 'styled-components'

import { Row } from '../../../AnalyticsRoute/index.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

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
`
export const TableHeader = styled.tr`
  height: 4rem;
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

export const TableRow = styled.tr``

export const RowTd = styled.td`
  width: auto;
  padding: 0 2rem;
  font-family: 'Avenir Next Thin';
  border-top: 0.2rem solid #383b45;
  color: #f5f5fb;
  font-size: 1.5rem;
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
export const TokenIcon = styled.div`
  position: absolute;
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  z-index: ${(props) => props.zIndex};
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
