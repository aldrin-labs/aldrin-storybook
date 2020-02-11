import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withSnackbar } from 'notistack'
import copy from 'clipboard-copy'
import { Grid, Button } from '@material-ui/core'

import { createApiKey } from '@core/graphql/mutations/user/createApiKey'
import { StyledInputApiManagment } from './ApiManagment.styles'
import { IProps } from './ApiManagment.types'

const ApiManagment = ({ createApiKeyMutation, enqueueSnackbar }: IProps) => {
  const [apiKey, setApiKey] = useState('')

  const copyCoinAddress = () => {
    copy(apiKey)
  }

  const showApiKeyGenerationStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of api key generation',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    if (status === 'OK') {
      enqueueSnackbar(`New api key generated`, { variant: 'success' })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  const generateApiKeyHandler = async () => {
    try {
      const result = await createApiKeyMutation({
        variables: {
          token: '',
        },
      })

      // check that mutation result is ok
      if (
        result &&
        result.data &&
        result.data.createApiKey &&
        result.data.createApiKey.length !== 0
      ) {
        setApiKey(result.data.createApiKey)
        showApiKeyGenerationStatus({ status: 'OK', errorMessage: '' })
      } else {
        showApiKeyGenerationStatus({
          status: 'ERR',
          errorMessage: 'Generating api key failed',
        })
      }
    } catch (e) {
      showApiKeyGenerationStatus({ status: 'ERR', errorMessage: e.message })
    }
  }

  return (
    <>
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{
          height: '100%',
          padding: '5% 1%',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
          borderRadius: '32px',
          marginBottom: '2%',
        }}
      >
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          style={{
            width: '100%',
            height: '30%',
            marginBottom: '10rem',
          }}
        >
          <Grid style={{ padding: '2rem 3rem' }}>
            <Button
              variant="contained"
              color="secondary"
              style={{
                backgroundColor: '#0B1FD1',
                padding: '2rem 5rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                lineHeight: '109.6%',
                letterSpacing: '1.5px',
                borderRadius: '4px',
                boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
              }}
              onClick={generateApiKeyHandler}
            >
              Generate API key
            </Button>
          </Grid>
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ width: '100%' }}
          >
            <StyledInputApiManagment
              value={apiKey}
            />
            <Grid style={{ padding: '0 1rem' }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  backgroundColor: '#0B1FD1',
                  padding: '2rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  lineHeight: '109.6%',
                  letterSpacing: '1.5px',
                  borderRadius: '4px',
                  boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
                }}
                onClick={copyCoinAddress}
              >
                Copy
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default compose(
  withSnackbar,
  graphql(createApiKey, { name: 'createApiKeyMutation' })
)(ApiManagment)
