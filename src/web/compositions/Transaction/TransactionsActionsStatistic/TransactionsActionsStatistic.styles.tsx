import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const TransactionActions = styled.div`
  position: relative;
  padding: 1.6rem 1.2rem;
  border-radius: 1.6rem;
  background: white;
  border: 1px solid #e0e5ec;
  box-shadow: 0px 0px 1.6rem rgba(10, 19, 43, 0.1);

  &:not(:last-child) {
    margin-bottom: 1.2rem;
  }
`

export const TransactionActionsTypography = styled(Typography)`
  font-size: 1.1rem;
  line-height: 104.5%;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;

  position: relative;
  top: 2px;
  left: 0;

  color: #7284a0;

  @media only screen and (min-width: 2360px) {
    font-size: 1.1rem;
  }
`

export const TransactionActionsNumber = styled(Typography)`
  font-weight: bold;
  font-size: 2.5rem;
  line-height: 100%;

  letter-spacing: 1.5px;
  text-transform: uppercase;

  color: #16253d;

  @media only screen and (min-width: 2360px) {
    font-size: 2.5rem;
  }
`

export const TransactionsActionsActionWrapper = styled(Grid)`
  &:not(:last-child) {
    padding-right: 1rem;
    border-right: 0.0625rem solid #e0e5ec;
  }

  &:last-child {
    padding-left: 1rem;
  }
`

export const TransactionActionsAction = styled.div`
  &:not(:last-child) {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 0.0625rem solid #e0e5ec;
  }
`

export const TransactionActionsSubTypography = styled(Typography)`
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #16253d;
`

export const TransactionActionsHeading = styled(Typography)`
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;

  color: #7284a0;
`
