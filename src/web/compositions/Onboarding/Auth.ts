import auth0, { Auth0Error, Auth0DecodedHash } from 'auth0-js'
import { MASTER_BUILD } from '@core/utils/config'

import { auth0Options, ClientId } from '@core/config/authConfig'

export type AuthSimpleSuccessResponseType = {
  access_token: string
  id_token: string
  scope: 'openid profile email address phone'
  expires_in: 86400 | number
  token_type: 'Bearer'
  recovery_code?: string // only if authmfa with recovery
}

export type AuthSimpleErrorResponseType = {
  // OR
  error: 'mfa_required' | 'network_error' | string
  error_description: 'Multifactor authentication required' | string
  mfa_token?: string
}

export type ListOfAssociatedErrorMfaType = {
  error: 'invalid_grant' | 'network_error' | string
  error_description:
    | 'The mfa_token provided is invalid. Try getting a new token'
    | string
}

export type MfaAuthenticatorType = {
  id: string
  authenticator_type: 'otp' | string
  active: boolean
}

export type ListOfAssociatedSuccessMfaType = MfaAuthenticatorType[]

export type AssociateMfaSuccessType = {
  authenticator_type: 'otp' | string
  secret: string
  barcode_uri: string
  recovery_codes: [string]
}

export type EnableMfaSuccessType = {
  user_metadata: {
    mfaEnabled: boolean
  }
}

export type EnableMfaErrorType = {
  error: 'Forbidden' | string
  message: string
}

export type AssociateMfaErrorType = {
  error: 'access_denied' | string
  error_description: 'User is already enrolled.' | string
}

export type ChangePasswordSuccessReponseType = {
  status: 'success'
}

export type ChangePasswordErrorResponseType = {
  error: 'network_error' | string
  error_description: string
}

export default class Auth {
  authCallback: string
  auth0 = new auth0.WebAuth({
    domain: 'ccai.auth0.com',
    clientID: ClientId,
    ...auth0Options.auth,
  })

  constructor(authCallback: string) {
    this.authCallback = authCallback
  }

  register = async (
    email: string,
    password: string
  ): Promise<{
    status: 'error' | 'ok'
    message: '' | string
    errorDestription: string
  }> => {
    return new Promise((resolve) => {
      this.auth0.signup(
        {
          connection: 'Username-Password-Authentication',
          email,
          password,
        },
        async (err: Auth0Error | null, result) => {
          if (err) {
            console.log('err register', err);

            resolve({
              status: 'error',
              message: err.description || err.name,
              errorDestription: err.code,
            })
          }
          resolve({
            status: 'ok',
            message: '',
            errorDestription: '',
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
        redirectUri: this.authCallback,
      },
      (authError) => {
        console.log('authError', authError)
      }
    )
  }

  googleSingup = () => {
    this.auth0.authorize({
      connection: 'google-oauth2',
      redirectUri: this.authCallback,
    })
  }

  handleAuthentication = async (): Promise<{
    status: 'err' | 'ok'
    data: 'no authResult' | Auth0Error | Auth0DecodedHash | null
  }> => {
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

  authSimple = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }): Promise<AuthSimpleSuccessResponseType & AuthSimpleErrorResponseType> => {
    let result
    try {
      result = await fetch(`https://ccai.auth0.com/oauth/token`, {
        method: 'post',
        body: JSON.stringify({
          client_id: ClientId,
          username: username,
          password: password,
          audience: auth0Options.auth.audience,
          scope: auth0Options.auth.scope,
          grant_type: 'password',
          realm: 'Username-Password-Authentication',
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })

      result = await result.json()
    } catch (e) {
      result = {
        error: 'network_error',
        error_description: e.message,
      }
      console.log('e', e)
    }

    return result
  }

  authMfaAssociate = async ({
    authenticatorTypes,
    authMfaToken,
  }: {
    authenticatorTypes: string[]
    authMfaToken: string
  }): Promise<AssociateMfaSuccessType & AssociateMfaErrorType> => {
    let result

    try {
      result = await fetch(`https://ccai.auth0.com/mfa/associate`, {
        method: 'post',
        body: JSON.stringify({
          authenticator_types: authenticatorTypes,
        }),
        headers: {
          authorization: `Bearer ${authMfaToken}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      })

      result = await result.json()
    } catch (e) {
      result = {
        error: 'network_error',
        error_description: e.message,
      }
    }

    return result
  }

  authMfa = async ({
    authMfaToken,
    otp,
    recoveryCode,
  }: {
    authMfaToken: string
    otp?: string
    recoveryCode?: string
  }): Promise<AuthSimpleSuccessResponseType & AuthSimpleErrorResponseType> => {
    const grantType = otp
      ? 'http://auth0.com/oauth/grant-type/mfa-otp'
      : recoveryCode
      ? 'http://auth0.com/oauth/grant-type/mfa-recovery-code'
      : ''

    let result
    try {
      result = await fetch(`https://ccai.auth0.com/oauth/token`, {
        method: 'post',
        body: JSON.stringify({
          client_id: ClientId,
          grant_type: grantType,
          mfa_token: authMfaToken,
          ...(otp ? { otp } : {}),
          ...(recoveryCode ? { recovery_code: recoveryCode } : {}),
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })

      result = await result.json()
    } catch (e) {
      result = {
        error: 'network_error',
        error_description: e.message,
      }
    }

    return result
  }

  listOfAssociatedMfa = async ({
    authMfaToken,
  }: {
    authMfaToken: string
  }): Promise<
    ListOfAssociatedSuccessMfaType & ListOfAssociatedErrorMfaType
  > => {
    let result
    try {
      result = await fetch(`https://ccai.auth0.com/mfa/authenticators`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          authorization: `Bearer ${authMfaToken}`,
        },
      })

      result = await result.json()
    } catch (e) {
      result = {
        error: 'network_error',
        error_description: e.message,
      }
    }

    return result
  }

  changePassword = async ({
    email,
  }: {
    email: string
  }): Promise<
    ChangePasswordSuccessReponseType & ChangePasswordErrorResponseType
  > => {
    let result
    try {
      result = await fetch(
        `https://ccai.auth0.com/dbconnections/change_password`,
        {
          method: 'post',
          body: JSON.stringify({
            client_id: ClientId,
            email: email,
            connection: 'Username-Password-Authentication',
          }),
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      )

      result = {
        status: 'success',
      }
    } catch (e) {
      result = {
        error: 'network_error',
        error_description: e.message,
      }
    }

    return result
  }

  enableMfa = async ({
    userId,
    accessToken,
  }: {
    userId: string,
    accessToken: string,
  }): Promise<EnableMfaSuccessType & EnableMfaErrorType> => {
    let result

    try {
      result = await fetch(`https://ccai.auth0.com/api/v2/users/${userId}`, {
        method: 'PATCH', // it's important to have uppercase here
        body: JSON.stringify({
          user_metadata: {
            mfaEnabled: true
          }
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          authorization: `Bearer ${accessToken}`,
        },
      })

      result = await result.json()
    } catch (e) {
      result = {
        error: 'network_error',
        message: e.message,
      }
    }

    return result
  }
}

if (!MASTER_BUILD) {
  window.AuthClass = Auth
}

