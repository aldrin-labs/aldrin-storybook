import React from 'react'
import { Grow, Typography } from '@material-ui/core'
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

  const { columnNames, data: { body, footer } } = tableData

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
          columnNames={columnNames}
          id="PortfolioRebalanceTable"
          data={{ body, footer }}
          rowsWithHover={false}
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
          title={
            <TitleContainer>
              <TitleItem>Rebalanced Portfolio</TitleItem>
              <Grow in={!!timestampSnapshot}>
                <TitleItem>
                  {`Snapshot time:${timestampSnapshot &&
                    timestampSnapshot.format('MM-DD-YYYY h:mm:ss A')}`}
                </TitleItem>
              </Grow>
            </TitleContainer>
          }
        />
      </ContentInner>
    </>
  )
}

export default PortfolioRebalanceTable
