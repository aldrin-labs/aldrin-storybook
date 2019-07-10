import styled from 'styled-components'
import { InputBase } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

export const SearchIconCustom = styled(SearchIcon)`
  /* position: absolute;
  margin-top: 7px;
  right: 36px;
  color: #c4c4c4;
  width: 18px; */
  height: '100%';
  position: 'absolute';
  pointer-events: 'none';
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
`
export const InputBaseCustom = styled(InputBase)`
  width: ${(props) => props.width || `100%`};
  height: ${(props) => props.height};
  font-size: ${(props) => props.fontSize};
  background: #f2f4f6;
  border-radius: ${(props) => props.borderRadius};
  padding: 4px 15px;
`

/*


  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },


*/
