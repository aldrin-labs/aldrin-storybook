import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {
    Paper,
    MenuItem,
    Button,
    withStyles
} from '@material-ui/core'

export const StyledLink = styled(NavLink)`
    color: #7284A0;
    padding: 6px 12px 6px 6px;
    font-size: 12px;
    display: flex;
    align-items: center;
    transition: all .5s ease-in-out;
    border-radius: 10px;
    text-decoration: none;
    width: 100%;

    &:hover {
        background-color: #E0E5EC;
        color: #165BE0;
    }
`

export const StyledButton = styled(Button)`
    font-size: 1.375rem;
    transition: .35s all; 

    @media(min-width: 2560px) {
        font-size: 1rem;
    }
`

export const StyledDropdown = styled.div`
    position: relative;
    display: inherit;
    margin: 0 .4rem;
    padding: 1rem .5rem;

    @media(min-width: 1921px) {
        padding: 1.15rem .5rem;
    }

    @media(min-width: 2560px) {
        padding: 1.25rem .5rem;
    }
`

export const StyledPaper = styled(Paper)`
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding-left: 8px;
    padding-right: 8px;

    @media(min-width: 1921px) {
        top: 63px;
    }

    @media(min-width: 2560px) {
        top: 80px;
    }
`

export const StyledMenuItem = withStyles({
    root: {
        '&:hover': {
            background: 'transparent'
        }
    }
})(MenuItem)

export const StyledMenuItemText = styled.span`
    display: inline-block;
    margin-left: .4rem;
`
