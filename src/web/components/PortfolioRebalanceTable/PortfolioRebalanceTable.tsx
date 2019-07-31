import React from 'react'
import { Typography, withWidth } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'

import { Table as ImTable, TableWithSort, Loading } from '@sb/components'
import { getArrayOfActionElements } from '@sb/styles/PortfolioRebalanceTableUtils'
import { withStyles, withTheme, WithTheme } from '@material-ui/core/styles'

import {
  LoaderWrapper,
  LoaderInnerWrapper,
  ContentInner,
} from './RebalancedPortfolioTable.styles'

import { IProps } from './PortfolioRebalanceTable.types'
import { compose } from 'recompose'

// const styles = (theme) => ({
//   heading: {
//     background: theme.palette.background.taable
//   },
// })
const PortfolioRebalanceTable: React.FunctionComponent<
  ConsistentWith<{ theme: Theme }, WithTheme<{}>>
> = ({
  isEditModeEnabled,
  theme,
  loading,
  onEditModeEnable,
  onReset,
  onSaveClick,
  red,
  onDiscardChanges,
  saveButtonColor,
  timestampSnapshot,
  onNewSnapshot,
  tableData,
  width,
}: IProps) => {
  const Table = isEditModeEnabled ? ImTable : TableWithSort
  return (
    <>
      {/*{loading && (*/}
      {/*<LoaderWrapper background={fade(theme.palette.common.black, 0.7)}>*/}
      {/*<LoaderInnerWrapper>*/}
      {/*<Loading size={94} margin={'0 0 2rem 0'} />{' '}*/}
      {/*<Typography color="secondary" variant="h4">*/}
      {/*Saving rebalanced portfolio...*/}
      {/*</Typography>{' '}*/}
      {/*</LoaderInnerWrapper>{' '}*/}
      {/*</LoaderWrapper>*/}
      {/*)}*/}
      <ContentInner>
        <Table
          style={{ width: '100%' }}
          columnNames={tableData.columnNames}
          id="PortfolioRebalanceTable"
          data={tableData.data}
          rowsWithHover={true}
          actionsColSpan={2}
          actions={getArrayOfActionElements({
            isEditModeEnabled,
            onEditModeEnable,
            onNewSnapshot,
            onDiscardChanges,
            onSaveClick,
            onReset,
            red,
            saveButtonColor,
          })}
          tableStyles={{
            heading: {
              fontFamily: `DM Sans, sans-serif`,
              color: theme.palette.text.primary,
              background: theme.palette.background.table,
              textTransform: 'uppercase',
              fontWeight: 'normal',
              fontSize: '1.2rem',
            },
            title: {},
            cell: {
              padding: '0px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '1.4rem',
              height: width === 'xl' ? '96px' : '48px',
              borderBottom: `1px solid ${
                theme.palette.grey[theme.palette.type]
              }`,
            },
          }}
          emptyTableText="No assets"
        />
      </ContentInner>
    </>
  )
}

export default compose(withWidth(), withTheme())(PortfolioRebalanceTable)
