import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import LiveHelp from '@material-ui/icons/Help'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { tooltipsConfig } from '@core/config/tooltipsConfig'

const UserLink = (props) => <Link to="/user" {...props} />

const LoginMenuComponent = ({
  userName,
  handleLogout,
  updateTooltipSettingsMutation,
}: any) => (
  <>
    <Tooltip title={'Show Tips'} enterDelay={250}>
      <IconButton
        onClick={async () =>
          updateTooltipSettingsMutation({
            variables: {
              settings: {
                ...tooltipsConfig,
              },
            },
          })
        }
        color="default"
        className="TipButton"
      >
        <LiveHelp />
      </IconButton>
    </Tooltip>
    <Tooltip title={userName} enterDelay={250}>
      <IconButton color="default" component={UserLink} className="UserLink">
        <AccountCircle />
      </IconButton>
    </Tooltip>
    <Tooltip title="Log out" enterDelay={500}>
      <IconButton color="default" onClick={handleLogout} id="ExitButton">
        <ExitIcon />
      </IconButton>
    </Tooltip>
  </>
)

export const LoginMenu = compose(
  graphql(updateTooltipSettings, { name: 'updateTooltipSettingsMutation' })
)(LoginMenuComponent)
