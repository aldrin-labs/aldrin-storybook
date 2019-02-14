import React from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { Menu, MenuItem } from '@material-ui/core'
import Switch from '@material-ui/core/Switch'

import GetApp from '@material-ui/icons/GetApp'

import { getCSVData } from '@core/utils/PortfolioTableUtils'

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
      this.setState({ anchorEl: null })
    }

    toggleBorder = () => {
      const borderBottomTrue =
        localStorage.getItem('CCAItablesSettingsBorder') === 'true'

      if (borderBottomTrue) {
        localStorage.setItem('CCAItablesSettingsBorder', 'false')
      } else {
        localStorage.setItem('CCAItablesSettingsBorder', 'true')
      }

      window.location.reload()
    }

    downloadData = () => {
      const {
        data: { body },
        columnNames,
      } = this.props
      getCSVData(body, columnNames)
    }

    render() {
      const { anchorEl } = this.state
      const actions = this.props.actions ? this.props.actions : []
      const borderBottom =
        localStorage.getItem('CCAItablesSettingsBorder') === 'true'
      return (
        <>
          <WrappedComponent
            {...this.props}
            borderBottom={borderBottom}
            actions={[
              ...actions,
              {
                onClick: this.downloadData,
                id: '4',
                icon: (<GetApp />),
                color: 'default',
              },
              {
                id: '5',
                icon: (
                  <MoreHorizIcon
                    aria-owns={anchorEl ? 'settings-tables-menu' : undefined}
                  />
                ),
                onClick: this.handleClick,
                color: 'default',
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
                checked={borderBottom}
                onClick={this.toggleBorder}
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
