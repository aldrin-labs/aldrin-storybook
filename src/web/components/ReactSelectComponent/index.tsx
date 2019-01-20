import React, { CSSProperties, Component } from 'react'
import SelectReact, { components } from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import { OptionProps } from 'react-select/lib/types'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import { IProps } from './index.types'
import { withTheme } from '@material-ui/styles'
import ForwarderRefHoc from '@components/ForwardedRefHOC/ForwarderRef'

class ReactSelectComponent extends Component<IProps> {
  render() {
    const {
      asyncSelect,
      theme,
      controlStyles,
      menuStyles,
      menuListStyles,
      optionStyles,
      clearIndicatorStyles,
      dropdownIndicatorStyles,
      valueContainerStyles,
      singleValueStyles,
      placeholderStyles,
      inputStyles,
      multiValueStyles,
      multiValueLabelStyles,
      multiValueRemoveStyles,
      indicatorSeparatorStyles,
      loadingIndicatorStyles,
      noOptionsMessageStyles,
      menuPortalStyles,
      forwardedRef,
      ...otherProps
    } = this.props

    const textColor: string = theme.typography.body2.color
    const fontFamily: string = theme.typography.fontFamily

    const background: string = theme.palette.background.default

    const customStyles = {
      control: () => {
        return {
          position: 'relative',
          boxSizing: 'border-box',
          cursor: 'default',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          outline: '0',
          transition: 'all 100ms',
          backgroundColor: 'transparent',
          minHeight: '0.8em',
          border: 'none',
          width: '100%',
          ...controlStyles,
        }
      },
      menu: (base: CSSProperties) => ({
        ...base,
        backgroundColor: background,
        zIndex: 10,
        color: textColor,
        fontFamily: theme.typography.fontFamily,
        ...menuStyles,
      }),
      menuPortal: (base: CSSProperties) => ({
        ...base,
        ...menuPortalStyles,
      }),
      menuList: (base: CSSProperties) => ({
        ...base,
        ['::-webkit-scrollbar']: {
          width: '3px',
          height: '6px',
        },
        ['::-webkit-scrollbar-track']: {
          background: 'rgba(45, 49, 54, 0.1)',
        },
        ['::-webkit-scrollbar-thumb']: {
          background: theme.palette.secondary.main,
        },
        color: textColor,
        fontFamily: theme.typography.fontFamily,
        ...menuListStyles,
      }),
      option: (base: CSSProperties, state: OptionProps) => ({
        ...base,
        color: textColor,
        fontSize: '1em',
        fontFamily: fontFamily,
        backgroundColor: state.isSelected
          ? theme.palette.action.selected
          : // ? hexToRgbAWithOpacity(theme.palette.primary.contrastText, 0.2)
          state.isFocused
          ? theme.palette.action.hover
          : // ? hexToRgbAWithOpacity(theme.palette.primary.contrastText, 0.1)
            background,
        [':active']: null,
        ...optionStyles,
      }),
      clearIndicator: (base: CSSProperties) => {
        return {
          display: 'flex',
          width: '20px',
          boxSizing: 'border-box',
          color: textColor,
          padding: '2px',
          transition: 'color 150ms',
          ...clearIndicatorStyles,
        }
      },
      dropdownIndicator: (base: CSSProperties) => ({
        color: textColor,
        display: 'flex',
        width: '19px',
        boxSizing: 'border-box',
        padding: '2px',
        ...dropdownIndicatorStyles,
      }),
      valueContainer: (base: CSSProperties) => ({
        ...base,
        paddingLeft: 0,
        fontFamily: theme.typography.fontFamily,
        ...valueContainerStyles,
      }),
      singleValue: (base: CSSProperties) => ({
        ...base,
        color: textColor,
        marginLeft: '0',
        ...singleValueStyles,
      }),
      placeholder: (base: CSSProperties) => ({
        ...base,
        fontFamily: theme.typography.fontFamily,
        marginLeft: 0,
        ...placeholderStyles,
      }),
      input: (base: CSSProperties) => ({
        ...base,
        color: textColor,
        fontFamily: theme.typography.fontFamily,
        ...inputStyles,
      }),
      multiValue: (base: CSSProperties) => ({
        ...base,
        [':hover']: {
          borderColor: theme.palette.secondary.main,
        },
        color: textColor,
        borderRadius: '3px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.grey[900],
        ...multiValueStyles,
      }),
      multiValueLabel: (base: CSSProperties) => ({
        ...base,
        color: textColor,
        ...multiValueLabelStyles,
      }),
      multiValueRemove: (base: CSSProperties) => ({
        ...base,
        [':hover']: {
          color: textColor,
          backgroundColor: theme.palette.secondary.main,
          ...multiValueRemoveStyles,
        },
      }),
      indicatorSeparator: () => ({
        display: 'none',
        ...indicatorSeparatorStyles,
      }),
      loadingIndicator: (base: CSSProperties) => ({
        ...base,
        display: 'none',
        color: textColor,
        fontFamily: theme.typography.fontFamily,
        ...loadingIndicatorStyles,
      }),
      noOptionsMessage: (base: CSSProperties) => ({
        ...base,
        color: textColor,
        fontFamily: theme.typography.fontFamily,
        ...noOptionsMessageStyles,
      }),
    }

    if (asyncSelect) {
      return (
        <AsyncSelect
          ref={forwardedRef}
          className="custom-async-select-box"
          classNamePrefix="custom-async-select-box"
          styles={customStyles}
          components={{ DropdownIndicator }}
          {...otherProps}
        />
      )
    }

    return (
      <SelectReact
        ref={forwardedRef}
        className="custom-select-box"
        classNamePrefix="custom-select-box"
        styles={customStyles}
        components={{ DropdownIndicator }}
        {...otherProps}
      />
    )
  }
}

const DropdownIndicator = (props: object) =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <SvgIcon
        src={dropDownIcon}
        width={19}
        height={19}
        style={{
          verticalAlign: 'middle',
        }}
      />
    </components.DropdownIndicator>
  )

export default ForwarderRefHoc(withTheme()(ReactSelectComponent))
