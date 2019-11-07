import React from 'react'
import styled from 'styled-components'

import { Grid, Typography } from '@material-ui/core'

export const ChoosePeriodWrapper = styled(({ isTableCalendar, ...rest }) => (
  <Grid {...rest} />
))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  ${(props) =>
    !props.isTableCalendar && {
      padding: '.5rem .825rem',
      background: '#fff',
      border: '.1rem solid #e0e5ec',
      boxShadow: '0 0 2rem rgba(8, 22, 58, 0.1)',
      borderRadius: '2rem',
    }}
`

export const ChoosePeriodButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  padding: 0 1.2rem;
  min-height: 2.5rem;
  font-weight: 400;
  cursor: pointer;

  outline: none;
  box-shadow: none;
  white-space: nowrap;

  color: ${(props) => (props.active ? '#fff' : '#7284A0')};
  background-color: ${(props) => (props.active ? '#0B1FD1' : 'transparent')};
  border: 1.3px solid ${(props) => (props.active ? '#0B1FD1' : '#E0E5EC')};

  &:not(:last-child) {
    margin-right: 0.75rem;
  }

  transition: all 0.375s ease-in-out;

  @media only screen and (min-width: 1920px) {
    font-size: 0.9rem;
  }

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

  color: #16253d;
  margin-right: 1.5rem;
`

export const DatePickerWrapper = styled.div`
  & .DateRangePicker {
    border-radius: 0.5rem;
    border: 1.35px solid #165be0;
  }

  & .DateRangePickerInput {
    display: flex;
    align-items: center;

    &_calendarIcon {
      padding: 0px;

      &_svg {
        margin-right: 5px;
        fill: #5c8cea;
        height: 13px;
        width: 12px;
        outline: 0;
      }
    }
  }

  & .DateRangePickerInput.DateRangePickerInput__withBorder,
  & .DateRangePickerInput .DateInput,
  & .DateRangePickerInput .DateInput .DateInput_input {
    background: transparent;
    border: none;
    border-radius: 0;
  }

  & .DateInput_input {
    font-family: 'DM Sans';
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 18px;
  }

  @media only screen and (min-width: 1024px) {
    & .DateInput {
      width: 7.9rem;

      .DateInput_input {
        padding: 0.5rem 0.9rem 0.11rem 0.5rem;
        text-transform: uppercase;
        text-align: center;
        font-size: 9px;
      }
    }
  }

  @media only screen and (min-width: 1920px) {
    & .DateInput {
      width: 12rem;

      .DateInput_input {
        font-size: 1.2rem;
      }
    }
  }

  @media only screen and (min-width: 2560px) {
    & .DateInput {
      .DateInput_input {
        padding: 0.5rem 1rem 0.5rem 1.25rem;
      }

      &:last-child .DateInput_input {
        padding: 0.5rem 1rem;
      }
    }
    & .DateRangePicker {
      border-radius: 1.5rem;
    }
  }
`
