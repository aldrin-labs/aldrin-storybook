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
    isSelected: true,
    name: '',
    apiKey: '',
    secretOfApiKey: '',
    exchange: '',
    error: '',
  }

  handleSubmit = async () => {
    const { name, apiKey, secretOfApiKey, exchange } = this.state

    const variables = {
      name,
      apiKey,
      secret: secretOfApiKey,
      exchange: exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
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
        secret: '',
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
    console.log('e', e.value)
    this.setState({ exchange: e.value.toLowerCase() })
  }

  handleRadioBtn = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    })
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const {
      theme: {
        palette: { black },
      },
    } = this.props

    const { name, apiKey, secretOfApiKey, exchange, error } = this.state

    return (
      <>
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
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            onClose={this.handleClose}
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

                console.log('end', response)
                if (response) this.handleClose()
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
                <LinkCustom href={'#'}>How to get keys?</LinkCustom>

                <BtnCustom
                  btnWidth={'85px'}
                  borderRadius={'32px'}
                  btnColor={'#165BE0'}
                  type="submit"
                >
                  ADD
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
    options: ({ baseCoin }: { baseCoin: 'USDT' | 'BTC' }) => ({
      refetchQueries: [
        {
          query: portfolioKeyAndWalletsQuery,
          variables: { baseCoin },
        },
        { query: getKeysQuery },
        { query: keysNames },
      ],
    }),
  })
)(AddAccountDialog)
