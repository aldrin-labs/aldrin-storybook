import React, { ChangeEvent, useState } from 'react'
import { compose } from 'recompose'
import {
  Grid,
  Typography,
  Theme,
  Input,
  Button,
  Checkbox,
} from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import { PrivacyPolicy, TermsOfUse } from '@sb/components/index'
import SvgIcon from '@sb/components/SvgIcon'
import GoogleLogo from '@icons/googleLogo.svg'

const SignUp = ({
  theme,
  onSignUpWithGoogleClick,
  onSignUpButtonClick,
  changeStep,
  status,
  errorMessage,
}: {
  theme: Theme
  // TODO: Need to replace any here
  onSignUpWithGoogleClick: () => any
  // TODO: Need to replace any here
  onSignUpButtonClick: ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => any
  status: 'error' | 'success'
  errorMessage: string
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgaing, setPasswordAgaing] = useState('')
  const [isAgreeWithRules, setAgreementWithRules] = useState(false)
  const [showPrivacyPolicy, togglePrivacyPolicy] = useState(false)
  const [showTermsOfUse, toggleTermsOfUse] = useState(false)
  const [error, setError] = useState('')

  const toggleAgreementCheckbox = () => {
    setAgreementWithRules(!isAgreeWithRules)
  }

  const checkPasswordsMatch = ({ pass1, pass2 }: { pass1: string, pass2: string }) => pass1 === pass2

  return (
    <>
      <PrivacyPolicy
        open={showPrivacyPolicy}
        onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
      />
      <TermsOfUse
        open={showTermsOfUse}
        onClick={() => toggleTermsOfUse(!showTermsOfUse)}
      />
      <Grid>
        <Grid>
          <Button
            disabled={!isAgreeWithRules}
            onClick={() => onSignUpWithGoogleClick()}
          >
            Sign up with Google
          </Button>
        </Grid>
        <Grid>
          <Typography>or</Typography>
        </Grid>
        <Grid>
          <Input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </Grid>
        <Grid>
          <Input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value)
              setError('')
            }}
          />
        </Grid>
        <Grid>
          <Input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPasswordAgaing(e.target.value)
              setError('')
            }}
          />
        </Grid>
        {status === 'error' && errorMessage !== '' && (
          <Grid>
            <Typography>{errorMessage}</Typography>
          </Grid>
        )}
        {error !== '' && (
          <Grid>
            <Typography>Passwords doesn't match</Typography>
          </Grid>
        )}
        <Grid>
          <Grid>
            <Checkbox
              checked={isAgreeWithRules}
              onChange={() => toggleAgreementCheckbox()}
            />
            <Typography>
              I agree to cryptocurrencies.ai
              <span onClick={() => toggleTermsOfUse(!showTermsOfUse)}>
                Terms of Use
              </span>
              ,{' '}
              <span onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}>
                Privacy Policy
              </span>
              , and I’m over 18 years old.
            </Typography>
          </Grid>
        </Grid>
        <Grid>
          <Button
            disabled={!isAgreeWithRules}
            onClick={() => {
              const isPasswordsAreTheSame = checkPasswordsMatch({ pass1: password, pass2: passwordAgaing })
              if (!isPasswordsAreTheSame) {
                return
              }
              onSignUpButtonClick({ email, password })
            }}
          >
            Sign up
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default compose(withTheme)(SignUp)
