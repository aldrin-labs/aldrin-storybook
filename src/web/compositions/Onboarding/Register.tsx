import React, { Component } from 'react'

import auth0 from 'auth0-js'

import { auth0Options } from '@core/config/authConfig'

import Inputs from './Inputs'

class Register extends Component {
 render() {
    const { auth } = this.props
    return (
      <Inputs
        auth={auth}
        loginWithGoogle={auth.googleSingup}
      />
    )
  }
}

export default Register
