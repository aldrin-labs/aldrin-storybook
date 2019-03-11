import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'
import { MASTER_BUILD } from '@core/utils/config'
import { updateBinanceWarning, toggleMocks } from '@core/redux/user/actions'

import ComingSoon from '@sb/components/ComingSoon'
import { CardHeader } from '@sb/components/index'

import {
  KeysList,
  AddExchangeKey,
  CryptoWalletsList,
  AddCryptoWallet,
} from './components'

import {
  Switch,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Card,
} from '@material-ui/core'

class UserContainer extends React.Component {
  store: any

  toggleMocks = () => {
    const { toggleMocks: toggleMockups } = this.props

    toggleMockups()
  }

  forceUpdateUserContainer = () => {
    this.forceUpdate()
  }

  render() {
    //TODO: Made it with react-apollo-hooks
    const {
      loginDataQuery: { login: { loginStatus } } = {
        login: { loginStatus: null },
      },
    } = this.props

    if (!loginStatus) {
      return <Redirect to="/portfolio" />
    }
    return (
      <>
        <UserWrap>
          <AddExchangeKey
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
          <KeysList forceUpdateUserContainer={this.forceUpdateUserContainer} />
        </UserWrap>

        <UserWrap style={MASTER_BUILD ? { filter: 'blur(3px)' } : {}}>
          {MASTER_BUILD && <ComingSoon />}

          <AddCryptoWallet
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
          <CryptoWalletsList
            forceUpdateUserContainer={this.forceUpdateUserContainer}
          />
        </UserWrap>
        {!MASTER_BUILD && (
          <AdminCP>
            <CardHeader title="Show mocks" />
            <Switch
              onChange={this.toggleMocks}
              checked={this.props.isShownMocks}
            />
          </AdminCP>
        )}
        <Dialog
          id="UserPageWarning"
          fullScreen={false}
          open={this.props.showBinanceWarning}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {
              'We currently support only Binance exchange and will be adding more exchanges soon!'
            }
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => this.props.updateBinanceWarning(false)}
              color="secondary"
              autoFocus={true}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

const AdminCP = styled(Card)`
  margin: 1rem;
  width: 10em;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const UserWrap = styled.div`
  display: flex;
  margin: 10px;
`

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  // loginStatus: store.login.loginStatus,
  showBinanceWarning: store.user.showBinanceWarning,
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleMocks: () => dispatch(toggleMocks()),
  updateBinanceWarning: (payload: boolean) =>
    dispatch(updateBinanceWarning(payload)),
})

const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContainer)

export const User = compose(
  withErrorFallback,
  graphql(GET_LOGIN_DATA, {
    name: 'loginDataQuery',
    options: {
      fetchPolicy: 'network-only',
    },
  })
)(storeComponent)
