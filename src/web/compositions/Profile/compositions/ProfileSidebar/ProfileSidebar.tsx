import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { LOGOUT } from '@core/graphql/mutations/login'

import { SidebarContainer } from '@sb/compositions/Profile/Profile.styles'
import {
  UserInfo,
  Navigation,
  NavButton,
  LogoutButton,
  UserAvatar,
  UserName,
  UserEmail,
} from './ProfileSidebar.styles'

import Avatar from '@icons/nezuko.jpg'

const LINKS = [
  { path: '/profile', text: 'Profile' },
  { path: '/profile/accounts', text: 'Accounts' },
  { path: '/profile/settings', text: 'Settings' },
  { path: '/profile/billing', text: 'Billing' },
  { path: '/profile/notifications', text: 'Notifications' },
]

const ProfileSidebar = ({ logoutMutation, path, ...rest }) => {
  return (
    <SidebarContainer xs={2}>
      <div>
        <UserInfo>
          <UserAvatar src={Avatar} />
          <UserName>Nezuko</UserName>
          <UserEmail>nezuko@gmail.com</UserEmail>
        </UserInfo>
        <Navigation>
          {LINKS.map((link) => (
            <NavButton
              to={link.path}
              active={link.path === path}
              key={link.path}
            >
              {link.text}
            </NavButton>
          ))}
        </Navigation>
      </div>
      <LogoutButton to="/profile" onClick={logoutMutation}>
        log out
      </LogoutButton>
    </SidebarContainer>
  )
}

export default compose(graphql(LOGOUT, { name: 'logoutMutation' }))(
  ProfileSidebar
)
