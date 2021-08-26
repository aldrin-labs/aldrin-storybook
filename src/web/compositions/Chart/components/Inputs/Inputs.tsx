import React from 'react'

import Loupe from '@icons/search.svg'
import { Theme } from '@sb/types/materialUI'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Input, TextButton } from '@sb/compositions/Rebalance/Rebalance.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { SearchInput } from './Inputs.styles'
import { ImagesPath } from './Inputs.utils'

const InputWithComponent = ({
  theme,
  type = 'text',
  value,
  onChange,
  autoFocus = false,
  disabled = false,
  placeholder = '',
  ComponentToShow,
  style = {},
  containerStyle,
  autoComplete = 'off',
  onKeyDown = () => {},
}: {
  type?: string
  value: string
  onChange: any
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  ComponentToShow: any
  style?: any
  containerStyle?: any
  autoComplete?: string
  onKeyDown?: (e: any) => void
  theme: Theme
}) => {
  return (
    <RowContainer
      style={{ position: 'relative', width: '100%', ...containerStyle }}
    >
      <Input
        type={type}
        value={value}
        autoFocus={autoFocus}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
        autoComplete={autoComplete}
        disabled={disabled}
        onKeyDown={onKeyDown}
      />
      <div
        style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {ComponentToShow}
      </div>
    </RowContainer>
  )
}

const InputWithEye = ({
  showPassword,
  onEyeClick,
  theme,
  ...props
}: {
  type: string
  value: string
  onChange: any
  placeholder: string
  showPassword: boolean
  onEyeClick: () => void
  style?: any
  containerStyle?: any
  autoComplete?: string
  onKeyDown?: (e: any) => void
  theme: Theme
}) => {
  return (
    <InputWithComponent
      theme={theme}
      autoFocus={true}
      ComponentToShow={
        <img
          style={{
            padding: '1.6rem 2rem 1.4rem 2rem',
            cursor: 'pointer',
            height: '4.5rem',
          }}
          onClick={onEyeClick}
          src={showPassword ? ImagesPath.closedEye : ImagesPath.eye}
          alt="eye"
        />
      }
      {...props}
    />
  )
}

const InputWithPaste = ({
  onPasteClick,
  theme,
  ...props
}: {
  type?: string
  disabled?: boolean
  autoFocus?: boolean
  value: string
  onChange: any
  placeholder: string
  onPasteClick: () => void
  style?: any
  autoComplete?: string
  containerStyle?: any
  onKeyDown?: (e: any) => void
  theme: Theme
}) => {
  return (
    <InputWithComponent
      theme={theme}
      ComponentToShow={
        <TextButton
          color={theme.customPalette.blue.new}
          onClick={() => {
            onPasteClick()
          }}
          style={{ padding: '1.2rem 2rem' }}
        >
          Paste
        </TextButton>
      }
      {...props}
    />
  )
}

const SearchInputWithLoupe = ({
  type,
  value,
  onChange,
  placeholder,
  ComponentToShow,
  theme,
}: {
  type: string
  value: string
  onChange: any
  placeholder: string
  ComponentToShow: any
  theme: Theme
}) => {
  return (
    <RowContainer style={{ position: 'relative', width: '100%' }}>
      <SearchInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <div
        style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-40%)',
        }}
      >
        {ComponentToShow}
      </div>
    </RowContainer>
  )
}

const InputWithSearch = ({
  onSearchClick,
  theme,
  ...props
}: {
  type: string
  value: string
  onChange: any
  placeholder: string
  onSearchClick: () => void
  theme: Theme
}) => {
  return (
    <SearchInputWithLoupe
      theme={theme}
      ComponentToShow={
        <SvgIcon
          style={{
            width: '1.5rem',
            height: 'auto',
            cursor: 'pointer',
          }}
          onClick={onSearchClick}
          src={Loupe}
        />
      }
      {...props}
    />
  )
}


export {
  InputWithEye,
  InputWithPaste,
  InputWithSearch,
}
export default InputWithComponent
