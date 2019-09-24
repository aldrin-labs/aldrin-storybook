import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const TransactionTablePrice = styled(Typography)`
  font-family: 'DM Sans';
  font-size: 1.2rem;
  line-height: 114.5%;
  letter-spacing: 1px;
  text-transform: uppercase;

  margin-top: 0.25rem;

  color: #abbad1;
`

export const TransactionTableCoin = styled(Grid)`
  width: auto;
`

export const TransactionTableResult = styled(TransactionTablePrice)`
  color: #2f7619;
`

export const TransactionTableStatus = styled(TransactionTablePrice)`
  color: #7284a0;
  white-space: nowrap;
`
