import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import LiveHelp from '@material-ui/icons/Help'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'
import { connect } from 'react-redux'

import * as userActions from '@containers/User/actions'

const UserLink = (props) => <Link to="/user" {...props} />

const LoginMenuComponent = ({
  userName,
  handleMenu,
  handleLogout,
  showToolTip,
}: any) => (
  <>
    <Tooltip title={'Show Tips'} enterDelay={250}>
      <IconButton onClick={showToolTip} color="default" className="TipButton">
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

const mapDispatchToProps = (dispatch: any) => ({
  showToolTip: () => dispatch(userActions.showToolTip()),
})

export const LoginMenu = connect(
  null,
  mapDispatchToProps
)(LoginMenuComponent)
