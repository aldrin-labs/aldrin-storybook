import * as React from 'react'

import { compose } from 'recompose'

import {
  Link,
  Typography,
} from '@material-ui/core'

import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import Yup from 'yup'

import { withErrorFallback } from '@core/hoc/withErrorFallback'

import googlePlus from '@icons/googlePlus.svg'

import SvgIcon from '@sb/components/SvgIcon/'

import { toPairs } from 'lodash-es'

import {
  StyledTypography,
  StyledLink,
  InputContainer,
  InputTextField,
  ButtonsWrapper,
  StyledButton,
  SocialContainer,
  GoogleButton,
  ContentGrid,
  GoolgeSvgContainer,
} from './styles'

const Inputs = (props) => {
  const {
    loading,
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props
  const pairsErrors = toPairs(errors)
  return (
    <ContentGrid item>
      <InputContainer>
        <Link
          color="secondary"
          variant="caption"
        >
          Learn how we use your information
        </Link>
        <InputTextField
          autoComplete="off"
          fullWidth
          id="fullName"
          label="Full Name"
          margin="normal"
          value={values.fullName}
          onChange={handleChange}
        />
        <InputTextField
          autoComplete="off"
          fullWidth
          id="email"
          label="Email"
          margin="normal"
          value={values.email}
          onChange={handleChange}
        />
        <InputTextField
          autoComplete="off"
          fullWidth
          id="password"
          label="Password"
          margin="normal"
          type="password"
          value={values.password}
          onChange={handleChange}
        />
        <InputTextField
          autoComplete="off"
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          margin="normal"
          value={values.confirmPassword}
          onChange={handleChange}
        />
       <Typography color="error">
          {
          pairsErrors.length
            ? pairsErrors[0][1]
            : '\u00A0'
          }
        </Typography>
      </InputContainer>
      <ButtonsWrapper>
        <StyledButton
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        >
          {loading ? 'loading': 'create account'}
        </StyledButton>
        <SocialContainer>
          <GoogleButton onClick={props.loginWithGoogle}>
            <GoolgeSvgContainer>
              <SvgIcon src={googlePlus} />
            </GoolgeSvgContainer>
            Using Google
          </GoogleButton>
        </SocialContainer>
      </ButtonsWrapper>
      <StyledTypography variant="caption">
        By registration you agree to our
        <StyledLink
            color="secondary"
            variant="caption"
          >
            {`Terms & Consitions`}
          </StyledLink>
      </StyledTypography>
    </ContentGrid>
  )
}

const getValidationSchema = (values) => {
  return Yup.object().shape({
    fullName: Yup.string()
    .required('Full Name is required!'),
    email: Yup.string()
      .email('E-mail is not valid!')
      .required('E-mail is required!'),
    password: Yup.string()
      .min(6, 'Password has to be longer than 6 characters!')
      .required('Password is required!'),
    confirmPassword: Yup.string()
      .oneOf([values.password], 'Passwords are not the same!')
      .required('Password confirmation is required!'),
  })
}

const validate = (values) => {
  console.log(values)
  const validationSchema = getValidationSchema(values)
  try {
    validateYupSchema(values, validationSchema, true)
    return {}
  } catch (error) {
    return yupToFormErrors(error)
  }
}

const formikEnhancer = withFormik({
  validate,
  mapPropsToValues: (props) => ({
    fullName: 'Alexey',
    email: `testaccount-${+ new Date()}@test.test`,
    password: 'ngenge',
    confirmPassword: 'ngenge',
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm, setError }) => {
    const { email, password, fullName } = values
    props.setLoading()
    await props.persistFullName(fullName)
    const registerResult = await props.auth.register(email, password)
    if (registerResult.status === 'error') {
      const errCode = registerResult.message.code
      if (errCode === 'user_exists') {
        console.log('aaa')
        setError({email: 'The user already exists.'})
      }
    }
    else {
      props.auth.login(email, password)
    }
  },
})

export default compose(
  withErrorFallback,
  formikEnhancer
)(Inputs)
