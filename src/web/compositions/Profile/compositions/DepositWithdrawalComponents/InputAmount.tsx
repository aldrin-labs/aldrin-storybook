import React, { useEffect } from 'react'

import { InputAdornment } from '@material-ui/core'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import {
  StyledInput,
  StyledTypographyCaption,
} from '../Withdrawal/Withdrawal.styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { FUNDS } from '@core/graphql/subscriptions/FUNDS'
import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { FundsType } from '@core/types/ChartTypes'

interface IProps {
  marketType: 0 | 1
  selectedCoin: string
  getFundsQuery: {
    getFunds: FundsType[]
  }
  onChange: ({ target: { value } }: { target: { value: number } }) => void
  subscribeToMore: () => () => void
  selectedAccount: string
}

const Balances = ({
  selectedCoin,
  getFundsQuery,
  marketType = 0,
  subscribeToMore,
  selectedAccount,
  onChange = () => {},
  ...inputProps
}: IProps) => {
  useEffect(() => {
    const unsubscribeFunds = subscribeToMore()

    return () => {
      unsubscribeFunds && unsubscribeFunds()
    }
  }, [selectedAccount])

  const { getFunds = [] } = getFundsQuery || {
    getFunds: [],
  }
  const [currentElement] = getFunds.filter(
    (el: FundsType) =>
      el.asset.symbol === selectedCoin && +el.assetType === marketType
  )
  const { quantity, locked, free } = currentElement || {
    quantity: '0.00000000',
    locked: '0.00000000',
    free: '0.00000000',
  }

  return (
    <StyledInput
      autoComplete="off"
      onChange={onChange}
      endAdornment={
        <InputAdornment
          style={{
            width: '70%',
            justifyContent: 'flex-end',
            cursor: 'pointer',
          }}
          disableTypography={true}
          position="end"
          autoComplete="off"
        >
          <StyledTypographyCaption
            onClick={() =>
              onChange({ target: { value: stripDigitPlaces(free, 8) } })
            }
          >
            <span>AVAILABLE:</span>
            <span style={{ color: 'rgb(22, 91, 224)' }}>{` ${stripDigitPlaces(
              free,
              8
            )} ${selectedCoin}`}</span>
          </StyledTypographyCaption>
        </InputAdornment>
      }
      {...inputProps}
    />
  )
}

const BalancesWrapper = (props: any) => {
  return (
    <QueryRenderer
      component={Balances}
      withOutSpinner={true}
      withTableLoader={true}
      withoutLoading={true}
      query={getFunds}
      variables={{ fundsInput: { activeExchangeKey: props.selectedAccount } }}
      name={`getFundsQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: FUNDS,
        variables: {
          listenFundsInput: { activeExchangeKey: props.selectedAccount },
        },
        updateQueryFunction: updateFundsQuerryFunction,
      }}
      {...props}
    />
  )
}

export default BalancesWrapper
