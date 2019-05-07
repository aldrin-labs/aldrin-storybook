import React, { Component } from 'react'

import auth0 from 'auth0-js'

import { auth0Options } from '@core/config/authConfig'

import Inputs from './Inputs'

class Register extends Component {

  register = () => {
    const { auth } = this.props
    const email = `testaccount-${+ new Date()}@test.test`
    // const email = 'anibaka9@gmail.com'
    console.log('email', email)
    auth.auth0.signup({
      connection: 'Username-Password-Authentication',
      email,
      password: 'nge',
      user_metadata: { fullName: 'AAA' }
  }, (err, result) => {
      if (err) return alert('Something went wrong: ' + err.message)
      console.log('result', result)
      // auth.auth0.authorize({})
      auth.auth0.login({
        realm: 'Username-Password-Authentication',
        email,
        password: 'nge',
      }, () => console.log('aaaa'))
      return alert('success signup without login!')
  })
  }

  loginWithGoogle = () => {
    this.webAuth.authorize({
      connection: 'twitter',
    })
  }

  render() {
    console.log('window.location.hash', window.location.hash)

    if(window.location.hash.length) {
//    this.webAuth.crossOriginVerification()
    this.webAuth.parseHash({ hash: window.location.hash, state: '' }, (err, authResult) =>  {
      if (err) {
        return console.log('err', err)
      }
      if (authResult) {
      this.webAuth.client.userInfo(authResult.accessToken, (err, user) => {
        console.log('user', user)
      })}
    })}
    return (
      <Inputs
        changeStep={this.register}
        loginWithGoogle={this.loginWithGoogle}
      />
    )
  }
}

export default Register
