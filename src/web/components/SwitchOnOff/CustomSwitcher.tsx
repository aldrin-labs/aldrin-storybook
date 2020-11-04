import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Theme } from '@material-ui/core'

const SwitcherHalf = styled(
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
    ...rest
  }) => (
    <BtnCustom
      btnWidth={width}
      fontSize="1.3rem"
      padding={padding}
      btnColor={isDisabled ? theme.palette.grey.text : theme.palette.white.main}
      backgroundColor={
        isDisabled ? theme.palette.white.background : activeBackgroundColor
      }
      borderColor={isDisabled ? theme.palette.grey.border : activeBorderColor}
      {...rest}
    />
  )
)`
  height: ${(props) => props.height};
  font-weight: ${(props) => (props.isDisabled ? 'normal' : 'bold')};
  text-transform: ${(props) => props.textTransform || 'capitalize'};
  white-space: nowrap;
  cursor: ${(props) => (props.isDisabled ? 'unset' : 'pointer')};
  letter-spacing: 0.15rem;
  min-width: 0;

  &:hover {
    color: ${(props) =>
      props.isDisabled && props.activeColor && theme.palette.white.main};
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

const CustomSwitcher = ({
  firstHalfIsActive,
  changeHalf,
  firstHalfText,
  firstHalfStyleProperties,
  secondHalfText,
  secondHalfStyleProperties,
  buttonHeight,
  containerStyles,
  theme,
}: {
  firstHalfIsActive: boolean
  changeHalf: () => void
  firstHalfText: string
  firstHalfStyleProperties: CSSProperties
  secondHalfText: string
  secondHalfStyleProperties: CSSProperties
  buttonHeight: string
  containerStyles: CSSProperties
  theme: Theme
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
        {...secondHalfStyleProperties}
      >
        {secondHalfText}
      </SwitcherHalf>
    </div>
  )
}

export default CustomSwitcher
