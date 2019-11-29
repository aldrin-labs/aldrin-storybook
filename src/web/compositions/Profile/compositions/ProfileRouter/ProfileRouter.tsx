import React, { Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import { compose } from 'recompose'

import { Loading } from '@sb/components/index'
import { MainContainer } from '@sb/compositions/Profile/Profile.styles'
import { CenterContainer, ComingSoon } from './ProfileRouter.styles'

export const ComingSoonBlock = () => (
  <CenterContainer>
    <ComingSoon>Coming Soon</ComingSoon>
  </CenterContainer>
)

const Accounts = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@core/containers/Profile/ProfileAccounts/ProfileAccounts')
)

const Settings = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@sb/compositions/Profile/compositions/ProfileSettings/ProfileSettings')
)

const Deposit = React.lazy(() => 
  import(/* webpackPrefetch: true */ '@sb/compositions/Profile/compositions/Deposit/Deposit')
)

const ProfileRouter = () => {
  return (
    <MainContainer>
      <Suspense fallback={<Loading centerAligned />}>
        <Switch>
          <Route
            exact
            path="/profile"
            render={(...rest) => <ComingSoonBlock />}
          />
          <Route
            exact
            path="/profile/accounts"
            render={(...rest) => <Accounts />}
          />
          <Route
            exact
            path="/profile/settings"
            render={(...rest) => <Settings />}
          />
          <Route
            exact
            path="/profile/billing"
            render={(...rest) => <ComingSoonBlock />}
          />
          <Route
            exact
            path="/profile/notifications"
            render={(...rest) => <ComingSoonBlock />}
          />
          <Route
            exact
            path="/profile/deposit"
            render={(...rest) => <Deposit />}
          />
        </Switch>
      </Suspense>
    </MainContainer>
  )
}

export default compose(withRouter)(ProfileRouter)
