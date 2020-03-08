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
  state = {
    open: false,
  }

  handleToggle = () => {
    const { selectedMenu, selectActiveMenu, id } = this.props

    // closing if click second time
    if (selectedMenu === id) {
      selectActiveMenu('')
    }

    if (selectedMenu !== id) {
      selectActiveMenu(id)
    }
  }

  handleClose = () => {
    const { selectActiveMenu } = this.props
    selectActiveMenu('')
  }

  render() {
    const { selectedMenu, id } = this.props

    return (
      <StyledDropdown
        // onMouseEnter={this.handleToggle}
        // onMouseLeave={this.handleClose}
        key={`${id}-${selectedMenu}`}
      >
        <StyledButton
          disableRipple={false}
          aria-controls={this.props.id}
          aria-haspopup="true"
          id={id}
          onClick={this.handleToggle}
        >
          {this.props.buttonText}
        </StyledButton>

        <StyledPaper
          style={{ display: selectedMenu === id ? 'block' : 'none' }}
        >
          <MenuList style={{ padding: 0 }}>
            {this.props.items.map(({ icon, text, to, style, ...events }) => (
              <StyledMenuItem disableRipple disableGutters={true} key={text}>
                <StyledLink
                  to={to}
                  key={`${text}-link`}
                  onClick={this.handleClose}
                  {...events}
                >
                  {/* {icon} */}
                  <StyledMenuItemText style={style} key={`${text}-text`}>
                    {text}
                  </StyledMenuItemText>
                </StyledLink>
              </StyledMenuItem>
            ))}
          </MenuList>
        </StyledPaper>
      </StyledDropdown>
    )
  }
}
