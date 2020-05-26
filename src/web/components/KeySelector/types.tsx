export interface IProps {
  value: { value: string, label: string }
  options: { value: string, label: string }[]
  handleChange: (option: { value: string, label: string, hedgeMode: boolean, isFuturesWarsKey: boolean }) => Promise<any>
  selectStyles: object | undefined
  isAccountSelect: boolean | undefined
}
