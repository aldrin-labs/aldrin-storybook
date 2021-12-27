import styled from "styled-components";

export const Navbar = styled.ul`
    display: flex;
    list-style: none;
    text-align: center;
    justify-content: center;
`

export const NavbarItem = styled.li`
    margin-right: 2rem;
    &:last-child {
        margin-right: 0;
    }
    font-size: 2rem;
`
