import * as React from 'react'
import { withRouter } from 'react-router-dom'
import {
    ClickAwayListener,
    MenuList
} from '@material-ui/core'
import {
    StyledDropdown,
    StyledPaper,
    StyledMenuItem,
    StyledMenuItemText,
    StyledLink,
    StyledButton
} from './Dropdown.styles'

import { IProps } from './types'

@withRouter
export default class Dropdown extends React.Component<IProps> {
    static defaultProps = {
        items: []
    }

    state = {
        open: false
    }

    constructor(props: IProps) {
        super(props)

        this.handleToggle = this.handleToggle.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    render() {
        return (
            <StyledDropdown>
                <StyledButton
                    aria-controls={this.props.id}
                    aria-haspopup="true"
                    onClick={this.handleToggle}
                >
                    {this.props.buttonText}
                </StyledButton>

                <StyledPaper id={this.props.id} style={{ display: this.state.open ? 'block' : 'none' }}>
                    <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                            {this.props.items.map(({ icon, text, to }) =>
                                <StyledMenuItem disableGutters={true}>
                                    <StyledLink to={to} onClick={this.handleClose}>
                                        {icon}
                                        <StyledMenuItemText>{text}</StyledMenuItemText>
                                    </StyledLink>
                                </StyledMenuItem>
                            )}
                        </MenuList>
                    </ClickAwayListener>
                </StyledPaper>
            </StyledDropdown>
        );
    }

    handleToggle() {
        this.setState({
            open: true
        })
    }
    handleClose() {
        this.setState({
            open: false
        })
    }
}
