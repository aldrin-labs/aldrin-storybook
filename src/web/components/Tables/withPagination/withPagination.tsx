import React from 'react'

import { Props } from '../index.types'

export default (WrappedComponent: React.ReactType) => {
  return class WithPagination extends React.Component<Props> {
    state = {
      page: 0,
      rowsPerPage: 100,
    }

    handleChangePage = (page: number) => {
      this.setState({ page })
    }

    handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ rowsPerPage: event.target.value })
    }

    render() {
      return (
        <WrappedComponent
          pagination={{
            handleChangePage: this.handleChangePage,
            page: this.state.page,
            rowsPerPage: this.state.rowsPerPage,
            handleChangeRowsPerPage: this.handleChangeRowsPerPage,
          }}
          {...this.props}
        />
      )
    }
  }
}
