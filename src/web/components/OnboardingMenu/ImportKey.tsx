import * as React from 'react'

import { Typography, Link } from '@material-ui/core'

import { withFormik } from 'formik'
import Yup from 'yup'

import { toPairs } from 'lodash-es'

import { compose } from 'recompose'

import {
  Wrapper,
  StyledTypography,
  ContentContainer,
  SubHeader,
  StyledBeginButton,
  ButtonContainer,
  ImportContent,
  InputTextField,
  FormContainer,
} from './styles'

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)

const MIN_CHAR = 3

class ImportKey extends React.Component {
  render() {
    const {
      values,
      touched,
      dirty,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      isSubmitting,
      changePage,
    } = this.props
    const pairsErrors = toPairs(errors)

    return (
      <Wrapper>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
        >
          Import Keys
        </Typography>
        <ImportContent>
          <SubHeader>
            <StyledTypography
                color="inherit"
                align="center"
                variant="h6"
            >
              Grab your keys from your Binane account and place them here.
            </StyledTypography>
            <Link
                onClick={() => changePage('ImportHelp')}
                color="inherit"
                align="center"
                variant="caption"
            >
              <i>Need help?</i>
            </Link>
            </SubHeader>
            <ContentContainer>
              <InputTextField
                autoComplete="off"
                color="secondary"
                id="apiKey"
                label="Api Key"
                margin="normal"
                value={values.apiKey || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <InputTextField
              autoComplete="off"
              color="secondary"
              id="secretKey"
              label="Secret Key"
              margin="normal"
              value={values.secretKey || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputTextField
              autoComplete="off"
              color="secondary"
              id="name"
              label="Account Name"
              margin="normal"
              value={values.name || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Typography color="error">{
              pairsErrors.length
                ? pairsErrors[0][1]
                : '\u00A0'
            }</Typography>
            </ContentContainer>
            <ButtonContainer>
            <StyledBeginButton onClick={handleSubmit}>
              Add Exchange
            </StyledBeginButton>
          </ButtonContainer>
        </ImportContent>
      </Wrapper>
    )
  }
}

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    apiKey: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    secretKey: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
  }),
  mapPropsToValues: (props: any) => ({
    name: '',
    apiKey: '',
    secretKey: '',
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const variables = {
      name: values.name,
      apiKey: values.apiKey,
      secret: values.secretKey,
      exchange: props.exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
    }

    try {
      await props.addExchangeKey({ variables })
      await resetForm({})
      await setSubmitting(false)
      props.changePage('finish')
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  },
})

export default compose(
  formikEnhancer
)(ImportKey)
