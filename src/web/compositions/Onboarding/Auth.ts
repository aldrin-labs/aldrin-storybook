import auth0 from 'auth0-js'

import {
  auth0Options,
  AUTH_DOMAIN,
  AUTH_CLIENT_ID,
  AUTH_MFA_GRANT_TYPE,
} from '@core/config/authConfig'
import { CALLBACK_URL_FOR_AUTH0 } from '@core/utils/config'

const isError = (e: any) => {
  return (
    e &&
    e.stack &&
    e.message &&
    typeof e.stack === 'string' &&
    typeof e.message === 'string'
  )
}

const isAuthError = (response: AssociateMFAResponseType) => {
  return !!response.error
}

type OauthTokenErrorResponseType = {
  error: string | 'mfa_required'
  error_description: String
  mfa_token: string
}

interface AssociateMFAResponseType extends AssociateMFAResponseFailed, Error {
  authenticator_type: string // "otp"
  secret: string // ON6SC7LPFI7EKL2KHBGD6V2BHE3G2TBJ
  barcode_uri: string // otpauth://totp/ccai:ditekem402%40onmail.top?secret=ON6SC7LPFI7EKL2KHBGD6V2BHE3G2TBJ&issuer=ccai&algorithm=SHA1&digits=6&period=30
}

interface AssociateMFAResponseFailed {
  error: string | 'invalid_grant'
  error_description:
    | string
    | 'The mfa_token provided is invalid. Try getting a new token.'
}

type AssociationMFAResult = {
  data: AssociateMFAResponseType | null
  error: {
    name: string
    message: string
  } | null
}

const getMFATokenFromError = (response: OauthTokenErrorResponseType) => {
  return response.mfa_token
}

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_DOMAIN,
    clientID: AUTH_CLIENT_ID,
    ...auth0Options.auth,
  })

  mfaToken: string | null = null

  getMfaToken() {
    return this.mfaToken
  }
  setMfaToken(newMfaToken: string) {
    this.mfaToken = newMfaToken
  }

  register = (email: string, password: string) => {
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

  login = (
    email: string,
    password: string,
  ) => {
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

  loginWithMFA = async (otpCode: string) => {
    const response: AssociateMFAResponseType = await fetch(
      `https://${AUTH_DOMAIN}/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "grant_type": AUTH_MFA_GRANT_TYPE,
          "client_id": AUTH_CLIENT_ID,
          "mfa_token": this.mfaToken,
          "otp": otpCode,
        }),
      }
    )
      .then((res) => res.json())
      .catch((e) => e)

    const isRequestFailed = isError(response)
    const isAuth0Error = isAuthError(response)

    if (isRequestFailed) {
      return {
        data: null,
        error: {
          name: response.name,
          message: response.message,
        },
      }
    }
    if (isAuth0Error) {
      return {
        data: null,
        error: {
          name: response.error,
          message: response.error_description,
        },
      }
    }

    return {
      data: response,
      error: null,
    }
  }

  mfaAssociate = async (): Promise<AssociationMFAResult> => {
    const response: AssociateMFAResponseType = await fetch(
      `https://${AUTH_DOMAIN}/mfa/associate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.mfaToken}`,
        },
        body: JSON.stringify({
          authenticator_types: ['otp'],
        }),
      }
    )
      .then((res) => res.json())
      .catch((e) => e)

    const isRequestFailed = isError(response)
    const isAuth0Error = isAuthError(response)

    if (isRequestFailed) {
      return {
        data: null,
        error: {
          name: response.name,
          message: response.message,
        },
      }
    }
    if (isAuth0Error) {
      return {
        data: null,
        error: {
          name: response.error,
          message: response.error_description,
        },
      }
    }

    return {
      data: response,
      error: null,
    }
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
