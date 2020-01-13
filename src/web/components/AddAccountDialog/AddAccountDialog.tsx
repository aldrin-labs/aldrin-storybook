import React from 'react'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'

import { withTheme } from '@material-ui/styles'

import { Grid } from '@material-ui/core'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import {
  TypographyCustomHeading,
  GridCustom,
  InputBaseCustom,
  DialogWrapper,
  DialogTitleCustom,
  Legend,
  LinkCustom,
} from './AddAccountDialog.styles'

import { Loading } from '@sb/components/index'

import SvgIcon from '@sb/components/SvgIcon'
import Plus from '@icons/Plus.svg'
import CcaiBinanceLogo from '@icons/ccai&binance.svg'

import free from '@icons/free.svg'
import useful from '@icons/useful.svg'
import secure from '@icons/secure.svg'

import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { keysNames } from '@core/graphql/queries/chart/keysNames'
import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { addExchangeKeyMutation } from '@core/graphql/mutations/user/addExchangeKeyMutation'
import { getAllUserKeys } from '@core/graphql/queries/user/getAllUserKeys'
import { GET_TRADING_SETTINGS } from '@core/graphql/queries/user/getTradingSettings'
import { generateBrokerKey } from '@core/graphql/mutations/keys/generateBrokerKey'

import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'

import SelectExchangeList from '@sb/components/SelectExchangeList/SelectExchangeList'
// import { handleSelectChangePrepareForFormik } from '@core/utils/UserUtils'
import { getCurrentPortfolio } from '@core/graphql/queries/profile/getCurrentPortfolio'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { IState, IProps } from './AddAccountDialog.types'

import InfoDialog from '@sb/components/InfoDialog/InfoDialog'
import GetKeysInfo from '@sb/components/Onboarding/GetKeysInfo/GetKeysInfo'
import Steps from '@sb/components/Onboarding/Steps/Steps'
import { Loader } from '@sb/compositions/Optimization/Optimization.styles'

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme
class AddAccountDialog extends React.Component<IProps, IState> {
  state: IState = {
    open: false,
    openGetKeysInfo: false,
    isSelected: true,
    showWarning: false,
    name: '',
    apiKey: '',
    secretOfApiKey: '',
    exchange: 'binance',
    error: '',
    loadingRequest: false,
  }

  handleGenerateBrokerKey = async () => {
    const { generateBrokerKeyMutation, setCurrentStep, onboarding } = this.props

    this.setState({ loadingRequest: true })

    const resp = await generateBrokerKeyMutation()
    console.log('handleGenerateBrokerKey response', resp)

    onboarding ? setCurrentStep('binanceAccountCreated') : this.handleClose()
  }

  handleSubmit = async () => {
    const { apiKey, secretOfApiKey, exchange } = this.state
    const { numberOfKeys } = this.props

    const variables = {
      name: `Binance #${numberOfKeys + 1}`,
      apiKey,
      secret: secretOfApiKey,
      exchange: exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
    }

    try {
      const { data } = await this.props.addExchangeKey({
        variables,
      })

      const { error } = data.addExchangeKey

      if (error !== '') {
        this.setState({ error })
        return false
      }

      this.setState({
        error: '',
        name: '',
        apiKey: '',
        secretOfApiKey: '',
        exchange: '',
        showWarning: true,
        loadingRequest: false,
      })
    } catch (error) {
      console.log(error)
    }

    return true
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSelectExchange = (e) => {
    this.setState({ exchange: e.value.toLowerCase() })
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({ open: false, loadingRequest: false })
  }

  handleClickOpenGetKeys = () => {
    this.setState({
      openGetKeysInfo: true,
    })
  }

  handleCloseGetKeys = () => {
    this.setState({
      openGetKeysInfo: false,
    })
  }

  updateWarningStatus = (newStatus: boolean) =>
    this.setState({ showWarning: newStatus })

  render() {
    const {
      theme: {
        palette: { black },
      },
      open,
      onboarding = undefined,
      includeCommonBinanceKey = true,
      setCurrentStep,
      existCustomButton = false,
      CustomButton,
      numberOfKeys = 0,
    } = this.props

    const {
      name,
      apiKey,
      secretOfApiKey,
      exchange,
      error,
      showWarning,
      loadingRequest,
    } = this.state

    return (
      <>
        {!loadingRequest && (
          <GetKeysInfo
            open={this.state.openGetKeysInfo}
            handleClose={this.handleCloseGetKeys}
          />
        )}

        {existCustomButton ? (
          <CustomButton handleClick={this.handleClickOpen} />
        ) : (
          <BtnCustom
            btnWidth={'auto'}
            height={'auto'}
            btnColor={'#165BE0'}
            borderRadius={'1rem'}
            color={'#165BE0'}
            margin={'1.6rem 0 0 2rem'}
            padding={'.5rem 1rem .5rem 0'}
            fontSize={'1.4rem'}
            letterSpacing="1px"
            onClick={this.handleClickOpen}
            style={{
              border: 'none',
            }}
          >
            <SvgIcon
              src={Plus}
              width="3.5rem"
              height="auto"
              style={{
                marginRight: '.8rem',
              }}
            />
            Add Account
          </BtnCustom>
        )}

        <DialogWrapper
          maxWidth="md"
          style={{ borderRadius: '50%' }}
          onClose={() => {
            if (!onboarding) {
              this.handleClose()
            }
          }}
          open={onboarding ? open : this.state.open}
          aria-labelledby="customized-dialog-title"
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            onClose={() => {
              if (!onboarding) {
                this.handleClose()
              }
            }}
          >
            <TypographyCustomHeading
              fontWeight={'700'}
              borderRadius={'1rem'}
              color={black.custom}
            >
              Add Api Key
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent
            justify="center"
            style={{
              padding: '0 3rem 3rem',
            }}
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const response = await this.handleSubmit()

                if (response) {
                  this.handleClose()
                }
              }}
              style={{ minWidth: '440px' }}
            >
              {!loadingRequest ? (
                <Grid>
                  <GridCustom
                    container
                    direction={'column'}
                    alignItems={'center'}
                    justify={'center'}
                  >
                    <SvgIcon src={CcaiBinanceLogo} width="50%" height="auto" />
                  </GridCustom>
                  <GridCustom>
                    <Grid
                      container
                      justify={'space-between'}
                      style={{ padding: '3rem 0' }}
                    >
                      <Grid
                        container
                        direction={'column'}
                        justify={'center'}
                        alignItems={'center'}
                        style={{ maxWidth: '33%' }}
                      >
                        <Typography
                          style={{
                            paddingBottom: '0.5rem',
                            fontWeight: 'bold',
                            color: 'black',
                            textTransform: 'uppercase',
                          }}
                        >
                          Free
                        </Typography>
                        <SvgIcon src={free} width="40px" height="auto" />
                        <Typography
                          align={`center`}
                          style={{ paddingTop: '1.4rem' }}
                        >
                          No extra fee, pay only Binance fee
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        direction={'column'}
                        justify={'center'}
                        alignItems={'center'}
                        style={{ maxWidth: '33%' }}
                      >
                        <Typography
                          style={{
                            paddingBottom: '0.5rem',
                            fontWeight: 'bold',
                            color: 'black',
                            textTransform: 'uppercase',
                          }}
                        >
                          Useful
                        </Typography>
                        <SvgIcon src={useful} width="40px" height="auto" />
                        <Typography
                          align={`center`}
                          style={{ paddingTop: '1.4rem' }}
                        >
                          All features availiable with no limits
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        direction={'column'}
                        justify={'center'}
                        alignItems={'center'}
                        style={{ maxWidth: '33%' }}
                      >
                        <Typography
                          style={{
                            paddingBottom: '0.2rem',
                            fontWeight: 'bold',
                            color: 'black',
                            textTransform: 'uppercase',
                          }}
                        >
                          Secure
                        </Typography>
                        <SvgIcon src={secure} width="40px" height="auto" />
                        <Typography
                          align={`center`}
                          style={{ paddingTop: '1.4rem' }}
                        >
                          All user funds custody remain with Binance at all
                          times
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container justify={'center'}>
                      <BtnCustom
                        btnWidth={'45%'}
                        borderRadius={'32px'}
                        btnColor={'#165BE0'}
                        borderColor={'#165BE0'}
                        padding={'1.5rem'}
                        height={'auto'}
                        borderWidth={'2px'}
                        fontSize={'1.2rem'}
                        onClick={this.handleGenerateBrokerKey}
                      >
                        Create hybrid account
                      </BtnCustom>
                    </Grid>
                  </GridCustom>
                  <Grid container justify="center" alignItems="center">
                    <Typography>
                      {onboarding
                        ? `OR TRY 7 DAY FREE TRIAL WITH ANY OTHER EXCHANGE API KEY`
                        : `Or add another exchange key`}
                    </Typography>
                  </Grid>
                  {includeCommonBinanceKey && (
                    <>
                      <GridCustom>
                        <Legend>Exchange</Legend>
                        <SelectExchangeList
                          isClearable={true}
                          inputValue={exchange}
                          placeholder={exchange}
                          onChange={(e) => this.handleSelectExchange(e)}
                          controlStyles={{
                            border: '1px solid #e0e5ec',
                            borderRadius: '1rem',
                            padding: '0 1rem',
                            background: '#fff',
                          }}
                          inputStyles={{
                            marginLeft: '0',
                            color: '#16253d',
                            opacity: '1',
                          }}
                          singleValueStyles={{
                            height: 'auto',
                            width: 'auto',
                            color: '#16253d',
                            overflow: 'auto',
                          }}
                          optionStyles={{
                            color: '#16253d',
                            fontSize: '1.3rem',
                          }}
                        />
                      </GridCustom>
                      {/* <GridCustom>
                      <Legend>Account name</Legend>
                      <InputBaseCustom
                        id="name"
                        name="name"
                        label="Name"
                        value={name}
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Type name..."
                        type="text"
                        // margin="normal"
                      />
                      {error && <FormError>{error}</FormError>}
                    </GridCustom> */}
                      <GridCustom>
                        <Legend>Api key</Legend>
                        <InputBaseCustom
                          id="apiKey"
                          type="text"
                          name="apiKey"
                          label="API Key"
                          value={apiKey}
                          autoComplete={'off'}
                          onChange={(e) => this.handleChange(e)}
                          placeholder="Enter API key here..."
                          // margin="normal"
                        />
                      </GridCustom>
                      <GridCustom>
                        <Legend>Secret key</Legend>
                        <InputBaseCustom
                          id="secretOfApiKey"
                          name="secretOfApiKey"
                          label="Secret"
                          value={secretOfApiKey}
                          autoComplete={'off'}
                          onChange={(e) => this.handleChange(e)}
                          placeholder="Enter secret key here..."
                          type="text"
                          // margin="dense"
                        />
                      </GridCustom>
                    </>
                  )}
                </Grid>
              ) : (
                <div style={{ padding: '350px 0 0 0' }}>
                  <Loading centerAligned={true} loaderColor={'#165BE0'} />
                </div>
              )}

              {includeCommonBinanceKey && !loadingRequest && (
                <Grid container justify="space-between" alignItems="center">
                  <LinkCustom
                    href={'#'}
                    onClick={(e) => {
                      e.preventDefault()
                      this.handleClickOpenGetKeys()
                    }}
                  >
                    How to get keys?
                  </LinkCustom>

                  <BtnCustom
                    btnWidth={'85px'}
                    borderRadius={'32px'}
                    btnColor={'#165BE0'}
                    type="submit"
                  >
                    {onboarding ? 'ADD KEY' : 'ADD'}
                  </BtnCustom>
                </Grid>
              )}
            </form>
          </DialogContent>
        </DialogWrapper>

        <InfoDialog
          dialogStatus={showWarning}
          closeDialog={() => {
            if (onboarding) {
              setCurrentStep('congratulations')
            }
            this.updateWarningStatus(false)
          }}
          text={
            'Importing your trades from the exchange may take up to a few minutes.'
          }
        />
      </>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_BASE_COIN,
    name: 'baseData',
  }),
  graphql(generateBrokerKey, {
    name: 'generateBrokerKeyMutation',
    options: ({
      baseData: {
        portfolio: { baseCoin },
      },
      onboarding,
    }: {
      baseData: { portfolio: { baseCoin: 'USDT' | 'BTC' } }
      onboarding: boolean
    }) => ({
      refetchQueries: !onboarding
        ? [
            {
              query: portfolioKeyAndWalletsQuery,
              variables: { baseCoin },
            },
            { query: getKeysQuery },
            { query: keysNames },
            {
              query: getPortfolioAssets,
              variables: { baseCoin, innerSettings: true },
            },
            { query: getMyPortfoliosQuery, variables: { baseCoin: 'USDT' } },
            { query: getCurrentPortfolio },
          ]
        : [],
    }),
  }),
  graphql(addExchangeKeyMutation, {
    name: 'addExchangeKey',
    options: ({
      baseData: {
        portfolio: { baseCoin },
      },
      onboarding,
    }: {
      baseData: { portfolio: { baseCoin: 'USDT' | 'BTC' } }
      onboarding: boolean
    }) => ({
      refetchQueries: !onboarding
        ? [
            {
              query: portfolioKeyAndWalletsQuery,
              variables: { baseCoin },
            },
            { query: getKeysQuery },
            { query: keysNames },
            {
              query: getPortfolioAssets,
              variables: { baseCoin, innerSettings: true },
            },
            { query: getMyPortfoliosQuery, variables: { baseCoin: 'USDT' } },
            { query: getCurrentPortfolio },
            { query: getAllUserKeys },
            { query: GET_TRADING_SETTINGS },
          ]
        : [],
    }),
  })
)(AddAccountDialog)
