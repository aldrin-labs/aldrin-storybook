import React from 'react'

import { Table as ImTable, TableWithSort, Loading } from '@sb/components'
import { getArrayOfActionElements } from '@sb/styles/PortfolioRebalanceTableUtils'
import { withTheme, WithTheme } from '@material-ui/styles'

import {
  LoaderWrapper,
  LoaderInnerWrapper,
  ContentInner,
} from './PortfolioRebalanceTable.styles'

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
          style={{ width: '100%', minHeight: '30rem' }}
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
          emptyTableText=""
        />
      </ContentInner>
    </>
  )
}

export default withTheme(PortfolioRebalanceTable)
