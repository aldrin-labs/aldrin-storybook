import React from 'react'
import { Typography } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'

import { Table as ImTable, TableWithSort, Loading } from '@sb/components'
import { getArrayOfActionElements } from '@sb/styles/PortfolioRebalanceTableUtils'

import {
  LoaderWrapper,
  LoaderInnerWrapper,
  ContentInner,
  TitleContainer,
  TitleItem,
} from './RebalancedPortfolioTable.styles'

import { IProps } from './PortfolioRebalanceTable.types'

const PortfolioRebalanceTable = ({
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
}: IProps) => {
  const Table = isEditModeEnabled ? ImTable : TableWithSort
  return (
    <>
      {loading && (
        <LoaderWrapper background={fade(theme.palette.common.black, 0.7)}>
          <LoaderInnerWrapper>
            <Loading size={94} margin={'0 0 2rem 0'} />{' '}
            <Typography color="secondary" variant="h4">
              Saving rebalanced portfolio...
            </Typography>{' '}
          </LoaderInnerWrapper>{' '}
        </LoaderWrapper>
      )}
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
              color: '#ABBAD1',
              background: `#fff`, //TODO theme.palette.background.taable
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: '10px',
              //textAlign: 'center',
            },
            title: {},
            cell: {
              padding: '0px',
              //color: '#7284A0',
              //textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '12px',
            },
          }}
          // title={
          //   <TitleContainer style={{}}>
          //     <TitleItem>Rebalanced Portfolio</TitleItem>
          //     <TitleItem>
          //       {timestampSnapshot &&
          //         `Snapshot time: ${timestampSnapshot.format(
          //           'MM-DD-YYYY h:mm:ss A'
          //         )}`}
          //     </TitleItem>
          //   </TitleContainer>
          // }
          emptyTableText="No assets"
        />
      </ContentInner>
    </>
  )
}

export default PortfolioRebalanceTable
