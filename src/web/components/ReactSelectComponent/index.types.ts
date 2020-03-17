import { CSSProperties } from 'react'
import { WithTheme } from '@material-ui/core'
import { OptionProps } from 'react-select/lib/types'

type AdditionalProps = WithTheme & OptionProps

export interface IProps extends AdditionalProps {
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
  noOptionsMessage: CSSProperties
  inputValue: string | any
}
