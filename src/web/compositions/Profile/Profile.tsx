import React from 'react'
import { compose } from 'recompose'
import withAuth from '@core/hoc/withAuth'

import { ProfileContainer } from './Profile.styles'

import ProfileSidebar from './compositions/ProfileSidebar/ProfileSidebar'
import ProfileRouter from './compositions/ProfileRouter/ProfileRouter'

const Profile = ({ location }) => {
  return (
    <ProfileContainer container>
      <ProfileSidebar path={location.pathname} />
      <ProfileRouter />
    </ProfileContainer>
  )
}

export default compose(withAuth)(Profile)
