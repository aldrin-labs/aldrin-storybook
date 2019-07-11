import React, { Component } from 'react'
import { SelectCustom, CustomOption } from './SingleSelect.styles'

// const Checkbox = (props) => (
//   <div>
//     {' '}
//     In days_{' '}
//     <input style={{ border: '1px solid red' }} type="text"  />
//   </div>
// )

const rebalanceOptions = [
  { value: 'daily', label: 'daily', color: '#165BE0', isFixed: true },
  { value: 'weekly', label: 'Weekly', color: '#165BE0' },
  { value: 'bi-weekly', label: 'Bi-Weekly', color: '#165BE0' },
  { value: 'monthly', label: 'Monthly', color: '#165BE0' },
  // { value: 'Checkbox', label: <Checkbox/>, color: '#D93B28' },
  { value: 'stop-rebalance', label: 'Stop Rebalance', color: '#D93B28' },
]
// 'Every ___ Days',

Option = ({ label }) => <CustomOption>{label}</CustomOption>

const customStyles = {
  singleValueStyles: (base) => ({
    ...base,
    color: '#165BE0',
    fontSize: '11px',
    padding: '0',
  }),
  indicatorSeparator: (base) => ({
    ...base,
    color: 'orange',
    background: 'transparent',
  }),

  control: (base, state) => ({
    ...base,
    background: 'transparent',
    border: 'none',
    width: 100,
    border: state.isFocused ? 0 : 0,
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: state.isFocused ? 0 : 0,
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: 120,
    padding: '5px 8px',
    borderRadius: '14px',
  }),
  container: (base) => ({
    ...base,
    background: 'transparent',
    padding: 0,
    color: '#165BE0',
    '&:focus': {
      border: '0 solid transparent',
      borderColor: 'transparent',
      boxShadow: '0 0 0 1px transparent',
    },
  }),
}

type State = {
  isClearable: boolean
  isDisabled: boolean
  isLoading: boolean
  isRtl: boolean
  isSearchable: boolean
}

export default class SingleSelect extends Component<State> {
  state = {
    isClearable: false,
    isDisabled: false,
    isLoading: false,
    isRtl: false,
    isSearchable: false,
  }

  toggleClearable = () =>
    this.setState((state) => ({ isClearable: !state.isClearable }))
  toggleDisabled = () =>
    this.setState((state) => ({ isDisabled: !state.isDisabled }))
  toggleLoading = () =>
    this.setState((state) => ({ isLoading: !state.isLoading }))
  toggleRtl = () => this.setState((state) => ({ isRtl: !state.isRtl }))
  toggleSearchable = () =>
    this.setState((state) => ({ isSearchable: !state.isSearchable }))
  render() {
    const {
      isClearable,
      isSearchable,
      isDisabled,
      isLoading,
      isRtl,
    } = this.state

    const { setRebalanceTimer } = this.props
    return (
      <SelectCustom
        onChange={this.setRebalanceTimer}
        className="basic-single"
        classNamePrefix="select"
        defaultValue={rebalanceOptions[0]}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name="rebalance"
        options={rebalanceOptions}
        components={{ Option }}
        styles={customStyles}
      />
    )
  }
}
