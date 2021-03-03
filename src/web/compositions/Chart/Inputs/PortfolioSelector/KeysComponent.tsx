import React, { useState } from 'react'

import { getAccountsFunds } from '@core/graphql/queries/chart/getAccountsFunds'
import { selectTradingKey } from '@core/graphql/mutations/user/selectTradingKey'
import { GET_TRADING_SETTINGS } from '@core/graphql/queries/user/getTradingSettings'
import withAuth from '@core/hoc/withAuth'

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
  DepositBtn,
  AddPortfolioBtn,
  Balances,
} from './index.styles'

const KeysComponent = ({
  theme,
  id,
  selectStyles,
  value,
  marketType,
  getAccountsFundsQuery,
  selectTradingKeyMutation,
  getTradingSettingsQuery,
  portfolio,
}: {
  theme: Theme
  id: string
  selectStyles: () => void
  value: string
  marketType: number
  portfolio: string
}) => {
  const [account, chooseAccount] = useState('')

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

  const currentKeyIndex = getAccountsFundsQuery.getAccountsFunds.findIndex(
    (key) => key.keyId == account
  )

  const selectedKey =
    currentKeyIndex !== -1
      ? getAccountsFundsQuery.getAccountsFunds[currentKeyIndex]
      : null

  console.log('getTradingSettings')

  const isLoading = getAccountsFundsQuery.loading

  return (
    <Container
      isLoading={isLoading}
      width={'calc(62%)'}
      style={{ marginRight: '2rem' }}
    >
      {isLoading ? (
        <div>
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
          <span style={{ width: '5rem' }}>
            {' '}
            <img src={Rocket} width={'100%'} />
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
                  <label htmlFor={el.keyId}>{el.keyName}</label>
                </Name>
                <SvgIcon src={account === el.keyId ? WhitePen : BluePen} />
              </AccountTitle>{' '}
              <Balances>${el.totalValue.toFixed(2)}</Balances>
              <DepositBtn>Deposit</DepositBtn>
            </Stroke>
          ))}{' '}
        </span>
      )}
      {isLoading ? null : (
        <Stroke>
          <AddPortfolioBtn width={'60%'}>+ Add new account</AddPortfolioBtn>
        </Stroke>
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
  })
)(KeysComponent)
