import auth0 from 'auth0-js'

import { auth0Options } from '@core/config/authConfig'
import { CALLBACK_URL_FOR_AUTH0 } from '@core/utils/config'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'ccai.auth0.com',
    clientID: '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
    ...auth0Options.auth,
  })

  register = (email, password) => {
    return new Promise((resolve) => {
      this.auth0.signup(
        {
          connection: 'Username-Password-Authentication',
          email,
          password,
        },
        async (err, result) => {
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
        }
      )
    })
  }

  login = (email, password) => {
    this.auth0.login(
      {
        email,
        password,
        realm: 'Username-Password-Authentication',
        redirectUri: `${CALLBACK_URL_FOR_AUTH0}/registration/confirm`,
      },
      () => null
    )
  }

  googleSingup = () => {
    this.auth0.authorize({
      connection: 'google-oauth2',
      redirectUri: `${CALLBACK_URL_FOR_AUTH0}/registration/confirm`,
    })
  }

  handleAuthentication = () => {
    return new Promise((resolve) => {
      this.auth0.parseHash(
        { hash: window.location.hash },
        (err, authResult) => {
          if (err) {
            resolve({
              status: 'err',
              data: err,
            })
          }

          if (!authResult || !authResult.idToken) {
            resolve({
              status: 'err',
              data: 'no authResult',
            })
          }
          resolve({
            status: 'ok',
            data: authResult,
          })
        }
      )
    })
  }
}
