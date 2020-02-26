import React from 'react'
import { compose } from 'recompose'
import withAuth from '@core/hoc/withAuth'

import { ProfileContainer } from './Profile.styles'

import ProfileSidebar from '@core/containers/Profile/ProfileSidebar/ProfileSidebar'
import ProfileRouter from './compositions/ProfileRouter/ProfileRouter'

const Profile = ({ location }) => {
  return (
    <ProfileContainer container>
      <ProfileSidebar location={location} />
      <ProfileRouter />
    </ProfileContainer>
  )
}

export default compose(withAuth)(Profile)
