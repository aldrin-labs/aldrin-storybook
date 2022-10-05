export type LabelContainerProps = {
  background: string
  hoverBackground?: string
  hoverColor: string
}

export type SCheckboxProps = {
  color: string
  hoverColor: string
}

export type LabelProps = {
  color: string
  hoverColor: string
}

export type IconProps = {
  checked: boolean
  color: string
  hoverColor: string
}

export type ContainerProps = {
  width?: string
}

export type SortByLabelProps = {
  isActive: boolean
}

export type CheckboxContainerProps = {
  marginRight?: string
}

export type VariantType = {
  labelStyle: { backgroundColor: string; color: string }
  text: string
  hoverStyle: { backgroundColor: string; color: string }
  tooltipText?: any
  icon?: any
}

export type StyledTrackProps = {
  index: number
}
