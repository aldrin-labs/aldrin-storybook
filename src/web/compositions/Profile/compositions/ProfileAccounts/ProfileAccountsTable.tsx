import React from 'react'
import { TableWithSort } from '@sb/components'

import {
  putDataInTable,
  headingStyle,
  cellStyle,
} from './ProfileAccounts.utils'

import { AccountData } from '@core/containers/Profile/ProfileAccounts/ProfileAccounts.types'

const ProfileAccountsTable = ({ accounts }: { accounts: AccountData[] }) => {
  const { body, head } = putDataInTable(accounts)

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
