import React from 'react'
import { InputAdornment } from '@material-ui/core'
import {
  StyledInput,
  StyledTypography,
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
      addressTag: '-',
    },
  }

  const { address, addressTag } = data || {
    address: '-',
    addressTag: '-',
  }
  const isAddressTagExists = addressTag !== '-'

  setCoinAddress(address)

  return (
    <>
      <StyledInput {...inputProps} />
      <StyledTypography style={{ padding: '0.5rem 0'}}>
        <span>Tag:{' '}</span>
        <span>{addressTag}</span>
      </StyledTypography>
    </>
  )
}

const BalancesWrapper = (props) => {
  return (
    <QueryRenderer
      component={Balances}
      withOutSpinner={true}
      withTableLoader={true}
      withoutLoading={true}
      query={GET_DEPOSIT_ADDRESS}
      fetchPolicy="cache-and-network"
      variables={{
        input: { keyId: props.selectedAccount, symbol: props.selectedCoin },
      }}
      name={`getDepositAddressQuery`}
      {...props}
    />
  )
}

export default BalancesWrapper
