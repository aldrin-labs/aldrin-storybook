import React, { useState } from 'react'

import { getAccountsFunds } from '@core/graphql/queries/chart/getAccountsFunds'
import { selectTradingKey } from '@core/graphql/mutations/user/selectTradingKey'
import { GET_TRADING_SETTINGS } from '@core/graphql/queries/user/getTradingSettings'
import { selectProfileKey } from '@core/components/SelectKeyListDW/SelectKeyListDW'
import { updateDepositSettings } from '@core/graphql/mutations/user/updateDepositSettings'
import { getThemeMode } from '@core/graphql/queries/chart/getThemeMode'
import { getSelectedKeys } from '@core/graphql/queries/portfolio/main/getSelectedKeys'
import { updatePortfolioSettingsMutation } from '@core/graphql/mutations/portfolio/updatePortfolioSettingsMutation'

import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'
import DarkRocket from '@icons/darkRocket.gif'
import { graphql } from 'react-apollo'
import { client } from '@core/graphql/apolloClient'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'

import SvgIcon from '@sb/components/SvgIcon'

import WhitePen from '@icons/pencil.svg'
import BluePen from '@icons/bluePencil.svg'
import Rocket from '@icons/rocket.gif'

import {
  Container,
  AccountTitle,
  Stroke,
  Name,
  AddPortfolioBtn,
  Balances,
} from './index.styles'
import { NavLink as Link } from 'react-router-dom'

import { RenameKeyDialog } from '@core/components/RenameDialog/RenameKeyDialog'

const KeysComponent = ({
  isChartPage,
  theme,
  id,
  selectStyles,
  value,
  marketType,
  getAccountsFundsQuery,
  selectTradingKeyMutation,
  getTradingSettingsQuery,
  updateDepositSettingsMutation,
  updatePortfolioSettings,
  getThemeModeQuery,
  getSelectedKeysQuery,
  portfolio,
}: {
  theme: Theme
  id: string
  selectStyles: () => void
  value: string
  marketType: number
  portfolio: string
}) => {
  const Deposit = (props: any) => <Link to="/profile/deposit" {...props} />

  const [account, chooseAccount] = useState(
    getTradingSettingsQuery?.getTradingSettings?.selectedTradingKey
  )
  const [isEditPopupOpen, changePopupState] = useState(false)
  const [accountToRename, chooseAccountToRename] = useState({})
  const [creatingAdditionalAccount, startCreatingAdditionalAccount] = useState(
    false
  )
  const [selectedKeys, selectKeys] = useState<string[]>(
    isChartPage
      ? ['']
      : getSelectedKeysQuery?.myPortfolios[0]?.userSettings?.keys
          .filter((key) => key.selected)
          .map((key) => key._id)
  )

  const selectKey = async (
    account: string,
    hedgeMode: boolean,
    isFuturesWarsKey: boolean
  ) => {
    client.writeQuery({
      query: GET_TRADING_SETTINGS,
      data: {
        getTradingSettings: {
          selectedTradingKey: account,
          hedgeMode,
          isFuturesWarsKey,
          __typename: 'selectedTradingKey',
        },
      },
    })

    await selectTradingKeyMutation({
      variables: {
        input: {
          keyId: account,
        },
      },
    })
  }

  const handleChange = async ({
    value,
    hedgeMode,
    isFuturesWarsKey,
  }: {
    value: string
    hedgeMode: boolean
    isFuturesWarsKey: boolean
  }) => {
    const objForQuery = {
      settings: {
        portfolioId: portfolio,
        // [isRebalance ? 'selectedRebalanceKeys' : 'selectedKeys']: [toggledKeyID],
        selectedKeys: selectedKeys,
      },
    }

    if (isChartPage) {
      await selectKey(value, hedgeMode, isFuturesWarsKey)
    } else {
      await updatePortfolioSettings({
        variables: objForQuery,
      })
    }
  }

  const themeMode =
    (getThemeModeQuery &&
      getThemeModeQuery.getAccountSettings &&
      getThemeModeQuery.getAccountSettings.themeMode) ||
    'light'

  const isLoading = getAccountsFundsQuery.loading

  return (
    <Container
      theme={theme}
      isLoading={isLoading}
      width={'calc(60%)'}
      style={{ paddingRight: isLoading ? 'none' : '2rem' }}
    >
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {' '}
          <span>
            {' '}
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                lineHeight: '3rem',
                fontSize: '1.1rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'Avenir Next Light',
                  color: theme.palette.grey.selectorText,
                }}
              >
                It seems to take a while to load your accounts.
              </span>
              <span
                style={{
                  color: theme.palette.grey.selectorText,
                  fontFamily: 'Avenir Next Light',
                }}
              >
                Wait a few more seconds please, they are on their way.
              </span>
            </span>
            <span
              style={{
                width: '35rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {' '}
              <img
                src={themeMode === 'dark' && isChartPage ? DarkRocket : Rocket}
                width={'75%'}
              />
            </span>
          </span>
        </div>
      ) : (
        <span>
          {getAccountsFundsQuery.getAccountsFunds.map((el) => (
            <Stroke theme={theme} padding={'0'}>
              {' '}
              <AccountTitle theme={theme} isActive={account === el.keyId}>
                {' '}
                <Name theme={theme} isActive={account === el.keyId}>
                  {' '}
                  <input
                    type={isChartPage ? 'radio' : 'checkbox'}
                    value={el.keyId}
                    id={el.keyId}
                    checked={
                      isChartPage
                        ? account === el.keyId
                        : selectedKeys.includes(el.keyId)
                    }
                    style={{ marginRight: '1rem' }}
                    onChange={(e) => {
                      // state change
                      if (!isChartPage) {
                        selectKeys(
                          selectedKeys.includes(el.keyId)
                            ? [
                                ...selectedKeys.filter(
                                  (keyId) => keyId !== el.keyId
                                ),
                              ]
                            : [...selectedKeys, el.keyId]
                        )
                      } else {
                        chooseAccount(el.keyId)
                      }

                      // mutation
                      handleChange({
                        value: el.keyId,
                        hedgeMode: el.hedgeMode,
                        isFuturesWarsKey: el.isFuturesWarsKey,
                      })
                    }}
                  ></input>
                  <label
                    style={{
                      cursor: 'pointer',
                      color:
                        account === el.keyId
                          ? theme.palette.grey.activeBtnText
                          : theme.palette.grey.selectorText,
                      fontSize: '1.7rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    htmlFor={el.keyId}
                  >
                    {el.keyName}
                  </label>
                </Name>
                <SvgIcon
                  onClick={() => {
                    changePopupState(!isEditPopupOpen)
                    chooseAccountToRename({ name: el.keyName, _id: el.keyId })
                    console.log('elid', el.keyId, el.keyName)
                  }}
                  src={account === el.keyId ? WhitePen : BluePen}
                />
              </AccountTitle>{' '}
              <Balances>${el.totalValue.toFixed(2)}</Balances>
              <div style={{ display: 'flex', width: '20%' }}>
                <NavLinkButton
                  key="deposit"
                  page={`deposit`}
                  component={Deposit}
                  style={{
                    border: 'none',
                    btnWidth: '100%',
                    backgroundColor: 'none',
                    color: '#165be0',
                    fontSize: '1.3rem',
                    fontFamily: 'Avenir Next Medium',
                    outline: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#165be0',
                      fontSize: '1.3rem',
                      fontFamily: 'Avenir Next Medium',
                      outline: 'none',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => {
                    selectProfileKey({
                      keyId: el.keyId,
                      isDeposit: true,
                      mutation: updateDepositSettingsMutation,
                    }),
                      console.log('deposit')
                  }}
                >
                  {' '}
                  Deposit
                </NavLinkButton>
              </div>
            </Stroke>
          ))}{' '}
        </span>
      )}
      {isLoading ? null : (
        <Stroke theme={theme} style={{ borderTop: theme.palette.border.main }}>
          <AddPortfolioBtn
            onClick={() => {
              startCreatingAdditionalAccount(!creatingAdditionalAccount)
            }}
            width={'60%'}
          >
            + Add new account
          </AddPortfolioBtn>
        </Stroke>
      )}
      {isEditPopupOpen ? (
        <RenameKeyDialog
          portfolioId={portfolio}
          needRenameButton={false}
          data={accountToRename}
          baseCoin={'USDT'}
          forceUpdateUserContainer={() => {}}
          isPortfolio={false}
          closeMainPopup={() => changePopupState(false)}
          marketType={marketType}
          theme={theme}
        />
      ) : null}
      {creatingAdditionalAccount && (
        <PopupStart
          open={true}
          marketType={marketType}
          portfolioId={portfolio}
          creatingAdditionalAccount={true}
          completeOnboarding={() => {
            startCreatingAdditionalAccount(false)
            // ask Anton
            // sleep(5000)
            // getAccountsFundsQuery.refetch()
          }}
          onboarding={false}
        />
      )}
    </Container>
  )
}

export default compose(
  queryRendererHoc({
    query: getThemeMode,
    name: 'getThemeModeQuery',
    // skip: (props: any) => !props.authenticated,
    fetchPolicy: 'cache-first',
  }),
  queryRendererHoc({
    query: getAccountsFunds,
    name: 'getAccountsFundsQuery',
    withOutSpinner: true,
    withoutLoading: true,
    variables: (props) => ({
      input: {
        marketType: props.marketType,
        portfolioId: props.portfolio,
      },
    }),
  }),
  queryRendererHoc({
    query: getSelectedKeys,
    name: 'getSelectedKeysQuery',
    skip: (props: any) => props.isChartPage,
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: GET_TRADING_SETTINGS,
    name: 'getTradingSettingsQuery',
    // skip: (props: any) => !props.authenticated,
    withOutSpinner: true,
    fetchPolicy: 'cache-only',
    skip: (props: any) => !props.isChartPage,
  }),
  graphql(selectTradingKey, {
    name: 'selectTradingKeyMutation',
  }),
  graphql(updateDepositSettings, {
    name: 'updateDepositSettingsMutation',
  }),
  graphql(updatePortfolioSettingsMutation, {
    name: 'updatePortfolioSettings',
    options: {
      refetchQueries: [
        {
          query: getSelectedKeys,
        },
      ],
    },
  })
)(KeysComponent)
