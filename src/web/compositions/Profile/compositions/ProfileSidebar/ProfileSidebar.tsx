import React from 'react'

import { IProps } from '@core/containers/Profile/ProfileSidebar/ProfileSidebar.types'

import { handleLogout } from '@core/utils/loginUtils'

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

const LINKS = [
  // { path: '/profile', text: 'Profile' },
  { path: '/profile/accounts', text: 'Accounts' },
  { path: '/profile/settings', text: 'Settings' },
  // { path: '/profile/billing', text: 'Billing' },
  // { path: '/profile/notifications', text: 'Notifications' },
  { path: '/profile/deposit', text: 'Deposit' },
  { path: '/profile/withdrawal', text: 'Withdrawal' },
  { path: '/profile/api', text: 'Api managment' },
  { path: '/profile/telegram', text: 'Telegram' },
]

const ProfileSidebar = ({
  accountData,
  logoutMutation,
  persistorInstance,
  history: { push },
  path,
}: IProps) => {
  const data = !accountData
    ? { imageUrl: '', username: 'Loading...', email: 'Loading...' }
    : accountData

  const logout = async () => {
    await handleLogout(logoutMutation, persistorInstance)
    push('/login')
  }

  return (
    <SidebarContainer xs={2}>
      <div>
        <UserInfo>
          <UserAvatar src={data.imageUrl} />
          <UserName>{data.username}</UserName>
          <UserEmail>{data.email}</UserEmail>
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
      <LogoutButton onClick={logout}>log out</LogoutButton>
    </SidebarContainer>
  )
}

export default ProfileSidebar
