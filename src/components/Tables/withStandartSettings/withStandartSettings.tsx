import React from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Menu, MenuItem } from '@material-ui/core'
import Switch from '@material-ui/core/Switch'

import { Props } from '../index.types'

export default (WrappedComponent: React.ReactType) => {
  return class Settings extends React.Component<Props> {
    state = {
      anchorEl: null,
      borderBottom: false,
    }

    handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
      this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = () => {
      this.setState(({ borderBottom }: { borderBottom: boolean }) => ({
        anchorEl: null,
        borderBottom: !borderBottom,
      }))
    }

    render() {
      const { anchorEl, borderBottom } = this.state
      const actions = this.props.actions ? this.props.actions : []

      return (
        <>
          <WrappedComponent
            {...this.props}
            borderBottom={borderBottom}
            actions={[
              ...actions,
              {
                id: '5',
                icon: (
                  <MoreVertIcon
                    aria-owns={anchorEl ? 'settings-tables-menu' : undefined}
                  />
                ),
                onClick: this.handleClick,
                color: 'primary',
              },
            ]}
          />
          <Menu
            id="settings-tables-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem>
              Borders{' '}
              <Switch
                checked={this.state.borderBottom}
                onChange={this.handleClose}
                value="checkedB"
                color="primary"
              />
            </MenuItem>
          </Menu>
        </>
      )
    }
  }
}
