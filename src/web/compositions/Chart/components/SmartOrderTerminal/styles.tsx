import React from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { HeaderProperties, BlockProperties } from './types'

export const TerminalBlocksContainer = styled(Grid)`
  padding-top: 1rem;
`

export const TerminalHeaders = styled.div`
  display: flex;
  position: relative;
`

export const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props: HeaderProperties) => props.justify};

  width: ${(props: HeaderProperties) => props.width};
  padding: ${(props: HeaderProperties) => props.padding || '.8rem 1.5rem'};
  margin: ${(props: HeaderProperties) => props.margin || '0'};

  background: #f2f4f6;
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.2rem;
`

export const HeaderTitle = styled.span`
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #16253d;
  border-bottom: 0.1rem dashed #5c8cea;
`

export const InputTitle = styled(HeaderTitle)`
  color: #7284a0;
  margin-right: 1rem;
`

export const CloseHeader = styled(TerminalHeader)`
  position: absolute;
  right: 0;
  cursor: pointer;
`

export const TerminalBlock = styled(Grid)`
  width: ${(props: BlockProperties) => props.width};
  padding: ${(props) => props.padding};
  position: relative;
  border-right: 0.1rem solid #abbad1;
`

export const SwitcherHalf = styled(
  ({
    isDisabled,
    activeBackgroundColor,
    activeColor,
    activeBorderColor,
    isFirstHalf,
    borderRadius,
    width,
    height,
    padding,
    ...rest
  }) => (
    <BtnCustom
      btnWidth={width}
      fontSize="1.3rem"
      padding={padding}
      btnColor={isDisabled ? '#7284A0' : activeColor}
      backgroundColor={isDisabled ? '#fff' : activeBackgroundColor}
      borderColor={isDisabled ? '#e0e5ec' : activeBorderColor}
      {...rest}
    />
  )
)`
  height: ${(props) => props.height};
  font-weight: normal;
  text-transform: capitalize;
  white-space: nowrap;
  cursor: ${(props) => (props.isDisabled ? 'unset' : 'pointer')};
  letter-spacing: 0.15rem;

  &:hover {
    color: ${(props) => props.isDisabled && props.activeColor};
    background-color: ${(props) =>
      props.isDisabled && props.activeBackgroundColor};
    border: ${(props) =>
      props.isDisabled && `0.1rem solid ${props.activeBorderColor}`};
    cursor: ${(props) => props.isDisabled && 'pointer'};
  }

  border-radius: ${(props) =>
    props.isFirstHalf
      ? `${props.borderRadius} 0 0 ${props.borderRadius}`
      : `0 ${props.borderRadius} ${props.borderRadius} 0`};
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  @media (min-width: 1921px) {
    height: ${(props) => `calc(${props.height} - .5rem)`};
    font-size: 1.1rem;
    padding-top: 0.2rem;
  }

  & span {
    line-height: normal;
  }
`

export const FieldsContainer = styled.div`
  display: flex;
  padding-top: 0.9rem;
`

export const SubBlocksContainer = styled.div`
  width: 50%;
  border-right: ${(props) => props.needBorder && '.1rem solid #e0e5ec'};
  padding-right: 0.4rem;
`

export const SubBlockHeader = styled.div`
  padding: 0 0 0.8rem 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputRowContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${(props) => props.paddingBottom || '.6rem'};

  @media (min-width: 1921px) {
    padding-bottom: ${(props) => props.paddingBottom || '.8rem'};
  }
`
