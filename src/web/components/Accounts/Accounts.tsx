import React from 'react'
import { Checkbox, Radio } from '@material-ui/core'

import { IProps } from './Accounts.types'
import {
  AccountsWalletsHeadingWrapper,
  Headline,
  CloseContainer,
  StyledIcon,
  SelectAll,
  AccountName,
  AccountsList,
  AccountsListItem,
} from '@sb/styles/selectorSharedStyles'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

export default class Accounts extends React.PureComponent<IProps> {
  render() {
    const {
      isSideNavOpen,
      isCheckedAll,
      onToggleAll,
      color,
      newKeys,
      onKeyToggle,
      login,
      isRebalance,
      onKeySelectOnlyOne,
    } = this.props

    return (
      <>
        <AccountsWalletsHeadingWrapper>
          <TypographyFullWidth
            gutterBottom={true}
            align="center"
            color="secondary"
            variant="h6"
          >
            🔑 Api keys
          </TypographyFullWidth>

          <Headline isSideNavOpen={isSideNavOpen} color={color}>
            settings
          </Headline>
          <CloseContainer>
            <StyledIcon isSideNavOpen={isSideNavOpen} color={color} />
          </CloseContainer>
        </AccountsWalletsHeadingWrapper>

        {!isRebalance && (
          <SelectAll>
            <Checkbox
              disabled={!login}
              type="checkbox"
              id="all"
              checked={isCheckedAll}
              onClick={login && onToggleAll}
            />

            <AccountName
              variant="body1"
              color={isCheckedAll ? 'secondary' : 'textSecondary'}
            >
              Select All
            </AccountName>
          </SelectAll>
        )}
        <AccountsList id="AccountsList">
          {newKeys.map((keyName) => {
            if (!keyName) {
              return null
            }
            const Component = isRebalance ? Radio : Checkbox
            const isChecked = keyName.selected

            return (
              <AccountsListItem key={keyName.name} color={color}>
                <Component
                  disabled={!login}
                  type={isRebalance ? 'radio' : 'checkbox'}
                  id={keyName.name}
                  checked={isChecked}
                  onClick={() => {
                    if (login && isRebalance) {
                      onKeySelectOnlyOne(keyName._id)
                    } else if (login && !isRebalance) {
                      onKeyToggle(keyName._id)
                    }
                  }}
                />
                <AccountName
                  align="left"
                  variant="body1"
                  color={isChecked ? 'secondary' : 'textSecondary'}
                >
                  {keyName.name}
                </AccountName>
              </AccountsListItem>
            )
          })}
        </AccountsList>
      </>
    )
  }
}
