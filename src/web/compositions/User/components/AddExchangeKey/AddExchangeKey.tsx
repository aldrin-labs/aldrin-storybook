import * as React from 'react'
import styled from 'styled-components'
import { withFormik } from 'formik'
import Yup from 'yup'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import InputLabel from '@material-ui/core/InputLabel'

import { keysNames } from '@core/graphql/queries/chart/keysNames'
import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { addExchangeKeyMutation } from '@core/graphql/mutations/user/addExchangeKeyMutation'

import SelectExchangeList from '@sb/components/SelectExchangeList/SelectExchangeList'
import { handleSelectChangePrepareForFormik } from '@core/utils/UserUtils'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import SelectPortfolio from '@core/components/SelectPortfolio/SelectPortfolio'
import { selectPortfolio } from '@core/graphql/mutations/portfolio/selectPortfolio'

const MIN_CHAR = 3

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)

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
    secretOfApiKey: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    exchange: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
  }),
  mapPropsToValues: (props: any) => ({
    name: '',
    apiKey: '',
    secretOfApiKey: '',
    exchange: '',
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const variables = {
      name: values.name,
      apiKey: values.apiKey,
      secret: values.secretOfApiKey,
      exchange: values.exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
    }

    try {
      await props.addExchangeKey({
        variables,
        update: (proxy, { data: { addExchangeKey } }) => {
          const proxyData = proxy.readQuery({ query: getKeysQuery })
          proxyData.myPortfolios[0].keys.push(addExchangeKey)
          proxy.writeQuery({ query: getKeysQuery, data: proxyData })
        },
      })
      resetForm({})
      setSubmitting(false)

      window && window.gtag('event', 'Submit exchange key form', {
        event_category: 'App - adding exchange key',
        event_label: 'Adding key to user account',
      })
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  },
})

class AddExchangeKeyComponent extends React.Component {
  state = {
    selectedPortfolio: null,
  }

  onChangePortfolio = async (
    optionSelected: { label: string; value: string } | null
  ) => {
    const { selectPortfolioMutation } = this.props

    const selectedPortfolio =
      optionSelected && !Array.isArray(optionSelected)
        ? { label: optionSelected.label, value: optionSelected.value }
        : null

    this.setState({ selectedPortfolio })

    if (!selectedPortfolio) return;

    await selectPortfolioMutation({
      variables: {
        inputPortfolio: {
          id: selectedPortfolio.value,
        },
      },
    })
  }

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
      getExchangesForKeysList,
    } = this.props

    const { selectedPortfolio } = this.state

    return (
      <SPaper>
        <Typography variant="h6">Add new key</Typography>
        <FormContainer onSubmit={handleSubmit} autoComplete="new-password">
          <input type="hidden" value="something" />

          <SExchangeSelect
            id="SelectPortfolio"
            style={{ margin: '2rem 0 0 0' }}
          >
            <InputLabel htmlFor="exchange">Portfolio</InputLabel>
            <SelectPortfolio
              placeholder={`current portfolio`}
              isClearable={false}
              value={
                selectedPortfolio
                  ? [
                      {
                        label: selectedPortfolio.label,
                        value: selectedPortfolio.value,
                      },
                    ]
                  : null
              }
              onChange={this.onChangePortfolio}
            />
          </SExchangeSelect>
          <STextField
            error={touched.name && !!errors.name}
            id="name"
            name="name"
            label="Name"
            autoComplete="off"
            value={values.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter key name here..."
            type="text"
            margin="normal"
            helperText={
              touched.name &&
              errors.name && <FormError>{errors.name}</FormError>
            }
          />
          {/* https://medium.com/paul-jaworski/turning-off-autocomplete-in-chrome-ee3ff8ef0908 */}
          <input type="hidden" value="something" />
          <STextField
            error={touched.apiKey && !!errors.apiKey}
            id="apiKey"
            type="text"
            name="apiKey"
            label="API Key"
            autoComplete="off"
            value={values.apiKey || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter API key here..."
            margin="normal"
            helperText={
              touched.apiKey &&
              errors.apiKey && <FormError>{errors.apiKey}</FormError>
            }
          />
          <STextField
            error={touched.secretOfApiKey && !!errors.secretOfApiKey}
            id="secretOfApiKey"
            name="secretOfApiKey"
            label="Secret"
            autoComplete="off"
            value={values.secretOfApiKey || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter secret key here..."
            type="text"
            margin="normal"
            helperText={
              touched.secretOfApiKey &&
              errors.secretOfApiKey && (
                <FormError>{errors.secretOfApiKey}</FormError>
              )
            }
          />
          <SExchangeSelect id="ExchangeSelect">
            <InputLabel htmlFor="exchange">Exchange</InputLabel>
            <SelectExchangeList
              isClearable={true}
              value={
                values.exchange
                  ? [{ label: values.exchange, value: values.exchange }]
                  : null
              }
              onChange={handleSelectChangePrepareForFormik.bind(
                this,
                'exchange'
              )}
            />
          </SExchangeSelect>

          <Button
            type="submit"
            disabled={!dirty || isSubmitting}
            id="AddKeyButton"
          >
            Add key
          </Button>
        </FormContainer>
      </SPaper>
    )
  }
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const STextField = styled(TextField)`
  align-self: center;
  margin: 5px;
  width: 80%;
`

const SExchangeSelect = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: 30px 5px 5px 5px;
  width: 80%;
  min-height: 52px;
`

const SPaper = styled(Paper)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 8px 0px 0px 8px;
  max-height: 500px;
  min-height: 500px;
  padding: 15px;
  width: 300px;
`

export const AddExchangeKey = compose(
  graphql(addExchangeKeyMutation, {
    name: 'addExchangeKey',
    options: {
      refetchQueries: [
        { query: portfolioKeyAndWalletsQuery },
        { query: getKeysQuery },
        { query: keysNames },
      ],
    },
  }),
  graphql(selectPortfolio, {
    name: 'selectPortfolioMutation',
    options: {
      refetchQueries: [
        // { query: portfolioKeyAndWalletsQuery },
        { query: getKeysQuery },
        { query: keysNames },
      ],
    },
  }),
  formikEnhancer
)(AddExchangeKeyComponent)
