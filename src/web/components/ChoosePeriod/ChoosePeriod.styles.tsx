import styled from 'styled-components'

import { Grid, Typography } from '@material-ui/core'

export const ChoosePeriodWrapper = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  ${props => !props.isTableCalendar && {
    padding: '.5rem .825rem',
    background: '#fff',
    border: '.2rem solid #e0e5ec',
    boxShadow: '0 0 2rem rgba(8, 22, 58, 0.1)',
    borderRadius: '2rem'
  }}
`

export const ChoosePeriodButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.2rem;
  border: 1.5px solid #165be0;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  padding: 0 1.8rem;
  min-height: 2.5rem;
  font-weight: 700;
  cursor: pointer;

  outline: none;
  box-shadow: none;

  color: ${(props) => (props.active ? '#fff' : '#165be0')};
  background-color: ${(props) => (props.active ? '#165be0' : 'transparent')};

  &:not(:last-child) {
    margin-right: .75rem;
  }

  transition: all 0.375s ease-in-out;

  @media only screen and (min-width: 2560px) {
    border-radius: 1.5rem;
  }
`
export const ChoosePeriodArrow = styled(ChoosePeriodButton)`
  background-color: #165be0;
`

export const ChoosePeriodTypography = styled(Typography)`
  font-family: 'DM Sans';
  font-size: 1.175rem;
  line-height: 114.5%;

  color: #16253D;
  margin-right: 1.5rem;
`

export const DatePickerWrapper = styled.div`
  & .DateRangePicker {
    border-radius: 1.2rem;
    border: 1.5px solid #165be0;
  }

  & .DateRangePickerInput {
    display: flex;
    align-items: center;
  }

  & .DateRangePickerInput.DateRangePickerInput__withBorder,
  & .DateRangePickerInput .DateInput,
  & .DateRangePickerInput .DateInput .DateInput_input {
    background: transparent;
    border: none;
    border-radius: 0;
  }

  & .DateInput {
    width: 9.5rem;

    .DateInput_input {
      padding: 0.21rem 1rem 0.21rem 1.25rem;
    }

    &:last-child {
      width: 9.75rem;

      .DateInput_input {
        padding: 0.21rem 1rem;
      }
    }
  }
  & .DateInput_input {
    font-family: 'DM Sans';
    font-size: 1.25rem;
    font-weight: 700;
  }

  @media only screen and (min-width: 2560px) {
    & .DateInput {
      .DateInput_input {
        padding: .5rem 1rem .5rem 1.25rem;
      }

      &:last-child .DateInput_input {
        padding: .5rem 1rem;
      }
    }
    & .DateRangePicker {
      border-radius: 1.5rem;
    }
  }
`
