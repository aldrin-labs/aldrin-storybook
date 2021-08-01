import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Theme } from '@material-ui/core'
import { formatGroupLabel } from 'react-select/lib/builtins'

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
    theme,
    needBorder = true,
    needBorderRadius = false,
    ...rest
  }) => (
    <BtnCustom
      btnWidth={width}
      fontSize="1.3rem"
      padding={padding}
      btnColor={isDisabled ? '#7284A0' : activeColor}
      backgroundColor={isDisabled ? 'transparent' : activeBackgroundColor}
      borderColor={
        // needBorder
        //   ? isDisabled
        //     ? theme.palette.grey.border
        //     : activeBorderColor
        //   :
        'none'
      }
      {...rest}
    />
  )
)`
  height: ${(props) => props.height};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  text-transform: ${(props) => props.textTransform || 'capitalize'};
  white-space: nowrap;
  cursor: ${(props) => (props.isDisabled ? 'unset' : 'pointer')};
  letter-spacing: 0.15rem;
  min-width: 0;

  &:hover {
    color: ${(props) => props.isDisabled && props.activeColor};
    background-color: ${(props) =>
      props.isDisabled && props.activeBackgroundColor};
    border: ${(props) =>
      props.needBorder
        ? props.isDisabled && `0.1rem solid ${props.activeBorderColor}`
        : 'none'};
    cursor: ${(props) => props.isDisabled && 'pointer'};
  }

  border-radius: ${(props) =>
    !props.needBorderRadius
      ? props.isFirstHalf
        ? `${props.borderRadius} 0 0 ${props.borderRadius}`
        : `0 ${props.borderRadius} ${props.borderRadius} 0`
      : props.borderRadius};
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

const CustomSwitcher = ({
  firstHalfIsActive,
  changeHalf,
  firstHalfText,
  firstHalfStyleProperties,
  secondHalfText,
  secondHalfStyleProperties,
  buttonHeight,
  containerStyles,
  needBorderRadius,
  theme,
  needBorder,
}: {
  firstHalfIsActive: boolean
  changeHalf: () => void
  firstHalfText: string
  firstHalfStyleProperties: CSSProperties
  secondHalfText: string
  secondHalfStyleProperties: CSSProperties
  buttonHeight: string
  containerStyles: CSSProperties
  needBorderRadius: boolean
  theme: Theme
  needBorder: boolean
}) => {
  return (
    <div style={{ display: 'inline-block', ...containerStyles }}>
      <SwitcherHalf
        isFirstHalf
        theme={theme}
        key={'firstHalf'}
        isDisabled={!firstHalfIsActive}
        onClick={() => !firstHalfIsActive && changeHalf()}
        height={buttonHeight}
        width={'50%'}
        needBorderRadius
        needBorder
        {...firstHalfStyleProperties}
      >
        {firstHalfText}
      </SwitcherHalf>
      <SwitcherHalf
        theme={theme}
        key={'secondHalf'}
        isDisabled={firstHalfIsActive}
        onClick={() => firstHalfIsActive && changeHalf()}
        height={buttonHeight}
        width={'50%'}
        needBorderRadius
        needBorder
        {...secondHalfStyleProperties}
      >
        {secondHalfText}
      </SwitcherHalf>
    </div>
  )
}

export default CustomSwitcher
