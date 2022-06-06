import React, { CSSProperties } from 'react'

import { SwitcherHalf } from './styles'

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
  needBorder: boolean
}) => {
  return (
    <div style={{ display: 'inline-block', ...containerStyles }}>
      <SwitcherHalf
        isFirstHalf
        key="firstHalf"
        isDisabled={!firstHalfIsActive}
        onClick={() => !firstHalfIsActive && changeHalf()}
        height={buttonHeight}
        width="50%"
        needBorderRadius
        needBorder
        {...firstHalfStyleProperties}
      >
        {firstHalfText}
      </SwitcherHalf>
      <SwitcherHalf
        key="secondHalf"
        isDisabled={firstHalfIsActive}
        onClick={() => firstHalfIsActive && changeHalf()}
        height={buttonHeight}
        width="50%"
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
