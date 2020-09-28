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

import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'

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
    const {
      page,
      selectedMenu,
      id,
      theme,
      component,
      onMouseOver,
      marketName,
      pathname,
      isActivePage,
    } = this.props
    return (
      <StyledDropdown
        theme={theme}
        // onMouseEnter={this.handleToggle}
        // onMouseLeave={this.handleClose}
        key={`${id}-${selectedMenu}`}
      >
        <NavLinkButton
          onMouseOver={onMouseOver}
          theme={theme}
          disableRipple={false}
          aria-controls={this.props.id}
          aria-haspopup="true"
          id={id}
          page={page}
          isActivePage={isActivePage}
          pathname={this.props.pathname}
          //onClick={this.handleToggle}
          component={component}
          marketName={marketName}
          style={{
            textTransform: 'none',
            padding: '0 1rem',
          }}
        >
          {this.props.buttonText}
        </NavLinkButton>

        <StyledPaper
          theme={theme}
          style={{ display: selectedMenu === id ? 'block' : 'none' }}
        >
          <MenuList style={{ padding: 0 }}>
            {this.props.items.map(({ icon, text, to, style, ...events }) => (
              <StyledMenuItem
                theme={theme}
                disableRipple
                disableGutters={true}
                key={text}
              >
                <StyledLink
                  theme={theme}
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
