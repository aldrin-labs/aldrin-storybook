import React from 'react'
import { Checkbox, Radio } from '@material-ui/core'
import QueryRenderer from '@core/components/QueryRenderer'

import { getPortfolioKeys } from '@core/graphql/queries/portfolio/getPortfolioKeys'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'

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

// import { Typography } from '@material-ui/core'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import SvgIcon from '@sb/components/SvgIcon'
import ExchangeLogo from '@icons/ExchangeLogo.svg'

// import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
// import { PortfolioSelector } from '@sb/compositions/Portfolio/compositions'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'

import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'

class Accounts extends React.PureComponent<IProps> {
  state = {
    intervalId: null,
  }

  componentDidMount() {
    const intervalId = setInterval(this.props.refetch, 30000)
    this.setState({ intervalId })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const {
      // isCheckedAll,
      // onToggleAll,
      color,
      newKeys,
      portfolioAssetsData,
      onKeyToggle,
      login,
      isRebalance,
      onKeySelectOnlyOne,
      onKeysSelectAll,
      isSidebar,
      baseCoin,
    } = this.props

    const isUSDT = baseCoin === 'USDT'
    const roundNumber = isUSDT ? 2 : 8

    const accounts = newKeys.map(({ _id, name, selected }) => {
      const account = portfolioAssetsData.filter((asset) => asset.name === name)

      return {
        _id,
        name,
        selected,
        value: account.length > 0 ? account[0].value : 0,
      }
    })

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
            {isRebalance ? (
              <TypographyTitle textColor={'#7284A0'} fontSize={'.9rem'}>
                Choose only one
              </TypographyTitle>
            ) : (
              <TypographyTitle
                textColor={'#165BE0'}
                fontSize={'1.2rem'}
                style={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                }}
                onClick={onKeysSelectAll}
              >
                Select all
              </TypographyTitle>
            )}
          </TypographyFullWidth>

          {/* <Headline color={color}>
            settings
          </Headline> */}
          {/* <CloseContainer>
            <StyledIcon isSideNavOpen={isSideNavOpen} color={color} />
          </CloseContainer> */}
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
          {accounts.map((account, i) => {
            const Component = isRebalance ? Radio : Checkbox
            const isChecked = account.selected

            const formattedValue = addMainSymbol(
              roundAndFormatNumber(account.value, roundNumber, true),
              isUSDT
            )

            return (
              <AccountsListItem
                key={account._id}
                color={color}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                }}
              >
                {isSidebar && (
                  <SvgIcon
                    src={ExchangeLogo}
                    style={{
                      marginRight: '.8rem',
                    }}
                    width="3.5rem"
                    height="auto"
                  />
                )}

                <AccountName
                  align="left"
                  variant="body1"
                  //color={isChecked ? 'secondary' : 'textSecondary'}
                  lineHeight={'2rem'}
                  fontSize={'1.4rem'}
                  textColor={'#7284A0'}
                  letterSpacing="1px"
                >
                  {account.name}
                  <TypographyTitle lineHeight="122.5%">
                    {formattedValue}
                  </TypographyTitle>
                </AccountName>
                <Component
                  disabled={!login}
                  type={isRebalance ? 'radio' : 'checkbox'}
                  color="secondary"
                  id={account.name}
                  checked={isChecked}
                  onClick={() => {
                    if (login && isRebalance) {
                      onKeySelectOnlyOne(account._id)
                    } else if (login && !isRebalance) {
                      onKeyToggle(account._id)
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                  }}
                />
                {isSidebar && (
                  <PortfolioSelectorPopup
                    data={account}
                    allKeysNames={newKeys.map((key) => key.name.toLowerCase())}
                    baseCoin={baseCoin}
                    forceUpdateAccountContainer={() => this.forceUpdate()}
                  />
                )}
              </AccountsListItem>
            )
          })}
        </AccountsList>
        {isSidebar && (
          <AddAccountDialog baseCoin={baseCoin} allKeys={newKeys} />
        )}
      </>
    )
  }
}

export default Accounts
