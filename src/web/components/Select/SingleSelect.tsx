import React, { Component, Fragment } from 'react'

import Select from 'react-select'
// import { rebalanceOptions } from '../data';
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
  singleValue: (base) => ({ ...base, color: '#165BE0', fontSize: '11px', padding: '0' }),
  indicatorSeparator: (base) => ({ ...base, color: 'orange', background: 'transparent' }),
  control: (base) => ({
    ...base,
    background: 'transparent',
    border: 'none',
    width: 100,
    // :focus{
    //     border: '0 solid transparent',
    // }
  }),
  menu: (provided) => ({
    ...provided,
    width: 120,
    padding: '5px 8px',
    borderRadius: '14px',
    //background: 'transparent',
    //border: '1px solid green',
    //color: '#165BE0', //state.isSelected ? 'red' : 'blue',
  }),
  container: (base) => ({
    ...base,
    background: 'transparent',
    padding: 0,
    color: '#165BE0',
    // :focus{
    //     border: '0 solid transparent',
    // }
  }),

  // control: () => ({
  //   // none of react-select's styles are passed to <Control />
  //   width: 200,
  // }),
  // singleValue: (provided, state) => {
  //   const opacity = state.isDisabled ? 0.5 : 1
  //   const transition = 'opacity 300ms'

  //   return { ...provided, opacity, transition }
  // },
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
    return (
      <SelectCustom
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
        // theme={(theme) => ({
        //   ...theme,
        //   border: 0,
        //   colors: {
        //     ...theme.colors,
        //     primary25: 'E7ECF3',
        //     primary: '#E7ECF3',
        //   },
        //   color: 'orange',
        // })}
        components={{ Option }}
        styles={customStyles}
        // customStyle={{
        //   borderRadius: 4,
        //   color: 'red',
        //   background: 'red',
        //   fontSize: 13,
        //   marginBottom: '1em',
        //   marginTop: '1em',
        //   overflowX: 'auto',
        // }}
        // style={{ border: '1px solid transparent' }}
      />
    )
  }
}
