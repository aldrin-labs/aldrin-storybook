import React from 'react'
import {
  StyledInput,
} from '../Withdrawal/Withdrawal.styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { GET_DEPOSIT_ADDRESS } from '@core/graphql/queries/user/getDepositAddress'

interface IProps {
  setCoinAddress: (coin: string) => void
  getDepositAddressQuery: {
    getDepositAddress: {
      data?: {
        address: string
        success: boolean
        addressTag: string
        asset: string
      }
      status: string
      errorMessage: string
    }
  }
}

const Balances = ({
  setCoinAddress,
  getDepositAddressQuery,
  ...inputProps
}: IProps) => {
  const { getDepositAddress } = getDepositAddressQuery

  const { data } = getDepositAddress || {
    data: {
      address: '-',
    },
  }

  const { address } = data || {
    address: '-',
  }

  setCoinAddress(address)

  return <StyledInput {...inputProps} />
}

const BalancesWrapper = (props) => {
  return (
    <QueryRenderer
      component={Balances}
      withOutSpinner={true}
      withTableLoader={true}
      query={GET_DEPOSIT_ADDRESS}
      variables={{
        input: { keyId: props.selectedAccount, symbol: props.selectedCoin },
      }}
      name={`getDepositAddressQuery`}
      {...props}
    />
  )
}

export default BalancesWrapper
