import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'
import styled from 'styled-components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import SubColumn from './SubColumn'
import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'
import {
  Card,
  HeaderCell,
  Cell,
  TableRow,
  Table,
} from '@sb/compositions/Rewards/index'
import { withTheme } from '@material-ui/styles'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index'
import { compose } from 'recompose'
import { addressBookColumnNames } from '@sb/components/TradingTable/TradingTable.mocks'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { getUserAddressbook } from '@core/graphql/queries/chart/getUserAddressbook'

export const AddBtn = styled.button`
  background: #1ba492;
  width: 20rem;
  font-samily: Avenir Next Demi;
  font-size: 1.5rem;
  color: #fff;
  text-transform: uppercase;
  border: none;
  border-radius: 0.4rem;
  height: 3rem;
  margin-right: 4rem;
`
const AddressbookRoute = ({ theme, getUserAddressbookQuery }) => {
  const [expandedRows, setExpandedRows] = useState([])
  console.log('getUserAddressbookQuery', getUserAddressbookQuery)
  return (
    <RowContainer style={{ height: '100%' }}>
      <Card style={{ width: '70%', height: '80%' }} theme={theme}>
        <div
          style={{
            width: '100%',
            borderBottom: '0.1rem solid #424B68',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {' '}
          <div
            style={{
              width: '100%',
              height: '5rem',
              fontFamily: 'Avenir Next Demi',
              color: '#7284A0',
              textTransform: 'capitalize',
              fontSize: '1.5rem',
              alignItems: 'center',
              display: 'flex',
              paddingLeft: '4rem',
            }}
          >
            Addressbook
          </div>
          <div>
            <AddBtn>+ add new contact</AddBtn>
          </div>
        </div>

        <TableWithSort
          hideCommonCheckbox
          expandableRows={true}
          expandedRows={expandedRows}
          onChange={(id) => setExpandedRows(onCheckBoxClick(expandedRows, id))}
          style={{
            borderRadius: 0,
            height: 'calc(100% - 6rem)',
            overflowX: 'hidden',
            backgroundColor: theme.palette.white.background,
          }}
          stylesForTable={{
            backgroundColor: theme.palette.white.background,
          }}
          defaultSort={{
            sortColumn: 'date',
            sortDirection: 'desc',
          }}
          withCheckboxes={false}
          tableStyles={{
            headRow: {
              //   borderBottom: theme.palette.border.main,
              boxShadow: 'none',
              width: 'calc(100%)',
            },
            heading: {
              height: '5rem',
              color: '#ABBAD1',
              fontWeight: 'bold',
              letterSpacing: '.1rem',
              fontFamily: 'Avenir Next Demi',
              textTransform: 'capitalize',
              fontSize: '1.5rem',
              borderBottom: '0.1rem solid #424B68',
              boxShadow: 'none',
              background: 'none',
              paddingLeft: '2rem',
              alignItems: 'center',
            },
            cell: {
              height: '5rem',
              color: '#f5f5fb',
              letterSpacing: '.1rem',
              fontFamily: 'Avenir Next Medium',
              textTransform: 'none',
              fontSize: '1.5rem',
              borderBottom: '0.1rem solid #424B68',
              boxShadow: 'none',
              background: 'none',
              paddingLeft: '2rem',
              alignItems: 'center',
            },
            tab: {
              padding: 0,
              boxShadow: 'none',
            },
          }}
          //   emptyTableText={getEmptyTextPlaceholder(tab)}
          data={{
            body: [
              {
                Name: 'flosssolis',
                DateAdded: '04 Dec 1903',
                Contact: 'flosssolis@gmail.com',
                PublicAddress: 'fkdjs4kjgha43rljsdfjlef',
                Addresses: 'ghj',
                expandableContent: [
                  { row: { render: <SubColumn></SubColumn>, colspan: 5 } },
                ],
              },
            ],
          }}
          columnNames={addressBookColumnNames}
        />
      </Card>
    </RowContainer>
  )
}

export default compose(
  withTheme(),
  queryRendererHoc({
    query: getUserAddressbook,
    name: 'getUserAddressbookQuery',
    variables: (props) => ({
      password: 'a',
      publicKey: 'a',
    }),
    fetchPolicy: 'cache-and-network',
  })
)(AddressbookRoute)
