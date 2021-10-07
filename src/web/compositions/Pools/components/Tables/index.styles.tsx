import styled from 'styled-components'

import { Row, RowContainer } from '../../../AnalyticsRoute/index.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Text } from '@sb/compositions/Addressbook'
import React from 'react'
import { Loading } from '@sb/components/Loading'

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
  font-family: ${(props: TextProps) => props.fontFamily || 'Avenir Next Thin'};
  color: ${(props) => props.color || '#fbf2f2'};
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
  border-radius: 1.2rem;
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
export const GreenButton = styled(
  ({
    disabled,
    showLoader,
    children,
    textTransform = 'capitalize',
    ...props
  }) => (
    <BtnCustom disabled={disabled} textTransform={textTransform} {...props}>
      {showLoader ? (
        <Loading
          color={'#fff'}
          size={24}
          style={{ display: 'flex', alignItems: 'center', height: '4.5rem' }}
        />
      ) : (
        children
      )}
    </BtnCustom>
  )
)`
  font-size: 1.4rem;
  height: 4.5rem;
  background-color: ${(props: { disabled: boolean; theme: Theme }) =>
    !props.disabled ? '#A5E898' : props.theme.palette.grey.title};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: ${(props: { disabled: boolean }) =>
    !props.disabled ? '#17181A' : '#fff'};
  border: none;
`

export const TableContainer = styled(RowContainer)`
  align-items: flex-start;
  min-height: 30rem;
  position: relative;
`

export const AmountText = styled.span`
  color: #a5e898;
`

export const WhiteText = styled.span`
  color: #fbf2f2;
`
