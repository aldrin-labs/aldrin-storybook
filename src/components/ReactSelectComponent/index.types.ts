import { CSSProperties } from 'react'
import { WithTheme } from '@material-ui/core'

export interface IProps extends WithTheme{
  asyncSelect: boolean
  controlStyles: CSSProperties
  menuStyles: CSSProperties
  menuListStyles: CSSProperties
  optionStyles: CSSProperties
  clearIndicatorStyles: CSSProperties
  dropdownIndicatorStyles: CSSProperties
  valueContainerStyles: CSSProperties
  singleValueStyles: CSSProperties
  placeholderStyles: CSSProperties
  inputStyles: CSSProperties
  multiValueStyles: CSSProperties
  multiValueLabelStyles: CSSProperties
  multiValueRemoveStyles: CSSProperties
  indicatorSeparatorStyles: CSSProperties
  loadingIndicatorStyles: CSSProperties
}
