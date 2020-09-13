import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Theme } from '@material-ui/core'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import { GET_MY_PROFILE } from '@core/graphql/queries/profile/getMyProfile'
import { getMyAccount } from '@core/graphql/queries/profile/getMyAccount'

import Dropdown from '@sb/components/Dropdown'
import SvgIcon from '@sb/components/SvgIcon'
import ArrowBottom from '@icons/arrowBottom.svg'

const NavBarProfileSelector = ({
  account,
  theme,
  pathname,
  logout,
  onMouseOver,
}: {
  account: {
    accountById: { imageUrl: string; username: string; email: string }
  }
  theme: Theme
  pathname: string
  logout: () => void
  onMouseOver?: () => void
}) => {
  const [selectedMenu, selectMenu] = useState<string | undefined>(undefined)

  const accountData = (account && account.accountById) || {
    accountData: { imageUrl: '', username: 'Loading...', email: 'Loading...' },
  }

  return (
    <Grid
      item
      direction={'column'}
      alignItems={'center'}
      justify={'center'}
      style={{
        display: 'flex',
        height: '100%',
        borderLeft: theme.palette.border.main,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <Dropdown
        component={(props) => <Link {...props} to="/profile/accounts" />}
        theme={theme}
        id="profile-page"
        key="profile-page"
        pathname={pathname}
        buttonText={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {accountData.email}
            <SvgIcon
              width="1rem"
              height="1rem"
              src={ArrowBottom}
              style={{ marginLeft: '.5rem' }}
            />
          </div>
        }
        selectedMenu={selectedMenu}
        selectActiveMenu={selectMenu}
        onMouseOver={onMouseOver}
        items={[
          // {
          //   text: 'Accounts',
          //   to: '/profile/accounts',
          //   onMouseOver: () => {
          //     if (notAuthPages || !loginStatus) {
          //       return
          //     }

          //     prefetchProfileAccounts()
          //   },
          // },
          {
            text: 'Settings',
            to: '/profile/settings',
          },
          {
            text: 'Deposit',
            to: '/profile/deposit',
          },
          {
            text: 'Withdrawal',
            to: '/profile/withdrawal',
          },
          {
            text: 'Internal Transfer',
            to: '/profile/internal',
          },
          {
            text: 'API',
            to: '/profile/api',
          },
          {
            text: 'Telegram',
            to: '/profile/telegram',
          },
          {
            text: 'Referral',
            to: '/profile/referral',
          },
          // {
          //   text: 'Disable Account',
          //   to: '/profile/disableaccount',
          // },
          {
            text: 'Log out',
            to: `/login?callbackURL=${pathname}`,
            onClick: logout,
            style: {
              color: '#DD6956',
            },
          },
        ]}
      />
    </Grid>
  )
}

export default compose(
  queryRendererHoc({
    query: GET_MY_PROFILE,
    name: 'myProfile',
    withOutSpinner: true,
    withoutLoading: true,
  }),
  graphql(getMyAccount, {
    name: 'account',
    options: (props) => ({
      variables: {
        id:
          props.myProfile && props.myProfile.getMyProfile
            ? props.myProfile.getMyProfile._id
            : '',
      },
    }),
  })
)(NavBarProfileSelector)
