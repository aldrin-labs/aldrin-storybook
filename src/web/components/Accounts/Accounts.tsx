import React from 'react'
import ReactDOM from 'react-dom'
import { Checkbox, Radio, Grid } from '@material-ui/core'

import { IProps } from './Accounts.types'
import {
  AccountsWalletsHeadingWrapper,
  // Headline,
  // CloseContainer,
  // StyledIcon,
  // SelectAll,
  AccountName,
  // AccountMoney,
  AccountsList,
  AccountsListItem,
  TypographyTitle,
  AddAccountButtonContainer,
} from '@sb/styles/selectorSharedStyles'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

import LightTooltip from '@sb/components/TooltipCustom/LightTooltip'

// import { Typography } from '@material-ui/core'
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'
import SvgIcon from '@sb/components/SvgIcon'
import ExchangeLogo from '@icons/ExchangeLogo.svg'
import BrokerIconLogo from '@icons/brokerIconLogo.svg'
import FuturesWarsIconLogo from '@icons/futuresWarsIconLogo.svg'

import Help from '@material-ui/icons/Help'

// import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
// import { PortfolioSelector } from '@sb/compositions/Portfolio/compositions'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'
import ReimportKey from '@core/components/ReimportKey/ReimportKey'

import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import HelpTooltip from '@sb/components/TooltipCustom/HelpTooltip'
import { TooltipCustom } from '@sb/components/index'

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
      color,
      keys = [],
      portfolioAssetsData,
      portfolioAssetsMap,
      onKeyToggle,
      login,
      isRebalance,
      isTransactions,
      onKeySelectOnlyOne,
      onKeysSelectAll,
      isSidebar,
      baseCoin,
      isSideNavOpen,
      activeKeys,
      addAditionalAccount,
    } = this.props

    const isUSDT = baseCoin === 'USDT'
    const roundNumber = isUSDT ? 2 : 8

    return (
      <>
        <AccountsWalletsHeadingWrapper>
          <Grid
            container
            justify="space-between"
            style={isTransactions ? { padding: '0 1.5rem 0 1rem' } : {}}
          >
            {/* 🔑 Api keys */}
            <TypographyTitle textColor={'#7284A0'}>Accounts</TypographyTitle>
            {isRebalance ? (
              <>
                <TypographyTitle
                  textColor={'#7284A0'}
                  fontSize={'.9rem'}
                  style={{ paddingRight: '.5rem', fontWeight: 'bold' }}
                >
                  Choose only one
                </TypographyTitle>
                <HelpTooltip
                  title={
                    <span>
                      'We cannot transfer funds from key to key or exchange to
                      exchange. Also, the rebalance between the two exchanges is
                      impossible due to the difference in price.'
                    </span>
                  }
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: 0,
                    transform: 'translate(100%, -50%)',
                    height: '1.5rem',
                    width: '1.5rem',
                    color: '#005dd9',
                  }}
                />
              </>
            ) : (
              <TypographyTitle
                textColor={'#165BE0'}
                fontSize={'1.2rem'}
                style={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                }}
                onClick={async () => {
                  await onKeysSelectAll()
                }}
              >
                Select all
              </TypographyTitle>
            )}
          </Grid>
        </AccountsWalletsHeadingWrapper>
        <AccountsList id="AccountsList" isTransactions={isTransactions}>
          {keys.map((key, i) => {
            if (!key) {
              return null
            }

            const Component = isRebalance ? Radio : Checkbox
            const isChecked = key.selected

            const formattedValue = addMainSymbol(
              roundAndFormatNumber(
                portfolioAssetsMap.get(key._id)
                  ? portfolioAssetsMap.get(key._id).value
                  : 0,
                roundNumber,
                true
              ),
              isUSDT
            )

            return (
              <AccountsListItem
                key={`${key._id}${i}`}
                color={color}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                }}
              >
                {isSidebar && (
                  <SvgIcon
                    src={
                      key.isFuturesWars
                        ? FuturesWarsIconLogo
                        : key.isBroker
                        ? BrokerIconLogo
                        : ExchangeLogo
                    }
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
                  style={{ paddingLeft: '1rem' }}
                >
                  <TooltipCustom
                    title={key.name}
                    component={
                      <span
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {' '}
                        {key.name}{' '}
                      </span>
                    }
                  />
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
                  onClick={async () => {
                    if (login && isRebalance) {
                      await onKeySelectOnlyOne(key._id)
                    } else if (login && !isRebalance) {
                      if (key.selected && activeKeys.length === 1) return null
                      await onKeyToggle(key._id)
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                  }}
                />
                {isSidebar && (
                  <>
                    <PortfolioSelectorPopup
                      id={`popup${key._id}${i}`}
                      needPortalPopup={true}
                      needPortalMask={true}
                      data={key}
                      baseCoin={baseCoin}
                      isSideNavOpen={isSideNavOpen}
                      forceUpdateAccountContainer={() => this.forceUpdate()}
                    />
                    <Grid style={{ padding: '0 0 0 6px' }}>
                      <ReimportKey keyId={key._id} />
                    </Grid>
                  </>
                )}
              </AccountsListItem>
            )
          })}
        </AccountsList>
        {isSidebar && (
          <>
            {/* <AddAccountButtonContainer>
              <AddAccountDialog
                numberOfKeys={keys.length}
                baseCoin={baseCoin}
                includeBrokerKey={false}
                includeCommonBinanceKey={true}
              />
            </AddAccountButtonContainer> */}
            <AddAccountButtonContainer>
              <AddAccountDialog
                includeBrokerKey={true}
                includeCommonBinanceKey={false}
                numberOfKeys={keys.length}
                baseCoin={baseCoin}
                addAditionalAccount={addAditionalAccount}
              />
            </AddAccountButtonContainer>
          </>
        )}
      </>
    )
  }
}

export default Accounts
