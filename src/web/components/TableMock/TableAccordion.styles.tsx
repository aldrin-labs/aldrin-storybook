import styled from 'styled-components'
import { Typography, TableCell } from '@material-ui/core'

export const TypographyCoinName = styled(Typography)`
    /* display: list-item;
    list-style-type: disc;
    list-style-position: inside;
    list-style */
    color: '#ABBAD1';
    &:before {
    content: '\2022';
    color: red;
    font-weight: bold;
    display: inline-block;
    width: 2px;
    }
`


export const TableHeadFont = styled(TableCell)`
         color: #ABBAD1;
         text-transform: uppercase;
         font-weight: bold;
         font-size: 10px;
       `