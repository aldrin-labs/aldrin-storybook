import * as React from 'react'
import styled from 'styled-components'
import SelectReact, { components } from 'react-select'
import { IProps, IState } from '../../ScreenerSearch/ScreenerSearch.types'
import { data } from '../../Selector/selectsData'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import SvgIcon from '@sb/components/SvgIcon/'

// TODO: Update types

export default class MarketSummarySearch extends React.Component<IProps, IState> {
  state: IState = {
    inputSearchArray: [],
    timeInterval: '',
  }

  handleMultiSelectSearchChange = (
    arrayOfObjectsValues: { value: string; label: string }[]
  ) => {
    const stringValues = arrayOfObjectsValues
      .map((elem) => {
        return elem['value']
      })
      .join()

    console.log(arrayOfObjectsValues)
    console.log(stringValues)

    this.onUpdateGlobalFilterValue(stringValues)
  }

  onUpdateGlobalFilterValue = (newSearchArrayInString) => {
    this.props.onChangeSearchArrayText(newSearchArrayInString)
  }

  handleSelectChangeWithoutInput(
    name: string,
    optionSelected: { label: string; value: string } | null
  ) {
    const value = optionSelected ? optionSelected : ''

    console.log(optionSelected)

    this.setState(
      {
        [name]: value,
      },
      () => {
        console.log(this.state)
      }
    )
  }

  render() {
    const { combinedTickerValues } = this.props

    return (
      <SearchWrapper>
        <InputWrapper>
          <SelectR
            styles={customStyles}
            placeholder="Search ticker..."
            isClearable
            isMulti
            options={combinedTickerValues}
            components={{ DropdownIndicator }}
            onChange={this.handleMultiSelectSearchChange.bind(this)}
          />
          <SelectR
            styles={customStyles}
            isClearable
            placeholder="Select time interval"
            value={this.state.timeInterval}
            options={data.timeInterval}
            components={{ DropdownIndicator }}
            onChange={this.handleSelectChangeWithoutInput.bind(
              this,
              'timeInterval'
            )}
          />
        </InputWrapper>
      </SearchWrapper>
    )
  }
}

const SearchWrapper = styled.div`
  width: 1370px;
  margin: 0 auto;
  padding: 20px 20px 0;
`

const InputWrapper = styled.div`
  display: flex;
`

const SelectR = styled(SelectReact)`
  min-width: 150px;
  font-family: Roboto;
  font-size: 12px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 1px solid #fff;
  }

  & + & {
    margin-left: 25px;
  }
`

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
    }
  },
  menu: (base, state) => ({
    ...base,
    backgroundColor: '#424242',
    minWidth: '250px',
  }),
  option: (base, state) => ({
    ...base,
    color: '#fff',
    fontSize: '1.5em',
    fontFamily: 'Roboto',
    backgroundColor: state.isSelected
      ? 'rgba(255, 255, 255, 0.2)'
      : state.isFocused
        ? 'rgba(255, 255, 255, 0.1)'
        : '#424242',
    [':active']: null,
  }),
  clearIndicator: (base, state) => {
    return {
      [':hover']: {
        color: '#fff',
      },
      display: 'flex',
      width: '20px',
      boxSizing: 'border-box',
      color: 'hsl(0, 0%, 80%)',
      padding: '2px',
      transition: 'color 150ms',
    }
  },
  dropdownIndicator: (base, state) => ({
    [':hover']: {
      color: '#fff',
    },
    display: 'flex',
    width: '20px',
    boxSizing: 'border-box',
    color: 'hsl(0, 0%, 80%)',
    padding: '2px',
    transition: 'color 150ms',
  }),
  valueContainer: (base, state) => ({
    ...base,
    paddingLeft: 0,
  }),
  singleValue: (base, state) => ({
    ...base,
    color: '#fff',
    marginLeft: '0',
  }),
  placeholder: (base, state) => ({
    ...base,
    marginLeft: 0,
  }),
  input: (base, state) => ({
    ...base,
    color: '#fff',
  }),
  multiValue: (base, state) => ({
    ...base,
    [':hover']: {
      borderColor: '#4ed8da',
    },

    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '3px',
    fontWeight: 'bold',
    backgroundColor: '#2a2d32',
  }),
  multiValueLabel: (base, state) => ({
    ...base,
    color: '#fff',
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    [':hover']: {
      color: '#fff',
      backgroundColor: '#4ed8da',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}

const DropdownIndicator = (props) =>
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
