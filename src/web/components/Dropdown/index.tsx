import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { MenuList } from '@material-ui/core'
import {
  StyledDropdown,
  StyledPaper,
  StyledMenuItem,
  StyledMenuItemText,
  StyledLink,
  StyledButton,
} from './Dropdown.styles'

import { IProps } from './types'

@withRouter
export default class Dropdown extends React.Component<IProps> {
  static defaultProps = {
    items: [],
  }

  state = {
    open: false,
  }

  constructor(props: IProps) {
    super(props)

    this.handleToggle = this.handleToggle.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  render() {
    const { selectedMenu, id } = this.props;

    return (
      <StyledDropdown
        onMouseEnter={this.handleToggle}
        onMouseLeave={this.handleClose}
      >
        <StyledButton
          disableRipple={false}
          aria-controls={this.props.id}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          {this.props.buttonText}
        </StyledButton>

        <StyledPaper
          id={this.props.id}
          style={{ display: selectedMenu === id ? 'block' : 'none' }}
        >
          <MenuList>
            {this.props.items.map(({ icon, text, to }) => (
              <StyledMenuItem
                disableGutters={true}
              >
                <StyledLink to={to} onClick={this.handleClose}>
                  {icon}
                  <StyledMenuItemText>{text}</StyledMenuItemText>
                </StyledLink>
              </StyledMenuItem>
            ))}
          </MenuList>
        </StyledPaper>
      </StyledDropdown>
    )
  }

  handleToggle = () => {
    const { selectedMenu, selectActiveMenu, id } = this.props;

    if (selectedMenu !== id) {
      selectActiveMenu(id);
    }
  }
  handleClose = () => {
    const { selectActiveMenu } = this.props;
    selectActiveMenu('');
  }
}
