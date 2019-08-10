import React from 'react'
import { Checkbox, Radio, Grid } from '@material-ui/core'

import { IProps } from './Accounts.types'
import {
  AccountsWalletsHeadingWrapper,
  Headline,
  CloseContainer,
  StyledIcon,
  SelectAll,
  AccountName,
  AccountMoney,
  AccountsList,
  AccountsListItem,
  TypographyTitle,
} from '@sb/styles/selectorSharedStyles'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

import { Typography } from '@material-ui/core'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'

import SvgIcon from '@sb/components/SvgIcon'
import ExchangeLogo from '@icons/ExchangeLogo.svg'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { PortfolioSelector } from '@sb/compositions/Portfolio/compositions';

import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'

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
      isSidebar
    } = this.props

    return (
      <>
        <AccountsWalletsHeadingWrapper>
          <TypographyFullWidth
            gutterBottom={true}
            align="left"
            color="secondary"
            variant="h6"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {/* 🔑 Api keys */}
            <TypographyTitle textColor={'#7284A0'}>Accounts</TypographyTitle>
            <TypographyTitle textColor={'#7284A0'} fontSize={'.9rem'}>Select All</TypographyTitle>
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
              <AccountsListItem
                key={keyName.name}
                color={color}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                }}
              >
                {isSidebar && <SvgIcon src={ExchangeLogo} style={{
                  marginRight: '.8rem'
                }} width="3.5rem" height="auto"/>}

                <AccountName
                    align="left"
                    variant="body1"
                    //color={isChecked ? 'secondary' : 'textSecondary'}
                    lineHeight={'2rem'}
                    fontSize={'1.4rem'}
                    textColor={'#7284A0'}
                    letterSpacing="1px"
                  >
                    {keyName.name}
                    <TypographyTitle lineHeight="122.5%">$500,000.00</TypographyTitle>
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
                  style={{
                    padding: '6px 12px'
                  }}
                />
                {isSidebar && <PortfolioSelectorPopup
                    accountName={keyName.name}
                    forceUpdateAccountContainer={() => this.forceUpdate()}
                  />
                }
              </AccountsListItem>
            )
          })}
        </AccountsList>
        {isSidebar && <AddAccountDialog />}
      </>
    )
  }
}
