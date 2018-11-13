import React from 'react'

import { Props } from '../index.types'

export default (WrappedComponent: React.ReactType) => {
  return class WithPagination extends React.Component<Props> {
    state = {
      page: 0,
      rowsPerPage: 10,
    }

    handleChangePage = (event, page) => {
      this.setState({ page })
    }

    handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: event.target.value })
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          pagination={{
            handleChangePage: this.handleChangePage,
            page: this.state.page,
            rowsPerPage: this.state.rowsPerPage,
            handleChangeRowsPerPage: this.handleChangeRowsPerPage,
          }}
        />
      )
    }
  }
}
