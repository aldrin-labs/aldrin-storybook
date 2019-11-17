import React from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { Menu, MenuItem } from '@material-ui/core'
import Switch from '@material-ui/core/Switch'
import { saveAs } from 'file-saver'

import GetApp from '@material-ui/icons/GetApp'
import Tooltip from '@material-ui/core/Tooltip'

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

      window && window.location.reload()
    }

    downloadData = () => {
      const {
        data: { body },
        columnNames,
        expandableRows,
      } = this.props
      const blob = new Blob([getCSVData(
        body,
        columnNames,
        expandableRows
        )], {type: 'text/plain;charset=utf-8'})
      saveAs(blob, 'result.csv')
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
                icon: (
                  <Tooltip title="Download CSV">
                    <GetApp />
                  </Tooltip>
                  ),
                color: 'default',
              },
              {
                id: '5',
                icon: (
                  <Tooltip title="More">
                  <MoreHorizIcon
                    aria-owns={anchorEl ? 'settings-tables-menu' : undefined}
                  />
                  </Tooltip>
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
