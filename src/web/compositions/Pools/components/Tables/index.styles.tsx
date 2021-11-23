import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loader } from '@sb/components/Loader/Loader'
import { Text } from '@sb/compositions/Addressbook'
import { COLORS } from '@variables/variables'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Row, RowContainer } from '../../../AnalyticsRoute/index.styles'



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
  font-size: 1.7rem;
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
    color: #93a0b2;
  }
`
export const Button = styled(
  ({
    disabled,
    showLoader,
    children,
    border = 'none',
    height = '4.5rem',
    fontSize = '1.4rem',
    borderRadius = '1rem',
    borderColor = 'inherit',
    textTransform = 'capitalize',
    ...props
  }) => (
      <BtnCustom
        disabled={disabled}
        textTransform={textTransform}
        height={height}
        borderColor={borderColor}
        borderRadius={borderRadius}
        fontSize={fontSize}
        border={border}
        {...props}
      >
        {showLoader ? <Loader /> : children}
      </BtnCustom>
    )
)`
  background: ${(props: { disabled: boolean; color: string }) =>
    !props.disabled
      ? props.color
        ? props.color
        : 'linear-gradient(91.8deg, #651CE4 15.31%, #D44C32 89.64%)'
      : '#93A0B2'};
  color: ${(props: { disabled: boolean }) =>
    !props.disabled ? '#F8FAFF' : '#fff'};

  &:hover {
    background-color: ${(props: {
      disabled: boolean
      color: string
    }) =>
    !props.disabled
      ? props.color
        ? props.color
        : 'linear-gradient(91.8deg, #651CE4 15.31%, #D44C32 89.64%)'
      : '#93A0B2'};
    color: ${(props: { disabled: boolean }) =>
    !props.disabled ? '#F8FAFF' : '#fff'};
  }

  ${(props) => props.style};
`

export const TableContainer = styled(RowContainer)`
  align-items: flex-start;
  min-height: 30rem;
  position: relative;
`

export const DetailsLink = styled(Link)`
  color: ${COLORS.hint};
  font-size: 13px;
  text-decoration: none;
`

// export const FarmingReward