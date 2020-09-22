import React from 'react'
import { TableWithSort } from '@sb/components'

import {
  putDataInTable,
  headingStyle,
  cellStyle,
} from './ProfileAccounts.utils'

import { AccountData } from '@core/containers/Profile/ProfileAccounts/ProfileAccounts.types'

const ProfileAccountsTable = ({
  accounts,
  telegramUsernameConnected,
  setCreatingAdditionalAccount,
  portfolioAssetsMapFutures,
  portfolioAssetsMap,
  setTransferFromSpotToFutures,
  togglePopup,
  setSelectedAccount,
  updateWithdrawalSettings,
  updateDepositSettings,
}: {
  accounts: AccountData[]
  telegramUsernameConnected: boolean
  setCreatingAdditionalAccount: () => void
  portfolioAssetsMapFutures: []
  portfolioAssetsMap: []
  setTransferFromSpotToFutures: any
  togglePopup: any
  setSelectedAccount: string
  updateWithdrawalSettings: any
  updateDepositSettings: any
}) => {
  const { body, head } = putDataInTable(
    accounts,
    telegramUsernameConnected,
    setCreatingAdditionalAccount,
    portfolioAssetsMapFutures,
    portfolioAssetsMap,
    setTransferFromSpotToFutures,
    togglePopup,
    setSelectedAccount,
    updateWithdrawalSettings,
    updateDepositSettings
  )

  return (
    <TableWithSort
      columnNames={head}
      data={{ body }}
      padding="dense"
      id="ProfileAccountsTable"
      emptyTableText="No accounts"
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        borderRadius: '1.5rem',
      }}
      tableStyles={{
        heading: {
          ...headingStyle,
        },
        cell: {
          ...cellStyle,
        },
      }}
    />
  )
}

export default ProfileAccountsTable
