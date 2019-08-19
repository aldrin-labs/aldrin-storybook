import {
    withStyles
} from '@material-ui/core'
import styled from 'styled-components'

export const PortfolioSelectorPopupWrapper = styled.div`
    box-sizing: border-box;
    position: relative;

    span {
        cursor: pointer;
    }
`

export const PortfolioSelectorPopupMain = styled.div`
    position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 1.25rem;
    border-radius: 16px;
    background-color: #fff;
    z-index: 1010;
    color: ${props => props.theme.palette.text.dark};
    display: none;
    
    &.popup-visible {
        display: block;
    }

    .renameAccount-toggler, .deleteAccountDialog-toggler {
        padding: 1rem 10rem;
        cursor: pointer;
        display: block;
    }
    .renameAccount-toggler {
        padding-top: 1.5rem;
    }
    .deleteAccountDialog-toggler {
        padding-bottom: 1.5rem;
        color: ${props => props.theme.palette.price.decrease};
    }
`

export const PortfolioSelectorPopupMask = styled.div`
    display: ${props => props.visible ? 'block' : 'none'};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, .33);
    z-index: 1009;
`
