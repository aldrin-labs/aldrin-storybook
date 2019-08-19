import styled from 'styled-components'

import { Grid } from '@material-ui/core'

export const ChoosePeriodWrapper = styled(Grid)`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem .5rem 0;
`

export const ChoosePeriodButton = styled.button`
    display: inline-block;
    border-radius: 1.2rem;
    border: 1.5px solid #165be0;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
    font-size:  1rem;
    padding: .75rem 2rem;
    font-weight: 700;
    cursor: pointer;
    
    outline: none;
    box-shadow: none;

    color: ${props => props.active ? '#fff' : '#165be0'};
    background-color: ${props => props.active ? '#165be0' : 'transparent'};

    margin-right: 1rem;

    transition: all .375s ease-in-out;
`

export const DatePickerWrapper = styled.div`
    & .DateRangePicker {
        border-radius: 1.2rem;
        border: 1.5px solid #165be0;
    }

    & .DateRangePickerInput.DateRangePickerInput__withBorder,
    & .DateRangePickerInput .DateInput, & .DateRangePickerInput .DateInput .DateInput_input {
        background: transparent;
        border: none;
        border-radius: 0;
    }

    & .DateInput {
        width: 9rem;
    }
    & .DateInput_input {
        font-family: 'DM Sans';
        font-size: 1.25rem;
        font-weight: 700;
        padding: .21rem 1rem;
    }
`
