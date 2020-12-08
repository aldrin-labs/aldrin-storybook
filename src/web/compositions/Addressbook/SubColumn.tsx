import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'

import { AddBtn } from '@sb/compositions/Addressbook/index'

import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'

const SubColumn = ({ theme }) => {
  return (
    <Card style={{ width: '100%', height: 'auto' }} theme={theme}>
      <Table style={{ width: '100%', height: 'auto' }}>
        <TableRow
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <HeaderCell style={{ display: 'flex', alignItems: 'center' }}>
            Coin
          </HeaderCell>
          <HeaderCell style={{ display: 'flex', alignItems: 'center' }}>
            Address
          </HeaderCell>
          <AddBtn>+ add new contact</AddBtn>
        </TableRow>
      </Table>
    </Card>
  )
}

export default compose(withTheme())(SubColumn)
