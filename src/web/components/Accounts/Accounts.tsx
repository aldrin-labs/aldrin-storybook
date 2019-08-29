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
      isSideNavOpen,
      // isCheckedAll,
      // onToggleAll,
      color,
      newKeys,
      portfolioKeys,
      onKeyToggle,
      login,
      isRebalance,
      onKeySelectOnlyOne,
      onKeysSelectAll,
      isSidebar,
      baseCoin,
    } = this.props

    const { portfolioAssetsData } = getPortfolioAssetsData(
      portfolioKeys.myPortfolios[0].portfolioAssets
    )

    const isUSDT = baseCoin === 'USDT'
    const roundNumber = isUSDT ? 2 : 8

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
          {newKeys.map((key, i) => {
            if (!key) {
              return null
            }
            const Component = isRebalance ? Radio : Checkbox
            const isChecked = key.selected

            const value = portfolioAssetsData[i]
              ? portfolioAssetsData[i].value
              : 0

            const formattedValue = addMainSymbol(
              roundAndFormatNumber(value, roundNumber, true),
              isUSDT
            )

            return (
              <AccountsListItem
                key={key._id}
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
                  {key.name}
                  <TypographyTitle lineHeight="122.5%">
                    {formattedValue}
                  </TypographyTitle>
                </AccountName>
                <Component
                  disabled={!login}
                  type={isRebalance ? 'radio' : 'checkbox'}
                  color="secondary"
                  id={key.name}
                  checked={isChecked}
                  onClick={() => {
                    if (login && isRebalance) {
                      onKeySelectOnlyOne(key._id)
                    } else if (login && !isRebalance) {
                      onKeyToggle(key._id)
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                  }}
                />
                {isSidebar && (
                  <PortfolioSelectorPopup
                    data={key}
                    baseCoin={baseCoin}
                    forceUpdateAccountContainer={() => this.forceUpdate()}
                  />
                )}
              </AccountsListItem>
            )
          })}
        </AccountsList>
        {isSidebar && <AddAccountDialog baseCoin={baseCoin} />}
      </>
    )
  }
}

const APIWrapper = (props) => {
  return (
    <QueryRenderer
      {...props}
      component={Accounts}
      query={getPortfolioKeys}
      name="portfolioKeys"
      variables={{ baseCoin: props.baseCoin }}
    />
  )
}

export default APIWrapper
