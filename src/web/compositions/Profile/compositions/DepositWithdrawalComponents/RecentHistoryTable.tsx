import React from 'react'
import { Grid } from '@material-ui/core'

import { StyledTable } from './RecentHistoryTable.styles'
import { columnNames } from './RecentHistoryTable.utils'

const RecentHistoryTable = ({}) => (
  <Grid style={{ height: '30%' }}>
    <StyledTable
      style={{
        height: '100%',
        position: 'relative',
        overflowY: 'scroll',
        overflowX: 'hidden',
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
      }}
      id="Deposits"
      padding="dense"
      data={{ body: [] }}
      columnNames={columnNames}
      emptyTableText="No history"
      tableStyles={{
        heading: {
          top: '-1px',
          padding: '.6rem 1.6rem .6rem 1.2rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 600,
          letterSpacing: 0.5,
          borderBottom: '2px solid #e0e5ec',
          whiteSpace: 'nowrap',
          color: '#7284A0',
          background: '#F2F4F6',
        },
        cell: {
          padding: '1.2rem 1.6rem 1.2rem 1.2rem',
          fontFamily: "'DM Sans Bold', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: '#7284A0',
        },
      }}
    />
  </Grid>
)

export default RecentHistoryTable
