export function handleSelectChangePrepareForFormik (name: string, optionSelected: { label: string; value: string }) {
  const { setFieldValue } = this.props
  const value = optionSelected ? optionSelected.value : ''
  setFieldValue(name, value);
}
