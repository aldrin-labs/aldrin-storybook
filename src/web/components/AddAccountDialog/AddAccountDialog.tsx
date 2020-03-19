import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withSnackbar } from 'notistack'
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
import FuturesWarsRoomSelector from '@core/components/FuturesWarsRoomSelector/index'
import { addExchangeKeyMutation } from '@core/graphql/mutations/user/addExchangeKeyMutation'
import { generateBrokerKey } from '@core/graphql/mutations/keys/generateBrokerKey'

import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'

import SelectExchangeList from '@sb/components/SelectExchangeList/SelectExchangeList'
// import { handleSelectChangePrepareForFormik } from '@core/utils/UserUtils'
import { IState, IProps } from './AddAccountDialog.types'

import InfoDialog from '@sb/components/InfoDialog/InfoDialog'
import GetKeysInfo from '@sb/components/Onboarding/GetKeysInfo/GetKeysInfo'
import { DialogContent } from '@sb/styles/Dialog.styles'

import { refetchOptionsOnKeyAddFunction } from '@sb/components/AddAccountDialog/AddAccountDialog.utils'

@withTheme()
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
    regularLoading: false,
  }

  showAddingExchangeKeyStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of adding key',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    const { enqueueSnackbar } = this.props
    if (status === 'OK') {
      enqueueSnackbar(`Your key successful added`, { variant: 'success' })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

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

  showFuturesWarsKeyStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of creating futures wars key',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    const { enqueueSnackbar } = this.props
    if (status === 'OK') {
      enqueueSnackbar(`FuturesWars key successful created`, {
        variant: 'success',
      })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  handleGenerateBrokerKey = async () => {
    const { generateBrokerKeyMutation, setCurrentStep, onboarding } = this.props
    this.setState({ loadingRequest: true })

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
    } catch (error) {
      console.log('error handleGenerateBrokerKey', error)
      this.showGenerateBrokerKeyStatus({
        status: 'ERR',
        errorMessage: error.message,
      })
    }
    onboarding ? setCurrentStep('binanceAccountCreated') : this.handleClose()
  }

  handleGenerateFuturesWarsAccount = async () => {
    const {
      generateBrokerKeyMutation,
      setCurrentStep,
      onboarding,
      enqueueSnackbar,
    } = this.props
    const { roomId } = this.state

    this.setState({ loadingRequest: true })

    try {
      const resp = await generateBrokerKeyMutation({
        variables: {
          input: {
            isFuturesWarsKey: true,
            roomId: roomId,
          },
        },
      })
      const { data } = resp
      const {
        status = 'ERR',
        errorMessage = 'Something went wrong with generating FuturesWars key',
      } = data.generateBrokerKey || {
        status: 'ERR',
        errorMessage: 'Something went wrong with generating FuturesWars key',
      }
      this.showFuturesWarsKeyStatus({ status, errorMessage })
    } catch (error) {
      console.log('error handleGenerateBrokerKey FuturesWars', error)
      this.showFuturesWarsKeyStatus({
        status: 'ERR',
        errorMessage: error.message,
      })
    }
    onboarding ? setCurrentStep('binanceAccountCreated') : this.handleClose()
  }

  handleSubmit = async () => {
    const { apiKey, secretOfApiKey, exchange } = this.state
    const { numberOfKeys, addExchangeKey } = this.props

    const variables = {
      name: `Binance #${numberOfKeys + 1}`,
      apiKey,
      secret: secretOfApiKey,
      exchange: exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
    }

    try {
      const { data } = await addExchangeKey({
        variables,
      })

      const {
        status = 'ERR',
        errorMessage = 'Something went wrong',
      } = data.addExchangeKey || {
        status: 'ERR',
        errorMessage: 'Something went wrong',
      }

      if (status === 'ERR') {
        this.showAddingExchangeKeyStatus({ status, errorMessage })
        this.setState({ error: errorMessage })
        return false
      }

      this.showAddingExchangeKeyStatus({ status, errorMessage })
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
      this.showAddingExchangeKeyStatus({
        status: 'ERR',
        errorMessage: error.message,
      })
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

  handleSelectRoomId = (value) => {
    this.setState({ roomId: value })
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

  setRegularLoading = (loadArg: boolean) => {
    this.setState({ regularLoading: loadArg })
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
      isFuturesWars = false,
      includeBrokerKey = true,
    } = this.props

    const {
      name,
      apiKey,
      secretOfApiKey,
      exchange,
      error,
      showWarning,
      loadingRequest,
      roomId,
      regularLoading,
    } = this.state

    const { setRegularLoading } = this

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
          !onboarding && (
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
              {includeBrokerKey && !includeCommonBinanceKey
                ? `Create broker account`
                : `Add Account`}
            </BtnCustom>
          )
        )}

        <DialogWrapper
          maxWidth="md"
          style={{ borderRadius: '50%' }}
          onClose={() => {
            if (!onboarding) {
              this.handleClose()
            }
          }}
          PaperProps={{
            style: {
              minWidth: '50%',
              maxWidth: '800px',
            },
          }}
          TransitionProps={{
            style: {
              backgroundColor: onboarding ? '#16253D' : '',
            },
          }}
          transitionDuration={{
            enter: 0,
            exit: onboarding ? 3000 : 0,
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
              {isFuturesWars ? 'Create futures wars account' : `Add Api Key`}
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
                setRegularLoading(true)
                const response = await this.handleSubmit()
                setRegularLoading(false)

                if (response) {
                  this.handleClose()
                }
              }}
              style={{ minWidth: '440px' }}
            >
              {!loadingRequest && isFuturesWars ? (
                <GridCustom>
                  <Grid
                    container
                    justify={'space-between'}
                    style={{ padding: '3rem 0' }}
                  >
                    <Grid container direction={'column'}>
                      <Typography
                        align={`center`}
                        style={{
                          paddingTop: '1.4rem',
                          paddingBottom: '1.4rem',
                          color: '#DD6956',
                        }}
                      >
                        You must understand that you risk losing money. But you
                        can also win it
                      </Typography>
                    </Grid>
                    <Grid
                      justify="center"
                      container
                      direction={'column'}
                      style={{ height: '4rem' }}
                    >
                      <Typography align={`center`}>Select room:</Typography>
                      <FuturesWarsRoomSelector
                        onChange={this.handleSelectRoomId}
                      />
                    </Grid>
                    <Grid container direction={'column'}>
                      <Typography
                        align={`center`}
                        style={{ paddingTop: '1.4rem', color: '#16253D' }}
                      >
                        In order to start the game you must go to the futures
                        terminal and choose your futures wars account from the
                        list available from above
                      </Typography>
                      <Typography
                        align={`center`}
                        style={{ paddingTop: '1.4rem', color: '#16253D' }}
                      >
                        You will need to transfer the set amount to your balance
                        by pressing the "Join" button in the terminal. Half of
                        this amount is your deposit for trading, half will go to
                        the betting bank. Then wait for the round to start and
                        trade as long as you want until the round is over.{' '}
                      </Typography>
                      <Typography
                        align={`center`}
                        style={{ paddingTop: '1.4rem', color: '#16253D' }}
                      >
                        At the end of the round, the winner will receive the
                        bank.
                      </Typography>
                      <Typography
                        align={`center`}
                        style={{ paddingTop: '1.4rem', color: '#16253D' }}
                      >
                        Statistics, rating and time to start and end of the
                        round you can see in the telegram bot @futureswars_bot
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify={'center'}>
                    <BtnCustom
                      btnWidth={'45%'}
                      borderRadius={'8px'}
                      btnColor={'#165BE0'}
                      borderColor={'#165BE0'}
                      padding={'1.5rem'}
                      height={'auto'}
                      borderWidth={'2px'}
                      fontSize={'1.2rem'}
                      disabled={!roomId}
                      onClick={this.handleGenerateFuturesWarsAccount}
                    >
                      Ok, let's start
                    </BtnCustom>
                  </Grid>
                </GridCustom>
              ) : !loadingRequest && !isFuturesWars ? (
                <Grid>
                  {includeBrokerKey && (
                    <>
                      <GridCustom
                        container
                        direction={'column'}
                        alignItems={'center'}
                        justify={'center'}
                      >
                        <SvgIcon
                          src={CcaiBinanceLogo}
                          width="50%"
                          height="auto"
                        />
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
                            borderRadius={'8px'}
                            btnColor={'#165BE0'}
                            borderColor={'#165BE0'}
                            padding={'1.5rem'}
                            height={'auto'}
                            borderWidth={'2px'}
                            fontSize={'1.2rem'}
                            onClick={this.handleGenerateBrokerKey}
                          >
                            Create broker account
                          </BtnCustom>
                        </Grid>
                      </GridCustom>
                      {/* <Grid container justify="center" alignItems="center">
                        <Typography>
                          {onboarding
                            ? `OR TRY 7 DAY FREE TRIAL WITH ANY OTHER EXCHANGE API KEY`
                            : `Or add another exchange key`}
                        </Typography>
                      </Grid> */}
                    </>
                  )}

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
                            boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.15)',
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

              {includeCommonBinanceKey && !isFuturesWars && !loadingRequest && (
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
                    disabled={regularLoading}
                    borderRadius={'8px'}
                    btnColor={'#165BE0'}
                    fontSize="1.6rem"
                    padding="1rem"
                    height="auto"
                    borderWidth="2px"
                    type="submit"
                  >
                    {regularLoading ? (
                      <Loading size={16} style={{ height: '16px' }} />
                    ) : onboarding ? (
                      'ADD AND START'
                    ) : (
                      'ADD'
                    )}
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
  withSnackbar,
  queryRendererHoc({
    query: GET_BASE_COIN,
    name: 'baseData',
  }),
  graphql(generateBrokerKey, {
    name: 'generateBrokerKeyMutation',
    options: refetchOptionsOnKeyAddFunction,
  }),
  graphql(addExchangeKeyMutation, {
    name: 'addExchangeKey',
    options: refetchOptionsOnKeyAddFunction,
  })
)(AddAccountDialog)
