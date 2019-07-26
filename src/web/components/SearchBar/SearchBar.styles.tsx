import styled from 'styled-components'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

export const SearchBarPanel = styled.div`
    position: relative;
    border-radius: 50px;
    background-color: #333;
    margin-right: 0 18px 0  0;
    width: 100%;
`
export const SearchBarIcon = styled(SearchIcon)`
    width: 80px;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    /* pointerEvents: 'none'; */
`
export const SearchInputBase = styled(InputBase)`
    color: inherit;
    width: 100%;
    padding: 10px,
    width: 100%;
    /* transition: theme.transitions.create('width'), */
`
