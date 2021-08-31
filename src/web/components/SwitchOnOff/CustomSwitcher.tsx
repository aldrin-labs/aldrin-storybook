import React, { CSSProperties } from 'react'
import { Theme } from '@material-ui/core'

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
