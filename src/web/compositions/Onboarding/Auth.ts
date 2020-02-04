import auth0 from 'auth0-js'

import { auth0Options, ClientId } from '@core/config/authConfig'
import { CALLBACK_URL_FOR_AUTH0 } from '@core/utils/config'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'ccai.auth0.com',
    clientID: ClientId,
    ...auth0Options.auth,
  })

  register = async (email: string, password: string) => {
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

  login = (email: string, password: string) => {
    this.auth0.login(
      {
        email,
        password,
        realm: 'Username-Password-Authentication',
        redirectUri: `${CALLBACK_URL_FOR_AUTH0}/registration/confirm`,
      },
      (authError) => {
        console.log('authError', authError)
      }
    )
  }

  googleSingup = () => {
    this.auth0.authorize({
      connection: 'google-oauth2',
      redirectUri: `${CALLBACK_URL_FOR_AUTH0}/registration/confirm`,
    })
  }

  handleAuthentication = () => {
    console.log('handleAuthentication', window.location.hash)
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

  forgotPassword = async ({
    email,
    connection = 'Username-Password-Authentication',
  }: {
    email: string
    connection: string
  }) => {
    this.auth0.changePassword({ email, connection }, () => {})
  }

  authMfaAssociate = async ({
    authenticatorTypes,
    authMfaToken,
  }: {
    authenticatorTypes: string[]
    authMfaToken: string
  }) => {
    const result = await fetch(`https://ccai.auth0.com/mfa/associate`, {
      method: 'post',
      body: JSON.stringify({
        authenticator_types: authenticatorTypes,
      }),
      headers: {
        authorization: authMfaToken,
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
  }

  authMfa = async ({
    authMfaToken,
    otp,
  }: {
    authMfaToken: string
    otp: string
  }) => {
    const result = await fetch(`https://ccai.auth0.com/oauth/token`, {
      method: 'post',
      body: JSON.stringify({
        client_id: ClientId,
        grant_type: 'http://auth0.com/oauth/grant-type/mfa-otp',
        mfa_token: authMfaToken,
        otp: otp,
      }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
  }

}

window.AuthClass = Auth