import { COLORS, FONTS, FONT_SIZES } from '@variables/variables'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loader } from '@sb/components/Loader/Loader'
import { InlineText } from '@sb/components/Typography'
import { Text, TextProps } from '@sb/compositions/Addressbook'

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
  height: 1.5em;
  width: 3em;
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
  font-size: ${FONT_SIZES.md};
  color: #f2fbfb;
  background: #17181a;
  border: 0.1rem solid #383b45;
  border-radius: 1.2rem;
  font-family: ${FONTS.main};
  width: ${(props) => props.width || '100%'};
  height: 100%;
  padding: 0 2rem;
  outline: none;

  &::placeholder {
    font-size: ${FONT_SIZES.md};
    font-family: ${FONTS.main};
    color: ${COLORS.hint};
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
  &,
  &:hover {
    background: ${(props: { disabled: boolean; color: string }) =>
      props.disabled
        ? COLORS.disabledGray
        : props.color ||
          `linear-gradient(91.8deg, ${COLORS.primary} 15.31%, ${COLORS.error} 89.64%)`};
    color: ${(props: { disabled: boolean }) =>
      !props.disabled ? COLORS.primaryWhite : COLORS.white};
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

export const PoolName = styled(InlineText)`
  &:hover {
    text-decoration: underline;
  }
`

export const PoolsTableIcons = styled.div`
  margin: 5px 0 0 10px;
  width: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
