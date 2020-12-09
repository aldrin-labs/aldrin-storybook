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
    <Card
      style={{
        width: '100%',
        height: 'auto',
        border: '0',
        borderRadius: '0.8rem',
      }}
      theme={theme}
    >
      <Table
        style={{
          width: '100%',
          height: 'auto',
          border: '0',
          borderRadius: '0.8rem',
          background: '#303743',
        }}
      >
        <TableRow>
          <HeaderCell borderBottom={'#424B68'}>Coin</HeaderCell>
          <HeaderCell borderBottom={'#424B68'}>Address</HeaderCell>
          <HeaderCell borderBottom={'#424B68'}>
            <AddBtn>+ add new contact</AddBtn>
          </HeaderCell>
        </TableRow>
        <TableRow>
          <Cell borderBottom={'#424B68'}>jk</Cell>
          <Cell borderBottom={'#424B68'}>k,k</Cell>
          <Cell borderBottom={'#424B68'}>kl</Cell>
        </TableRow>
      </Table>
    </Card>
  )
}

export default compose(withTheme())(SubColumn)
