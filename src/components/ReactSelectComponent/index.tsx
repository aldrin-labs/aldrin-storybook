import React, { CSSProperties, Component } from 'react'
import SelectReact, { components } from 'react-select'
import AsyncSelect from 'react-select/lib/Async';
import { OptionProps } from 'react-select/lib/types'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import { IProps } from './index.types'
import withTheme from '@material-ui/core/styles/withTheme'
import { hexToRgbAWithOpacity } from '@styles/helpers'

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
      ...otherProps
    } = this.props

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
          ...controlStyles,
        }
      },
      menu: (base: CSSProperties) => ({
        ...base,
        backgroundColor: theme.palette.grey[800],
        minWidth: '250px',
        ...menuStyles,
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
        ...menuListStyles,
      }),
      option: (base: CSSProperties, state: OptionProps) => ({
        ...base,
        color: theme.palette.primary.contrastText,
        fontSize: '1.5em',
        fontFamily: 'Roboto',
        backgroundColor: state.isSelected
          ? hexToRgbAWithOpacity(theme.palette.primary.contrastText, 0.2)
          : state.isFocused
            ? hexToRgbAWithOpacity(theme.palette.primary.contrastText, 0.1)
            : theme.palette.grey[800],
        [':active']: null,
        ...optionStyles,
      }),
      clearIndicator: (base: CSSProperties) => {
        return {
          display: 'flex',
          width: '20px',
          boxSizing: 'border-box',
          color: theme.palette.primary.contrastText,
          padding: '2px',
          transition: 'color 150ms',
          ...clearIndicatorStyles,
        }
      },
      dropdownIndicator: (base: CSSProperties) => ({
        display: 'flex',
        width: '19px',
        boxSizing: 'border-box',
        padding: '2px',
        ...dropdownIndicatorStyles,
      }),
      valueContainer: (base: CSSProperties) => ({
        ...base,
        paddingLeft: 0,
        ...valueContainerStyles,
      }),
      singleValue: (base: CSSProperties) => ({
        ...base,
        color: theme.palette.primary.contrastText,
        marginLeft: '0',
        ...singleValueStyles,
      }),
      placeholder: (base: CSSProperties) => ({
        ...base,
        marginLeft: 0,
        ...placeholderStyles,
      }),
      input: (base: CSSProperties) => ({
        ...base,
        color: theme.palette.primary.contrastText,
        ...inputStyles,
      }),
      multiValue: (base: CSSProperties) => ({
        ...base,
        [':hover']: {
          borderColor: theme.palette.secondary.main,
        },
        color: theme.palette.primary.contrastText,
        borderRadius: '3px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.grey[900],
        ...multiValueStyles,
      }),
      multiValueLabel: (base: CSSProperties) => ({
        ...base,
        color: theme.palette.primary.contrastText,
        ...multiValueLabelStyles,
      }),
      multiValueRemove: (base: CSSProperties) => ({
        ...base,
        [':hover']: {
          color: theme.palette.primary.contrastText,
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
          ...loadingIndicatorStyles,
        }),
    }

    if (asyncSelect) {
      return (
        <AsyncSelect
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

export default withTheme()(ReactSelectComponent)
