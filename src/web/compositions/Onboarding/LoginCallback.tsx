import React from 'react'
import { Redirect } from 'react-router-dom'


class LoginResult extends React.Component {
  state = {
    redirected: false
  }
  componentDidMount() {
    const result = this.props.auth.handleAuthentication()
    if (result !== 'err') this.setState({redirected: true})
  }

  render() {
    if (this.state.redirected) {
      return (
        <Redirect to="/register/confirm" />
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
