import auth0 from 'auth0-js'

import { auth0Options } from '@core/config/authConfig'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain:       'ccai.auth0.com',
    clientID:     '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
    ...auth0Options.auth,
  })

  singup(callback) {
    const email = `testaccount-${+ new Date()}@test.test`
    auth0.singup({connection: 'Username-Password-Authentication',
      email,
      password: 'nge',
      user_metadata: { fullName: 'AAA' }
    }, callback)
  }


  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        throw err
        return 'err'
      }

      console.log(authResult)
      if (!authResult || !authResult.idToken) {
        return 'err'
      }
      return authResult
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    const expiresAt = JSON.parse(String(localStorage.getItem('expires_at')));
    return new Date().getTime() < expiresAt;
  }
}