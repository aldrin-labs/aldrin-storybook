import React from 'react'

import { InputAdornment } from '@material-ui/core'
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
}

const Balances = ({
  selectedCoin,
  getFundsQuery,
  marketType = 0,
  onChange = () => {},
  ...inputProps
}: IProps) => {
  const { getFunds } = getFundsQuery
  const [currentElement] = getFunds.filter(
    (el: FundsType) =>
      el.asset.symbol === selectedCoin && +el.assetType === marketType
  )

  const { quantity, locked, free } = currentElement || {
    quantity: '-',
    locked: '-',
    free: '-',
  }

  return (
    <StyledInput
      endAdornment={
        <InputAdornment
          style={{ width: '70%', justifyContent: 'flex-end' }}
          disableTypography={true}
          position="end"
        >
          <StyledTypographyCaption
            onClick={() => onChange({ target: { value: free } })}
          >
            {`AVAILABLE: ${free} ${selectedCoin}`}
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
      query={getFunds}
      variables={{ fundsInput: { activeExchangeKey: props.selectedAccount } }}
      name={`getFundsQuery`}
      //   fetchPolicy="network-only"
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
