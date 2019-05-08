import auth0 from 'auth0-js'

import { auth0Options } from '@core/config/authConfig'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain:       'ccai.auth0.com',
    clientID:     '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
    ...auth0Options.auth,
  })

  register = (email, password) => {
    return new Promise ((resolve) => {this.auth0.signup({
      connection: 'Username-Password-Authentication',
      email,
      password,
      user_metadata: { fullName: 'AAA' }
    }, async (err, result) => {
        if (err) {
          resolve({
            status: 'error',
            message: err,
          })
        }
        resolve({
          status: 'ok',
          messafe: '',
        })
    })
  })
  }

  login = (email, password) => {
    this.auth0.login({
      email,
      password,
      realm: 'Username-Password-Authentication',
      redirectUri: 'http://localhost:3000/registration/confirm'
    }, () => null)
  }

  googleSingup = () => {
    this.auth0.authorize({
      connection: 'google-oauth2',
    })
  }


  handleAuthentication = () => {
    return new Promise ((resolve) => {
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        throw err
        return 'err'
      }

      console.log(authResult)
      if (!authResult || !authResult.idToken) {
        resolve('err')
      }
      this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
        console.log('user', user)
        resolve(user)
      });
    })
  })
  }
}