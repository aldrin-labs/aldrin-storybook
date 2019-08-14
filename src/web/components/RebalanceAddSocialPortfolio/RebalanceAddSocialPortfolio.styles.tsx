import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const SocialPortfolioName = styled(Typography)`
    font-family: 'DM Sans';
    font-size: 2rem;
    line-height: 100%;

    letter-spacing: 0.5px;
    text-transform: uppercase;

    color: #16253D;
`
export const SocialPortfolioSubtitle = styled(Typography)`
    font-family: 'DM Sans';
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 114.5%;
    letter-spacing: 1px;
    text-transform: uppercase;

    color: #7284A0;
`

export const SocialPortfolioInfoBlock = styled(Grid)`
    width: 30%;
    padding: .75rem 0;
    text-align: center;
    font-family: 'DM Sans';
    text-transform: uppercase;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h4 {
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 114.5%;
        letter-spacing: 1px;
        color: #7284A0;
    }
    p {
        font-size: 1.75rem;
        line-height: 114.5%;
        letter-spacing: 1.5px;
        color: #16253D;
        margin-top: .75rem;
    }
`
