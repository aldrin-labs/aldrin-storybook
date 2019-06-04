import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import {
  Switch,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Card,
} from '@material-ui/core'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { MASTER_BUILD } from '@core/utils/config'
import withAuth from '@core/hoc/withAuth'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import ComingSoon from '@sb/components/ComingSoon'
import { CardHeader } from '@sb/components/index'
import {
  KeysList,
  AddExchangeKey,
  CryptoWalletsList,
  AddCryptoWallet,
} from './components'
import { IProps, IState } from './User.types'
import { GET_MOCKS_MODE } from '@core/graphql/queries/app/getMocksMode'
import { toggleMocks } from '@core/graphql/mutations/app/toggleMocks'

class UserContainer extends React.Component<IProps, IState> {
  state: IState = {
    showBinanceWarning: true,
  }

  forceUpdateUserContainer = () => {
    this.forceUpdate()
  }

  updateBinanceWarning = () => {
    this.setState((prevState) => ({
      showBinanceWarning: !prevState,
    }))
  }

  render() {
    const { showBinanceWarning } = this.state

    const {
      getMocksModeQuery: {
        app: { mocksEnabled },
      },
      toggleMocksMutation,
    } = this.props

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
              onChange={async () => toggleMocksMutation()}
              checked={mocksEnabled}
            />
          </AdminCP>
        )}
        <Dialog
          id="UserPageWarning"
          fullScreen={false}
          open={showBinanceWarning}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {
              'We currently support only Binance exchange and will be adding more exchanges soon!'
            }
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => this.updateBinanceWarning()}
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

export const User = compose(
  graphql(toggleMocks, {
    name: 'toggleMocksMutation',
  }),
  queryRendererHoc({
    query: GET_MOCKS_MODE,
    name: 'getMocksModeQuery',
  }),
  withAuth,
  withErrorFallback
)(UserContainer)
