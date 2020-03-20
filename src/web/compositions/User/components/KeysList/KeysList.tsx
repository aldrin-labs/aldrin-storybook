import * as React from 'react'
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { Loading } from '@sb/components/Loading'

import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { DeleteKeyDialog } from './DeleteKeyDialog'
import QueryRenderer from '@core/components/QueryRenderer'

import { StyledTableCell } from './../styles.tsx'

class KeysListComponent extends React.Component {
  state = {
    keys: null,
  }

  componentDidMount() {
    if (
      this.props.data.myPortfolios &&
      this.props.data.myPortfolios.length > 0
    ) {
      this.setState({ keys: this.props.data.myPortfolios[0].keys })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props.refetch()

    if (nextProps.data.myPortfolios && nextProps.data.myPortfolios.length > 0) {
      this.setState({ keys: nextProps.data.myPortfolios[0].keys })
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Loading centerAligned={true} />
    }

    const { keys } = this.state
    const { forceUpdateUserContainer } = this.props

    return (
      <KeysListPaper>
        <KeysTable id="KeysTable">
          <TableHead>
            <TableRow>
              <KeyTableCell>Name</KeyTableCell>
              <KeyTableCell align="center">Exchange</KeyTableCell>
              <KeyTableCell align="center">Api key</KeyTableCell>
              <KeyTableCell align="center">Added</KeyTableCell>
              <KeyTableCell align="center">Is Processing</KeyTableCell>
              <KeyTableCell align="center">Valid?</KeyTableCell>
              <KeyTableCell align="center">Status</KeyTableCell>
              <KeyTableCell align="center">Last update</KeyTableCell>
              <KeyTableCell align="center">Delete key</KeyTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys &&
              keys.map((key) => {
                const {
                  _id,
                  name,
                  exchange,
                  apiKey,
                  date,
                  processing,
                  lastUpdate,
                  status,
                  valid,
                } = key
                return (
                  <TableRow key={_id}>
                    <KeyTableCell>{name}</KeyTableCell>
                    <KeyTableCell align="center">{exchange}</KeyTableCell>
                    <KeyTableCell align="center">{apiKey}</KeyTableCell>
                    <KeyTableCell align="center">
                      {'invalid date'}
                    </KeyTableCell>
                    <KeyTableCell>
                      {!(processing === null) && (processing ? 'Yes' : 'No')}
                    </KeyTableCell>
                    <KeyTableCell>
                      {!(valid === null) && (valid ? 'Yes' : 'No')}
                    </KeyTableCell>
                    <KeyTableCell>{status}</KeyTableCell>
                    <KeyTableCell>{'invalid date'}</KeyTableCell>
                    <KeyTableCell align="center">
                      <DeleteKeyDialog
                        keyName={name}
                        forceUpdateUserContainer={forceUpdateUserContainer}
                      />
                    </KeyTableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </KeysTable>
      </KeysListPaper>
    )
  }
}

const KeyTableCell = styled(StyledTableCell)`
  padding: 0;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
`

const KeysListPaper = styled(Paper)`
  margin: 8px;
  min-height: 500px;
  overflow-x: auto;
  width: 100%;
`

const KeysTable = styled(Table)`
  table-layout: fixed;
`

export default (props) => (
  <QueryRenderer
    component={KeysListComponent}
    query={getKeysQuery}
    fetchPolicy="cache-and-network"
    withOutSpinner={true}
    {...props}
  />
)
