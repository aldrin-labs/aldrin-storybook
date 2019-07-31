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
    font-size: 1.175rem;
`

export const StyledDropdown = styled.div`
    position: relative;
    display: inherit;
    margin: .4rem;
    padding: .375rem .5rem;
`

export const StyledPaper = withStyles({
    root: {
        position: 'absolute',
        top: '49px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingLeft: '8px',
        paddingRight: '8px'
    }
})(Paper)

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
