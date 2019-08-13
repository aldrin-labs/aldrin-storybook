import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const TransactionTablePrice = styled(Typography)`
    font-family: 'DM Sans';
    font-size: 1.2rem;
    line-height: 114.5%;
    letter-spacing: 1px;
    text-transform: uppercase;

    margin-top: .25rem;

    color: #ABBAD1;
`

export const TransactionTableCoin = styled(Grid)`
    width: 9rem;
`

export const TransactionTableResult = styled(TransactionTablePrice)`
    color: #2F7619;
`
