import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const SocialPortfolioChartWrapper = styled(Grid)`
    background: white;
    border: 2px solid #E0E5EC;

    box-shadow: 0px 0px 2rem rgba(10, 19, 43, 0.1);
    border-radius: 2rem;
    padding: 1.5rem 3rem;
`

export const SocialPortfolioCalendar = styled.div`
    border: 2px solid #E0E5EC;
    border-radius: 1.2rem;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 1rem;
    line-height: 114.5%;
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;
    
    color: #7284A0;
    padding: .375rem 0;
    width: 7.5rem;

    &:not(:last-child) {
        margin-right: 1rem;
    }
`

export const SocialPortfolioChartTypography = styled(Typography)`
    font-family: 'DM Sans';
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 114.5%;
    letter-spacing: 1px;
    text-transform: uppercase;

    color: #16253D;
`
