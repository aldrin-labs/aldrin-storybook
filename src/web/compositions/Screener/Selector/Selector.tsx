import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
// import { Range } from 'rc-slider'
// import 'rc-slider/assets/index.css'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'

import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@sb/components/SvgIcon/'
import { IProps, IState } from './Selector.types'
import { data } from './selectsData'




// TODO: Update Selector types

const initialState = {
  industry: [],

  marketCapSliderValues: [50000, 50000000],

  lowerBoundSlider: 50000,
  upperBoundSlider: 50000000,
  changeInPercentage: '',
  simpleMovingAverage: '',
  closingPriceAverage: '',
  averageVolume10: '',
  averageVolume30: '',
  averageVolume60: '',
  averageVolume90: '',

  averageVolumeOnBalance: '',
  low: '',
  high: '',

  changeInPercentageInput: '',
  simpleMovingAverageInput: '',
  closingPriceAverageInput: '',
  averageVolume10Input: '',
  averageVolume30Input: '',
  averageVolume60Input: '',
  averageVolume90Input: '',

  averageVolumeOnBalanceInput: '',

  showFilters: false,
}

export default class ScreenerSelect extends React.Component<IProps, IState> {
  state: IState = Object.assign({}, initialState)

  changeInPercentageRef = React.createRef()
  simpleMovingAverageRef = React.createRef()
  closingPriceAverageRef = React.createRef()
  averageVolume10Ref = React.createRef()
  averageVolume30Ref = React.createRef()
  averageVolume60Ref = React.createRef()
  averageVolume90Ref = React.createRef()

  averageVolumeOnBalanceRef = React.createRef()

  componentWillMount = () => {
    const savedState = JSON.parse(localStorage.getItem('savedState'))

    if (savedState) {
      this.loadValuesFromLocalStorage()
    }
  }

  lowerBoundSliderChange = (e) => {
    if (!/^([0-9]+|)$/.test(e.target.value)) {
      return
    }

    const value = +e.target.value

    this.setState((prevState) => ({
      lowerBoundSlider: value,
      marketCapSliderValues: [value, prevState.marketCapSliderValues[1]],
    }))
  }

  upperBoundSliderChange = (e) => {
    if (!/^([0-9]+|)$/.test(e.target.value)) {
      return
    }

    const value = +e.target.value

    this.setState((prevState) => ({
      upperBoundSlider: value,
      marketCapSliderValues: [prevState.marketCapSliderValues[0], value],
    }))

    // this.setState((prevState) => ({
    //   upperBoundSlider: e.target.value,
    //   // marketCapSlider: [prevState.marketCapSlider[0], +e.target.value],
    // }))
  }

  handleSliderChange = (value) => {
    this.setState({
      marketCapSliderValues: value,
      lowerBoundSlider: value[0],
      upperBoundSlider: value[1],
    })
  }

  handleSelectChangeWithInput(
    name: string,
    optionSelected: { label: string; value: string } | null,
    actionObj: { action: string }
  ) {
    const value = optionSelected ? optionSelected : ''

    console.log('action: ', actionObj)

    switch (actionObj.action) {
      case 'clear': {
        this.setState(
          {
            [name]: value,
            [`${name}Input`]: '',
          },
          () => {
            console.log(this.state)
          }
        )

        return
      }
      case 'select-option': {
        this.setState(
          {
            [name]: value,
          },
          () => {
            console.log(this.state)
          }
        )

        this[`${name}Ref`].current.focus()

        return
      }
      default:
        return
    }
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

  handleSelectChangeMaterial = (event: SyntheticEvent) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleInputChange = (event) => {
    const inputValue = event.target.value
    // TODO: But regex should be changed for multiple zeros catch

    if (!/^([0-9]+\.|[0-9]+\.[0-9]{1,2}|[0-9]+|)$/.test(inputValue)) {
      return
    }

    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        console.log(this.state)
      }
    )
  }

  handleToggleFilters = () => {
    this.setState((prevState) => ({ showFilters: !prevState.showFilters }))
  }

  handleSaveClick = () => {
    this.updateLocalStorage()
  }

  handleDeleteAllClick = () => {
    this.deleteCurrentValues()
  }

  deleteCurrentValues = () => {
    this.setState({ ...initialState, showFilters: true })
  }

  updateLocalStorage = () => {
    localStorage.setItem('savedState', JSON.stringify(this.state))
  }

  loadValuesFromLocalStorage = () => {
    const savedState = JSON.parse(localStorage.getItem('savedState'))

    this.setState(savedState)
  }

  render() {
    const { showFilters } = this.state

    return (
      <MainWrapper>
        <ToggleFiltersContainer onClick={this.handleToggleFilters}>
          Screener signals
          <SvgIcon
            src={sortIcon}
            width={12}
            height={12}
            style={{
              verticalAlign: 'middle',
              marginLeft: '4px',
              transform: showFilters ? 'rotate(180deg)' : null,
              transition: 'all 0.3s ease',
            }}
          />
        </ToggleFiltersContainer>
        <ButtonsContainer>
          <ActionButton onClick={this.handleSaveClick}>
            <SaveIcon />
          </ActionButton>
          <ActionButton
            isDeleteColor={true}
            onClick={this.handleDeleteAllClick}
          >
            <DeleteIcon />
          </ActionButton>
        </ButtonsContainer>
        <SContainer autoComplete="off" showFilters={showFilters}>
          <SColumnForm>
            <SFormControl>
              <SelectLabel>Industry</SelectLabel>
              <SSelect
                key="industry"
                value={this.state.industry}
                onChange={this.handleSelectChangeMaterial}
                inputProps={{
                  name: 'industry',
                  id: 'industry',
                }}
                multiple={true}
              >
                {data.industry.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </SSelect>
            </SFormControl>
            <SFormControl value={this.state.changeInPercentage}>
              <SelectLabel>Change %</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.changeInPercentage}
                options={data.changeInPercentage}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'changeInPercentage'
                )}
              />
              <Input
                name="changeInPercentageInput"
                onChange={this.handleInputChange}
                value={this.state.changeInPercentageInput}
                ref={this.changeInPercentageRef}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.simpleMovingAverage}>
              <SelectLabel>Simple Moving Average</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.simpleMovingAverage}
                options={data.simpleMovingAverage}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'simpleMovingAverage'
                )}
              />
              <Input
                name="simpleMovingAverageInput"
                onChange={this.handleInputChange}
                value={this.state.simpleMovingAverageInput}
                ref={this.simpleMovingAverageRef}
              />
            </SFormControl>
            <SFormControl value={this.state.closingPriceAverage}>
              <SelectLabel>Closing Price Average</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.closingPriceAverage}
                options={data.closingPriceAverage}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'closingPriceAverage'
                )}
              />
              <Input
                name="closingPriceAverageInput"
                onChange={this.handleInputChange}
                value={this.state.closingPriceAverageInput}
                ref={this.closingPriceAverageRef}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl>
              <SelectLabel>Market Cap Slider</SelectLabel>
              <STextField
                fullWidth
                select
                value={[{ label: 100, value: 200 }]}
                SelectProps={{
                  multiple: true,

                  MenuProps: {
                    PaperProps: {
                      style: {
                        background: '#ff',
                      },
                    },
                  },
                  renderValue: () =>
                    `${this.state.marketCapSliderValues[0]} -
                        ${this.state.marketCapSliderValues[1]}`,
                }}
              >
                <SliderContainer>
                  <SliderWrapper>
                    <SliderLabel>Market Cap Slider</SliderLabel>
                    <RangeSliderWrapper>
                      <Input
                        value={this.state.lowerBoundSlider}
                        onChange={this.lowerBoundSliderChange}
                      />
                      <RangeSlider
                        allowCross={false}
                        step={10000}
                        min={50000}
                        max={50000000}
                        value={this.state.marketCapSliderValues}
                        onChange={this.handleSliderChange}
                      />
                      <Input
                        value={this.state.upperBoundSlider}
                        onChange={this.upperBoundSliderChange}
                      />
                    </RangeSliderWrapper>
                    <SliderValueWrapper>
                      {`${this.state.marketCapSliderValues[0]} -
                        ${this.state.marketCapSliderValues[1]}`}
                    </SliderValueWrapper>
                  </SliderWrapper>
                </SliderContainer>
              </STextField>
            </SFormControl>

            <SFormControl value={this.state.averageVolumeOnBalance}>
              <SelectLabel>On-Balance Volume</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.averageVolumeOnBalance}
                options={data.averageVolumeOnBalance}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'averageVolumeOnBalance'
                )}
              />
              <Input
                name="averageVolumeOnBalanceInput"
                onChange={this.handleInputChange}
                value={this.state.averageVolumeOnBalanceInput}
                ref={this.averageVolumeOnBalanceRef}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.averageVolume10}>
              <SelectLabel>Average Volume 10</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.averageVolume10}
                options={data.averageVolume10}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'averageVolume10'
                )}
              />
              <Input
                name="averageVolume10Input"
                onChange={this.handleInputChange}
                value={this.state.averageVolume10Input}
                ref={this.averageVolume10Ref}
              />
            </SFormControl>

            <SFormControl value={this.state.averageVolume30}>
              <SelectLabel>Average Volume 30</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.averageVolume30}
                options={data.averageVolume30}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'averageVolume30'
                )}
              />
              <Input
                name="averageVolume30Input"
                onChange={this.handleInputChange}
                value={this.state.averageVolume30Input}
                ref={this.averageVolume30Ref}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.averageVolume60}>
              <SelectLabel>Average Volume 60</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.averageVolume60}
                options={data.averageVolume60}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'averageVolume60'
                )}
              />
              <Input
                name="averageVolume60Input"
                onChange={this.handleInputChange}
                value={this.state.averageVolume60Input}
                ref={this.averageVolume60Ref}
              />
            </SFormControl>

            <SFormControl value={this.state.averageVolume90}>
              <SelectLabel>Average Volume 90</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                value={this.state.averageVolume90}
                options={data.averageVolume90}
                onChange={this.handleSelectChangeWithInput.bind(
                  this,
                  'averageVolume90'
                )}
              />
              <Input
                name="averageVolume90Input"
                onChange={this.handleInputChange}
                value={this.state.averageVolume90Input}
                ref={this.averageVolume90Ref}
              />
            </SFormControl>
          </SColumnForm>
          <SColumnForm>
            <SFormControl value={this.state.low}>
              <SelectLabel>Low</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                options={data.low}
                value={this.state.low}
                onChange={this.handleSelectChangeWithoutInput.bind(this, 'low')}
              />
            </SFormControl>
            <SFormControl value={this.state.high}>
              <SelectLabel>High</SelectLabel>
              <SelectR
                isClearable
                placeholder=""
                options={data.high}
                value={this.state.high}
                onChange={this.handleSelectChangeWithoutInput.bind(
                  this,
                  'high'
                )}
              />
            </SFormControl>
          </SColumnForm>
        </SContainer>
      </MainWrapper>
    )
  }
}

// const customStyles = {
//   control: () => {
//     return {
//       position: 'relative',
//       boxSizing: 'border-box',
//       cursor: 'default',
//       display: 'flex',
//       flexWrap: 'wrap',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       outline: '0',
//       transition: 'all 100ms',
//       backgroundColor: 'transparent',
//       minHeight: '0.8em',
//       border: 'none',
//     }
//   },
//   menu: (base, state) => ({
//     ...base,
//     backgroundColor: '#424242',
//     minWidth: '250px',
//   }),
//   option: (base, state) => ({
//     ...base,
//     color: '#fff',
//     fontSize: '1.5em',
//     fontFamily: 'Roboto',
//     backgroundColor: state.isSelected
//       ? 'rgba(255, 255, 255, 0.2)'
//       : state.isFocused
//         ? 'rgba(255, 255, 255, 0.1)'
//         : '#424242',
//     [':active']: null,
//   }),
//   clearIndicator: (base, state) => {
//     return {
//       [':hover']: {
//         color: '#fff',
//       },
//       display: 'flex',
//       width: '19px',
//       boxSizing: 'border-box',
//       color: 'hsl(0, 0%, 80%)',
//       padding: '2px',
//       transition: 'color 150ms',
//     }
//   },
//   dropdownIndicator: (base, state) => ({
//     [':hover']: {
//       color: '#fff',
//     },
//     display: 'flex',
//     boxSizing: 'border-box',
//     color: 'hsl(0, 0%, 80%)',
//     transition: 'color 150ms',
//   }),
//   valueContainer: (base, state) => ({
//     ...base,
//     paddingLeft: 0,
//   }),
//   singleValue: (base, state) => ({
//     ...base,
//     color: '#fff',
//     marginLeft: '0',
//   }),
//   placeholder: (base, state) => ({
//     ...base,
//     marginLeft: 0,
//   }),
//   input: (base, state) => ({
//     ...base,
//     color: '#fff',
//   }),
//   indicatorSeparator: () => ({
//     display: 'none',
//   }),
// }
//
// const DropdownIndicator = (props) =>
//   components.DropdownIndicator && (
//     <components.DropdownIndicator {...props}>
//       <SvgIcon
//         src={dropDownIcon}
//         width={19}
//         height={19}
//         style={{
//           verticalAlign: 'middle',
//         }}
//       />
//     </components.DropdownIndicator>
//   )

const SContainer = styled.form`
  display: ${(props: { showFilters?: boolean }) =>
    props.showFilters ? 'flex' : 'none'};
`

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  position: static;
`

const Input = styled.input`
  box-sizing: border-box;
  border-bottom: 2px solid rgb(78, 216, 218);
  background: transparent;
  border-top: none;
  border-left: none;
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto;

  text-align: left;
  padding: 10px 0 0;
  color: rgb(255, 255, 255);

  font-size: 0.7em;
  line-height: 0.7em;
`

// TODO: remove any from the opacity & pointer-events props

const SFormControl = styled(FormControl)`
  width: 150px;
  min-height: 63px;

  & ${Input} {
    opacity: ${(props: { value?: boolean | string | string[] }) =>
      props.value && props.value!.hasOwnProperty('value') ? '1' : '0'};
  }

  & ${Input} {
    pointer-events: ${(props: { value?: boolean | string | string[] }) =>
      props.value && props.value!.hasOwnProperty('value') ? 'auto' : 'none'};
  }

  && {
    margin: 5px 10px;
  }
`

const SColumnForm = styled.div`
  display: flex;
  flex-direction: column;
`

const ToggleFiltersContainer = styled.div`
  font-family: Roboto;
  color: white;
  text-align: center;
  user-select: none;
  padding: 20px 20px 35px;
  width: 57vw;
`

const ButtonsContainer = styled.div`
  display: flex;
  user-select: none;
  flex-direction: column;
  position: absolute;
  top: 110px;
  right: 30px;
`

// TODO: Just a hack, replace it with the normal material-ui ovverriding withStyles
const SSelect = styled(Select)`
  && > div > div {
    min-height: 0.8em;
  }

  && svg {
    font-size: 1.7em;
    top: calc(50% - 12px);
  }

  && {
    font-size: 12px;
    margin-top: 0;
  }
`

const SelectR = styled(ReactSelectComponent)`
  font-family: Roboto;
  font-size: 12px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`

const SelectLabel = styled.label`
  font-size: 0.6em;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  line-height: 1;
`

const SliderWrapper = styled.div`
  width: 500px;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SliderLabel = styled.div`
  text-align: center;
  font-size: 0.6em;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  line-height: 1;
`

const RangeSliderWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 10px;

  ${Input} {
    margin: 0px 20px;
    width: 70px;
  }
`

// const RangeSlider = styled(Range)`
//   & ${`.rc-slider-track`} {
//     background-color: rgb(78, 216, 218);
//   }
//
//   & ${`.rc-slider-handle`} {
//     border-color: #fff;
//   }
// `

const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
`

const SliderValueWrapper = styled.div`
  text-align: center;
  color: #fff;
`

const STextField = styled(TextField)`
  && svg {
    font-size: 1.7em;
    top: calc(50% - 12px);
  }

  && > div {
    font-size: 12px;
    margin-top: 0;
  }
`

const ActionButton = styled.button`
  border: none;
  margin: 0;
  padding: 1.75px 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  outline: none;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  & svg {
    color: white;
    padding-bottom: 7px;
    width: 33px;
    height: 33px;
  }

  &:hover svg {
    color: ${(props: { isDeleteColor?: boolean }) =>
      props.isDeleteColor ? '#f44336' : '#4caf50'};
  }
`

const CheckBoxLabel = styled.label`
  color: #fff;
  font-family: Roboto;
  padding-left: 10px;
  padding-top: 1px;
`

const CheckBoxContainer = styled.div`
  display: flex;
`
