import styled, { createGlobalStyle } from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const AccountsSlickWrapper = styled(Grid)`
    position: relative;
    display: flex;
    align-items: center;
`

export const TypographyAccountName = styled(Typography)`
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    letter-spacing: 1.5px;
    font-size: ${props => props.isSideNav ? '2rem' : '1.5rem'};
    line-height: 100%;
    text-transform: uppercase;
    text-align: center;
`
export const TypographyAccountMoney = styled(Typography)`
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 1.5px;
    font-size: ${props => props.isSideNav ? '1.25rem' : '1rem'};
    line-height: 100%;
    text-transform: uppercase;
    margin-top: ${props => props.isSideNav ? '1.5rem' : '1rem'};
    text-align: center;
`

export const AccountsSlickStyles = createGlobalStyle`
    .slick-slider {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 2rem 0;
    }
`
