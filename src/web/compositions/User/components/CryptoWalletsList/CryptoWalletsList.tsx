import * as React from 'react'
import { FormattedDate } from 'react-intl'
import styled from 'styled-components'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Loading } from '@sb/components/Loading'

import { getCryptoWalletsQuery } from '@core/graphql/queries/user/getCryptoWalletsQuery'

import { DeleteCryptoWalletDialog } from './DeleteCryptoWalletDialog'
import QueryRenderer from '@core/components/QueryRenderer'

import { StyledTableCell } from './../styles.tsx'

class CryptoWalletsListComponent extends React.Component {
  state = {
    wallets: null,
  }

  componentDidMount() {
    if (
      this.props.data.myPortfolios &&
      this.props.data.myPortfolios.length > 0
    ) {
      this.setState({ wallets: this.props.data.myPortfolios[0].cryptoWallets })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props.refetch()

    if (nextProps.data.myPortfolios && nextProps.data.myPortfolios.length > 0) {
      this.setState({ wallets: nextProps.data.myPortfolios[0].cryptoWallets })
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Loading centerAligned={true} />
    }

    const { wallets } = this.state
    const { forceUpdateUserContainer } = this.props

    return (
      <CryptoWalletsListPaper>
        <CryptoWalletsTable>
          <TableHead>
            <TableRow>
              <CryptoWalletTableCell>Name</CryptoWalletTableCell>
              <CryptoWalletTableCell align="center">
                Blockchain / Network
              </CryptoWalletTableCell>
              <CryptoWalletTableCell align="center">
                Address
              </CryptoWalletTableCell>
              <CryptoWalletTableCell align="center">Date</CryptoWalletTableCell>
              <CryptoWalletTableCell align="center">
                Delete key
              </CryptoWalletTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets &&
              wallets.map((wallet) => {
                const {
                  _id,
                  name,
                  baseAsset,
                  address,
                  date = Date.now(),
                } = wallet
                return (
                  <TableRow key={_id}>
                    <CryptoWalletTableCell>{name}</CryptoWalletTableCell>
                    <CryptoWalletTableCell align="center">
                      {baseAsset}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell align="center">
                      {address}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell align="center">
                      {<FormattedDate value={date} />}
                    </CryptoWalletTableCell>
                    <CryptoWalletTableCell align="center">
                      <DeleteCryptoWalletDialog
                        wallet={wallet}
                        forceUpdateUserContainer={forceUpdateUserContainer}
                      />
                    </CryptoWalletTableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </CryptoWalletsTable>
      </CryptoWalletsListPaper>
    )
  }
}

const CryptoWalletTableCell = styled(StyledTableCell)`
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
`

const CryptoWalletsListPaper = styled(Paper)`
  margin: 8px;
  min-height: 500px;
  overflow-x: auto;
  width: 100%;
`

const CryptoWalletsTable = styled(Table)`
  table-layout: fixed;
`

export default (props) => (
  <QueryRenderer
    component={CryptoWalletsListComponent}
    query={getCryptoWalletsQuery}
    fetchPolicy="network-only"
    {...props}
  />
)
