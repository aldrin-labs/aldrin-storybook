import React from 'react'
import { withStyles } from '@material-ui/core/styles'
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

import SvgIcon from '@sb/components/SvgIcon'
import Plus from '@icons/Plus.svg'

import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { keysNames } from '@core/graphql/queries/chart/keysNames'
import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { addExchangeKeyMutation } from '@core/graphql/mutations/user/addExchangeKeyMutation'

import SelectExchangeList from '@sb/components/SelectExchangeList/SelectExchangeList'
// import { handleSelectChangePrepareForFormik } from '@core/utils/UserUtils'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { IState, IProps } from './AddAccountDialog.types'
import GetKeysInfo from '@sb/components/Onboarding/GetKeysInfo/GetKeysInfo'
import Steps from '@sb/components/Onboarding/Steps/Steps'

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme()
class AddAccountDialog extends React.Component<IProps, IState> {
  state: IState = {
    open: false,
    openGetKeysInfo: false,
    isSelected: true,
    name: '',
    apiKey: '',
    secretOfApiKey: '',
    exchange: '',
    error: '',
  }

  handleSubmit = async () => {
    const { name, apiKey, secretOfApiKey, exchange } = this.state

    const trimmedName = name.trim()

    const variables = {
      name: trimmedName,
      apiKey,
      secret: secretOfApiKey,
      exchange: exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
    }

    if (trimmedName.length < 3) {
      this.setState({ error: 'Please enter name with at least 3 characters ' })
      return false
    }

    if (trimmedName.length > 20) {
      this.setState({ error: 'Please limit name to 20 characters ' })
      return false
    }

    try {
      const { data } = await this.props.addExchangeKey({
        variables,
        update: (proxy, { data: { addExchangeKey } }) => {
          const proxyData = proxy.readQuery({ query: getKeysQuery })
          proxyData.myPortfolios[0].keys.push(addExchangeKey)
          proxy.writeQuery({ query: getKeysQuery, data: proxyData })
        },
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
    this.setState({ open: false })
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

  render() {
    const {
      theme: {
        palette: { black },
      },
      open,
      onboarding = undefined,
      setCurrentStep,
    } = this.props

    const { name, apiKey, secretOfApiKey, exchange, error } = this.state

    return (
      <>
        <GetKeysInfo
          open={this.state.openGetKeysInfo}
          handleClose={this.handleCloseGetKeys}
        />

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

        <DialogWrapper
          maxWidth="xl"
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
              {onboarding ? (
                <>
                  connect your exchanges - <Steps current={2} />
                </>
              ) : (
                'Add Api Key'
              )}
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
                  if (onboarding) {
                    setCurrentStep('congratulations')
                  } else {
                    this.handleClose()
                  }
                }
              }}
              style={{ minWidth: '440px' }}
            >
              <Grid>
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
                      color: '#7284A0',
                      opacity: '1',
                    }}
                    singleValueStyles={{
                      height: 'auto',
                      width: 'auto',
                      color: 'rgb(114, 132, 160);',
                      overflow: 'auto',
                    }}
                    optionStyles={{
                      color: '#6D7786',
                      fontSize: '1.3rem',
                    }}
                  />
                </GridCustom>
                <GridCustom>
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
                </GridCustom>
                <GridCustom>
                  <Legend>Api key</Legend>
                  <InputBaseCustom
                    id="apiKey"
                    type="text"
                    name="apiKey"
                    label="API Key"
                    value={apiKey}
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
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Enter secret key here..."
                    type="text"
                    // margin="dense"
                  />
                </GridCustom>
              </Grid>

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
                  {onboarding ? 'FINISH' : 'ADD'}
                </BtnCustom>
              </Grid>
            </form>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default compose(
  graphql(addExchangeKeyMutation, {
    name: 'addExchangeKey',
    options: ({
      baseCoin,
      onboarding,
    }: {
      baseCoin: 'USDT' | 'BTC'
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
          ]
        : [],
    }),
  })
)(AddAccountDialog)
