export interface Key {
  exchange: string
  name: string
  keyId: string
}

export interface IProps {
  value: { value: string, label: string }
  options: { value: string, label: string }[]
  handleChange: (option: { value: string, label: string }) => Promise<any>
  selectStyles: object | undefined
  isAccountSelect: boolean | undefined
}
