import React, { useState } from 'react'

import { getAccountsFunds } from '@core/graphql/queries/chart/getAccountsFunds'
import { selectTradingKey } from '@core/graphql/mutations/user/selectTradingKey'
import { GET_TRADING_SETTINGS } from '@core/graphql/queries/user/getTradingSettings'
import { selectProfileKey } from '@core/components/SelectKeyListDW/SelectKeyListDW'
import { updateDepositSettings } from '@core/graphql/mutations/user/updateDepositSettings'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'

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
  theme,
  id,
  selectStyles,
  value,
  marketType,
  getAccountsFundsQuery,
  selectTradingKeyMutation,
  getTradingSettingsQuery,
  updateDepositSettingsMutation,
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
    getTradingSettingsQuery.getTradingSettings.selectedTradingKey
  )
  const [isEditPopupOpen, changePopupState] = useState(false)
  const [accountToRename, chooseAccountToRename] = useState({})
  const [creatingAdditionalAccount, startCreatingAdditionalAccount] = useState(
    false
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
    if (!account) {
      return
    }
    await selectKey(value, hedgeMode, isFuturesWarsKey)
  }

  const isLoading = getAccountsFundsQuery.loading

  return (
    <Container
      isLoading={isLoading}
      width={'calc(60%)'}
      style={{ marginRight: isLoading ? 'none' : '2rem' }}
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
            <span>It seems to take a while to load your accounts.</span>
            <span>Wait a few more seconds please, they are on their way.</span>
          </span>
          <span
            style={{
              width: '35rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {' '}
            <img src={Rocket} width={'75%'} />
          </span>
        </div>
      ) : (
        <span>
          {getAccountsFundsQuery.getAccountsFunds.map((el) => (
            <Stroke theme={theme} padding={'0 3rem 0 0'}>
              {' '}
              <AccountTitle theme={theme} isActive={account === el.keyId}>
                {' '}
                <Name>
                  {' '}
                  <input
                    type="radio"
                    value={el.keyId}
                    id={el.keyId}
                    checked={account === el.keyId}
                    style={{ marginRight: '1rem' }}
                    onChange={(e) => {
                      chooseAccount(el.keyId)
                      handleChange({
                        value: el.keyId,
                        hedgeMode: el.hedgeMode,
                        isFuturesWarsKey: el.isFuturesWarsKey,
                      })
                    }}
                  ></input>
                  <label style={{ cursor: 'pointer' }} htmlFor={el.keyId}>
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
        <Stroke style={{ borderTop: '0.1rem solid #e0e2e5' }}>
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
        <PopupStart open={true} creatingAdditionalAccount={true} />
      )}
    </Container>
  )
}

export default compose(
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
    query: GET_TRADING_SETTINGS,
    name: 'getTradingSettingsQuery',
    // skip: (props: any) => !props.authenticated,
    withOutSpinner: true,
    fetchPolicy: 'cache-only',
  }),
  graphql(selectTradingKey, {
    name: 'selectTradingKeyMutation',
  }),
  graphql(updateDepositSettings, {
    name: 'updateDepositSettingsMutation',
  })
)(KeysComponent)
