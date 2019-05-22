import auth0 from 'auth0-js'

import { auth0Options } from '@core/config/authConfig'
import { PRODUCTION, LOCAL_BUILD } from '@core/utils/config'

const callBackUrl = LOCAL_BUILD
  ? 'http://localhost:3000'
  : PRODUCTION
  ? 'https://beta.cryptocurrencies.ai'
  : 'https://develop.beta.cryptocurrencies.ai'

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
      redirectUri: `${callBackUrl}/registration/confirm`
    }, () => null)
  }

  googleSingup = () => {
    this.auth0.authorize({
      connection: 'google-oauth2',
    })
  }


  handleAuthentication = () => {
    return new Promise ((resolve ) => {
    this.auth0.parseHash({ hash: window.location.hash }, (err, authResult) => {
      if (err) {
        resolve({
          status: 'err',
          data: err}
        )
      }

      if (!authResult || !authResult.idToken) {
        resolve({
          status: 'err',
          data: 'no authResult'}
        )
      }
      resolve({
        status: 'ok',
        data: authResult,
      })
    })
  })
  }
}