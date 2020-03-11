import React, { PureComponent, useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'
import { withSnackbar } from 'notistack'
import { Grid, Typography, Theme } from '@material-ui/core'

import { refetchOptionsOnKeyAddFunction } from '@sb/components/AddAccountDialog/AddAccountDialog.utils'
import { generateBrokerKey } from '@core/graphql/mutations/keys/generateBrokerKey'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { ContentHeading, ContentText } from './PopupStart.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Loading } from '@sb/components/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

import CubeLogo from '@icons/auth0Logo.svg'
import cube from '@icons/cube.svg'
import multipleCube from '@icons/multipleCube.svg'
import connectLine from '@icons/connectLine.svg'

import { IProps } from './PopupStart.types'

const PopupStart = ({
  open,
  theme,
  handleGenerateBrokerKey,
  handleGoToAddExchangeKey,
}: {
  open: boolean
  theme: Theme
  handleGenerateBrokerKey: () => Promise<void>
  handleGoToAddExchangeKey: () => void
}) => {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        TransitionProps={{
          style: {
            backgroundColor: '#16253D',
          },
        }}
        transitionDuration={{
          enter: 3000,
          exit: 3000,
        }}
        PaperProps={{
          style: {
            minWidth: '50%',
            maxWidth: '800px',
          },
        }}
      >
        <DialogTitleCustom
          id="customized-dialog-title"
          style={{
            backgroundColor: theme.palette.background.default,
          }}
        >
          <SvgIcon src={CubeLogo} width="5rem" height="auto" />

          <TypographyCustomHeading
            fontWeight={'700'}
            borderRadius={'1rem'}
            style={{
              textAlign: 'center',
              fontSize: '2rem',
              letterSpacing: '1.5px',
              textTransform: 'initial',
              color: '#16253D',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
            }}
          >
            Welcome to Cryptocurrencies.ai
          </TypographyCustomHeading>
        </DialogTitleCustom>
        <DialogContent
          style={{
            padding: '0 3rem 3rem',
          }}
        >
          <Grid container direction="column">
            <Grid container justify="space-around">
              <Grid
                container
                direction="column"
                style={{ textAlign: 'center', width: '35%' }}
              >
                <Grid>
                  <SvgIcon src={cube} width="8rem" height="auto" />
                </Grid>
                <Grid style={{ padding: '1rem 0 2rem 0' }}>
                  <ContentHeading>Use us as exchange</ContentHeading>
                </Grid>
                <Grid>
                  <ContentText>
                    Create your <span style={{ fontWeight: 'bold' }}>free</span>{' '}
                    account
                  </ContentText>
                </Grid>
                <Grid style={{ padding: '0.6rem' }}>
                  <SvgIcon src={connectLine} width="0.5rem" height="auto" />
                </Grid>
                <Grid>
                  <ContentText>
                    Deposit funds, that are secure on top exchanges
                  </ContentText>
                </Grid>
                <Grid style={{ padding: '0.6rem' }}>
                  <SvgIcon src={connectLine} width="0.5rem" height="auto" />
                </Grid>
                <Grid>
                  <ContentText>
                    Trade on spot & futures market with no slippage because of
                    top exchange liquidity
                  </ContentText>
                </Grid>
              </Grid>
              <Grid
                container
                direction="column"
                style={{ textAlign: 'center', width: '35%' }}
              >
                <Grid>
                  <SvgIcon src={multipleCube} width="9.2rem" height="auto" />
                </Grid>
                <Grid style={{ padding: '1rem 0 2rem 0' }}>
                  <ContentHeading>Connect your exchanges</ContentHeading>
                </Grid>
                <Grid>
                  <ContentText>
                    Add all your exchange accounts into portfolio via API key
                  </ContentText>
                </Grid>
                <Grid style={{ padding: '0.6rem' }}>
                  <SvgIcon src={connectLine} width="0.5rem" height="auto" />
                </Grid>
                <Grid>
                  <ContentText>
                    Manage your portfolio on one single dashboard
                  </ContentText>
                </Grid>
                <Grid style={{ padding: '0.6rem' }}>
                  <SvgIcon src={connectLine} width="0.5rem" height="auto" />
                </Grid>
                <Grid>
                  <ContentText>
                    Trade on spot & futures market with our smart orders
                  </ContentText>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              justify="space-around"
              alignItems="center"
              style={{ padding: '2rem 0' }}
            >
              <Grid style={{ width: '47%', display: 'flex' }}>
                <BtnCustom
                  onClick={async () => {
                    setLoading(true)
                    await handleGenerateBrokerKey()
                    setLoading(false)
                  }}
                  disabled={loading}
                  btnWidth={'100%'}
                  borderRadius={'8px'}
                  btnColor={'#165BE0'}
                  fontSize="1.6rem"
                  padding="2rem"
                  borderWidth="2px"
                >
                  {loading ? (
                    <Loading size={16} style={{ height: '16px' }} />
                  ) : (
                    `Use us as exchange`
                  )}
                </BtnCustom>
              </Grid>
              <Grid style={{ width: '47%', display: 'flex' }}>
                <BtnCustom
                  onClick={async () => {
                    handleGoToAddExchangeKey()
                  }}
                  disabled={loading}
                  btnWidth={'100%'}
                  borderRadius={'8px'}
                  btnColor={'#165BE0'}
                  fontSize="1.6rem"
                  padding="2rem"
                  borderWidth="2px"
                >
                  add your exchange api key
                </BtnCustom>
              </Grid>
            </Grid>
            <Grid style={{ textAlign: 'center' }}>
              <Typography>
                You can always create a native account or connect an API key
                regardless of the choice you make now.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

class PopoupStartDataWrapper extends PureComponent<IProps> {
  showGenerateBrokerKeyStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of adding key',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    const { enqueueSnackbar } = this.props
    if (status === 'OK') {
      enqueueSnackbar(`Broker key successful added`, { variant: 'success' })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  handleGenerateBrokerKey = async () => {
    const { generateBrokerKeyMutation, setCurrentStep } = this.props

    try {
      const resp = await generateBrokerKeyMutation()
      const { data } = resp
      const {
        status = 'ERR',
        errorMessage = 'Something went wrong with generating broker key',
      } = data.generateBrokerKey || {
        status: 'ERR',
        errorMessage: 'Something went wrong with generating broker key',
      }
      this.showGenerateBrokerKeyStatus({ status, errorMessage })

      if (status === 'OK') {
        setCurrentStep('binanceAccountCreated')
      }
    } catch (error) {
      this.showGenerateBrokerKeyStatus({
        status: 'ERR',
        errorMessage: error.message,
      })
    }
  }

  handleGoToAddExchangeKey = () => {
    const { setCurrentStep } = this.props
    setCurrentStep('addAccount')
  }

  render() {
    const { open, theme } = this.props
    return (
      <PopupStart
        open={open}
        theme={theme}
        handleGenerateBrokerKey={this.handleGenerateBrokerKey}
        handleGoToAddExchangeKey={this.handleGoToAddExchangeKey}
      />
    )
  }
}

export default compose(
  withSnackbar,
  withTheme,
  queryRendererHoc({
    query: GET_BASE_COIN,
    name: 'baseData',
  }),
  graphql(generateBrokerKey, {
    name: 'generateBrokerKeyMutation',
    options: refetchOptionsOnKeyAddFunction,
  })
)(PopoupStartDataWrapper)
