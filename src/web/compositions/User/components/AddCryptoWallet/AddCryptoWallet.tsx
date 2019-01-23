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
import SelectWalletList from '@storybook/components/SelectWalletList/SelectWalletList'
import { handleSelectChangePrepareForFormik } from '@core/utils/UserUtils'

import { getCryptoWalletsQuery } from '@core/graphql/queries/user/getCryptoWalletsQuery'
import { addCryptoWalletMutation } from '@core/graphql/mutations/user/addCryptoWalletMutation'
import { portfolioKeyAndWalletsQuery } from '@containers/Portfolio/api'

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
    walletAdress: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    asset: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
  }),
  mapPropsToValues: (props: any) => ({
    name: '',
    walletAdress: '',
    asset: '',
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const variables = {
      address: values.walletAdress,
      assetName: values.asset,
      name: values.name,
      //      date: Date.now(),
      date: Math.round(+Date.now() / 1000),
    }

    try {
      await props.addCryptoWallet({
        variables,
        update: (proxy, { data: { addCryptoWallet } }) => {
          const proxyData = proxy.readQuery({
            query: getCryptoWalletsQuery,
          })
          proxyData.myPortfolios[0].cryptoWallets.push(addCryptoWallet)
          proxy.writeQuery({
            query: getCryptoWalletsQuery,
            data: proxyData,
          })
        },
      })
      resetForm({})

      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  },
})

class AddCryptoWalletComponent extends React.Component {
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
    } = this.props

    return (
      <SPaper>
        <Typography variant="h6">Add new crypto wallet</Typography>
        <FormContainer onSubmit={handleSubmit} autoComplete="new-password">
          <STextField
            error={touched.name && !!errors.name}
            id="name"
            name="name"
            label="Name"
            autoComplete="off"
            value={values.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter cryptoWallet name here..."
            type="text"
            margin="normal"
            helperText={
              touched.name &&
              errors.name && <FormError>{errors.name}</FormError>
            }
          />
          <STextField
            error={touched.walletAdress && !!errors.walletAdress}
            id="walletAdress"
            name="walletAdress"
            label="Address"
            autoComplete="off"
            value={values.walletAdress || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter wallet address here..."
            type="text"
            margin="normal"
            helperText={
              touched.walletAdress &&
              errors.walletAdress && (
                <FormError>{errors.walletAdress}</FormError>
              )
            }
          />
          <SSelect>
            <InputLabel htmlFor="asset">Wallet</InputLabel>
            <SelectWalletList
              isClearable={true}
              value={
                values.asset
                  ? [{ label: values.asset, value: values.asset }]
                  : null
              }
              onChange={handleSelectChangePrepareForFormik.bind(this, 'asset')}
            />
          </SSelect>

          <Button type="submit" disabled={!dirty || isSubmitting}>
            Add cryptoWallet
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

const SSelect = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: 30px 5px 5px 5px;
  width: 80%;
  min-height: 50px;
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

export const AddCryptoWallet = compose(
  graphql(addCryptoWalletMutation, {
    name: 'addCryptoWallet',
    options: {
      refetchQueries: [{ query: portfolioKeyAndWalletsQuery }],
    },
  }),
  formikEnhancer
)(AddCryptoWalletComponent)
