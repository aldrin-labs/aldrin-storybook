import styled from 'styled-components'
import { ReactSelectCustom } from '@sb/components/RebalanceInfoPanel/RebalanceInfoPanel.styles'
import {
    TransactionActionsNumber
} from './../TransactionsActionsStatistic/TransactionsActionsStatistic.styles'
import { Grid, Typography } from '@material-ui/core'

export const WinLossRatioWrapper = styled(Grid)`
    padding: 1.6rem 1.2rem;
    border-radius: 1.6rem;
    background: white;
    border: 2px solid #E0E5EC;
    box-shadow: 0px 0px 1.6rem rgba(10, 19, 43, 0.1);
`

export const WinLossRatioNumber = styled(TransactionActionsNumber)`
    margin: 1rem 0;
`

export const TypographyProfit = styled(Typography)`
    font-family: 'DM Sans';
    font-size: 1.2rem;
    line-height: 104.5%;
    letter-spacing: 1px;
    text-transform: uppercase;

    color: ${props => props.profit ? '#2f7619' : '#b93b2b'};
`

export const WinLossRatioChart = styled.div`
    width: 2.5rem;
    border-radius: 4rem;

    background: linear-gradient(#2f7619 ${props => props.win || 50}%, #b93b2b ${props => props.win || 50}%);
`

export const WinLossSelect = styled(ReactSelectCustom)`
    font-size: 1.25rem;
    margin-top: 3px;
    .custom-select-box__single-value {
        color: #165be0;
    }
`
