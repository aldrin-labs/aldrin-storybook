import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const TransactionActions = styled.div`
    padding: 1.6rem 1.2rem;
    border-radius: 1.6rem;
    background: white;
    border: 2px solid #E0E5EC;
    box-shadow: 0px 0px 1.6rem rgba(10, 19, 43, 0.1);

    &:not(:last-child) {
        margin-bottom: 1.2rem;
    }
`

export const TransactionActionsTypography = styled(Typography)`
    font-family: 'DM Sans';
    font-size: 1.25rem;
    line-height: 104.5%;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;

    position: relative;
    top: 2px;
    left: 0;

    color: #7284A0;
`

export const TransactionActionsNumber = styled(Typography)`
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 2.5rem;
    line-height: 100%;

    letter-spacing: 1.5px;
    text-transform: uppercase;

    color: #16253D;
`

export const TransactionsActionsActionWrapper = styled(Grid)`
    &:not(:last-child) {
        padding-right: 1rem;
        border-right: 0.0625rem solid #E0E5EC;
    }

    &:last-child {
        padding-left: 1rem;
    }
`

export const TransactionActionsAction = styled.div`
    &:not(:last-child) {
        margin-bottom: 1rem;
        padding-bottom: .75rem;
        border-bottom: 0.0625rem solid #E0E5EC;
    }

    h6 {
        font-family: 'DM Sans';
        font-weight: bold;
        font-size: .9rem;
        line-height: 104.5%;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin: 0;
        margin-bottom: 1rem;

        color: #7284A0;
    }
`

export const TransactionActionsSubTypography = styled(Typography)`
    font-family: 'DM Sans';
    font-size: 1.33rem;
    font-weight: bold;
    line-height: 104.5%;
    display: flex;
    align-items: flex-end;
    text-align: center;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #16253d;

    span {
        display: inline-block;
        margin-left: .5rem;
        color: #2F7619;
        font-size: 1rem;
        letter-spacing: 1px;

        position: relative;
        top: 1px;
        left: 0;
    }
`
