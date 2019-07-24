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
  TypographyTitle,
} from '@sb/styles/selectorSharedStyles'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

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
            align="left"
            color="secondary"
            variant="h6"
          >
            {/* 🔑 Api keys */}
            Accounts
          </TypographyFullWidth>

          <Headline isSideNavOpen={isSideNavOpen} color={color}>
            settings
          </Headline>
          <CloseContainer>
            {/* <StyledIcon isSideNavOpen={isSideNavOpen} color={color} /> */}
          </CloseContainer>
        </AccountsWalletsHeadingWrapper>
{/* 
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
        )} */}
        <AccountsList id="AccountsList">
          {newKeys.map((keyName) => {
            if (!keyName) {
              return null
            }
            const Component = isRebalance ? Radio : Checkbox
            const isChecked = keyName.selected

            return (
              <AccountsListItem key={keyName.name} color={color}>
                <AccountName
                  align="left"
                  variant="body1"
                  //color={isChecked ? 'secondary' : 'textSecondary'}
                  lineHeight={'20px'}
                  fontSize={'0.94rem'}
                  textColor={'#7284A0'}
                >
                  {keyName.name}
                  <TypographyTitle>$500,000.00</TypographyTitle>
                </AccountName>
                <Component
                  disabled={!login}
                  type={isRebalance ? 'radio' : 'checkbox'}
                  color="secondary"
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
              </AccountsListItem>
            )
          })}

          <AddAccountDialog />
        </AccountsList>
      </>
    )
  }
}
