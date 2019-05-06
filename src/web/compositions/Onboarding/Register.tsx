import React, { Component } from 'react'

import auth0 from 'auth0-js'

import { auth0Options } from '@core/config/authConfig'

import Inputs from './Inputs'

class Register extends Component {

  webAuth = new auth0.WebAuth({
    domain:       'ccai.auth0.com',
    clientID:     '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
    ...auth0Options.auth,
  })

  register = () => {
    const email = `testaccount-${+ new Date()}@test.test`
    console.log('email', email)
    this.webAuth.signup({
      connection: 'Username-Password-Authentication',
      email,
      password: 'nge',
      user_metadata: { fullName: 'AAA'}
  }, (err) => {
      if (err) return alert('Something went wrong: ' + err.message)
      /*this.webAuth.login({
        realm: 'tests',
        email,
        password: 'nge',
      })*/
      this.webAuth.authorize()
      return alert('success signup without login!')
  })
  }

  render() {
    return (
      <Inputs changeStep={this.register} />
    )
  }
}

export default Register
