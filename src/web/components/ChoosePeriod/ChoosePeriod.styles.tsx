import styled from 'styled-components'

import { Grid, withStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'

export const ChoosePeriodWrapper = styled(Grid)`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
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

export const ChoosePeriodDate = withStyles({
    root: {
        border: '2px solid #165be0',
        textTransform: 'uppercase'
    }
})(TextField)
