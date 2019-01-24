import React from 'react'
import { Checkbox } from '@material-ui/core'

import { IProps } from './Wallets.types'
import {
  AccountName,
  AccountsList,
  AccountsListItem,
} from '@storybook/styles/selectorSharedStyles'

export default class Wallets extends React.PureComponent<IProps> {
  render() {
    const { color, onWalletToggle, newWallets, login} = this.props

    return (
      <AccountsList>
        {newWallets.map((wallet) => {
          if (!wallet) {
            return null
          }
          const isChecked = wallet.selected

          return (
            <AccountsListItem key={wallet.name} color={color}>
              <Checkbox
                disabled={!login}
                type="checkbox"
                id={wallet.name}
                checked={isChecked}
                onClick={() => (login && onWalletToggle(wallet._id))}
              />

              <AccountName
                align="left"
                variant="body1"
                color={isChecked ? 'secondary' : 'textSecondary'}
              >
                {wallet.name}
              </AccountName>
            </AccountsListItem>
          )
        })}
      </AccountsList>
    )
  }
}
