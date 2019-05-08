import React from 'react'
import { Redirect } from 'react-router-dom'

import Comfirm from './Confirm'

class LoginResult extends React.Component {
  state = {
    redirected: false
  }
  componentDidMount = async () => {
    const result = await this.props.auth.handleAuthentication()
    console.log(result)
    if (result && result !== 'err') this.setState({redirected: true})
  }

  render() {
    if (this.state.redirected) {
      return (
        <Comfirm name="Antonio" />
      )
    }
    return (
      <div className="login">
        <div className="login-content">

          <div>Signing in...</div>

        </div>
      </div>
    );
  }
}

export default LoginResult
