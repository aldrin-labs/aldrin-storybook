import React, { Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import { compose } from 'recompose'

import { Loading } from '@sb/components/index'
import { MainContainer } from '@sb/compositions/Profile/Profile.styles'
import { CenterContainer, ComingSoon } from './ProfileRoutes.styles'

const ComingSoonBlock = () => (
  <CenterContainer>
    <ComingSoon>Coming Soon</ComingSoon>
  </CenterContainer>
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
          {/* total portfolio - 14% height, next 14 * 3, next rest */}
          <Route
            exact
            path="/profile/accounts"
            render={(...rest) => <div>accounts</div>}
          />
          <Route
            exact
            path="/profile/settings"
            render={(...rest) => <div>settings</div>}
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
        </Switch>
      </Suspense>
    </MainContainer>
  )
}

export default compose(withRouter)(ProfileRouter)
