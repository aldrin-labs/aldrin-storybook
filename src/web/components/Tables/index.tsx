import React, { memo } from 'react'
import { withStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import TableBody from '@material-ui/core/TableBody'
import TableCell, { Padding } from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'
import { fade } from '@material-ui/core/styles/colorManipulator'

import {
  StyledTable,
  StyledTableSortLabel,
  StyledTablePagination,
} from './Table.styles'

import {
  Props,
  Cell,
  OnChange,
  Row,
  Data,
  OnChangeWithEvent,
  sortTypes,
  Head,
  NotExpandableRow,
  renderCellType,
  Pagination,
  TableStyles,
  PaginationFunctionType,
} from './index.types'

import SwitchOnOff from '@sb/components/SwitchOnOff'
import { isObject } from 'lodash-es'
import { Typography, IconButton, Grow } from '@material-ui/core'
import { withErrorFallback } from '../hoc/withErrorFallback/withErrorFallback'
import withStandartSettings from './withStandartSettings/withStandartSettings'
import withPagination from './withPagination/withPagination'

import { PaginationBlock } from '@sb/components/TradingTable/TradingTable.styles'
import { StyledTooltip } from '@sb/components/TooltipCustom/TooltipCustom.styles'

import {
  StyledSelect,
  StyledOption,
} from '@sb/components/TradingWrapper/styles'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import CustomPlaceholder from '@sb/components/CustomPlaceholder'
import {
  OnboardingPlaceholder,
  OnboardingPromoPlaceholder,
} from '@sb/components'

const CustomTableCell = withStyles((theme) => ({
  head: {
    position: 'sticky',
    top: '3rem',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.dark.main,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
    border: 0,
    whiteSpace: 'nowrap',
    zIndex: 100,
    padding: '0.2rem 1.6rem 0.2rem  0.6rem',
    boxShadow: 'none',
  },
  body: {
    color: theme.palette.dark.main,
    borderBottom: 'none',
    fontSize: 14,
    padding: '0.2rem 1.6rem 0.2rem 0.6rem',
    boxShadow: 'none',
  },
  footer: {
    fontSize: 14,
    zIndex: 100,
    backgroundColor: theme.palette.primary.dark,
    padding: '0.2rem 1.6rem 0.2rem  0.6rem',
  },
  paddingDense: {
    padding: '1px 0.4rem 1px 0.4rem',
    '&:last-child': {
      padding: '1px 0.8rem 1px 0.4rem',
    },
  },
  paddingNone: {
    padding: '0',
    '&:last-child': {
      padding: '0',
    },
  },
}))(TableCell)

const ActionButton = withStyles(() => ({
  root: { padding: 0 },
}))(IconButton)

const AutoRefetch = ({
  autoRefetch,
  toggleAutoRefetch,
}: {
  autoRefetch?: boolean
  toggleAutoRefetch: () => void
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '1rem',
        zIndex: '100',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          color: 'rgba(0, 0, 0, 0.54)',
          fontSize: '1.125rem',
          fontFamily: 'DM Sans,sans-serif',
          padding: '0 1rem',
        }}
      >
        Auto-Refetch
      </span>
      <SwitchOnOff
        enabled={autoRefetch || false}
        _id={'AutoRefetch'}
        onChange={() => toggleAutoRefetch(!autoRefetch)}
      />
    </div>
  )
}

/**
 * Create a point.
 * @param {number} i -  is curr index.
 * @param {number} n - is how long array of data.
 */
const rowOffset = (i: number, n: number) => (n === 1 ? 0 : (n - i - 1) * 32 - 1)

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        width: '3px',
        height: '6px',
      },

      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background:
          theme.palette.type === 'dark'
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
      },
    },
    rowExpanded: {
      height: theme.spacing.unit * 4,
      backgroundColor: theme.palette.action.selected,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:hover td': {
        backgroundColor: `${
          theme.palette.hover[theme.palette.type]
        } !important`,
      },
    },
    indeterminateCheckbox: {
      color: theme.palette.primary.main,
      padding: '0',
    },
    checkbox: {
      padding: '0',
    },
    table: {},
    title: {
      color: theme.typography.title.color,
      backgroundColor: theme.palette.primary.light,
      position: 'sticky',
      top: 0,
      fontSize: 16,
      zIndex: 103,
    },
    staticCheckbox: {
      '&& input': {
        transition: 'none',
      },
      '&& svg': {
        transition: 'none',
      },
    },
    headRow: {
      height: '2rem',
      boxShadow: 'none',
    },
    rowSelected: {
      backgroundColor: theme.palette.action.selected,
    },
    row: {
      height: '2rem',
      boxShadow: 'none',
      transition: `background-color ${theme.transitions.duration.short}ms  ${
        theme.transitions.easing.easeOut
      }`,
      borderBottom: '0',
      '&:hover td': {
        transition: `background-color ${theme.transitions.duration.short}ms  ${
          theme.transitions.easing.easeOut
        }`,
      },
    },
    rowWithHover: {
      '&:hover': {
        borderRadius: '32px',
        backgroundColor: theme.palette.hover[theme.palette.type], //TODO theme.palette.action.hover,
      },
      '&:hover td': {
        backgroundColor: `${
          theme.palette.hover[theme.palette.type]
        } !important`, //TODO theme.palette.action.hover,
      },
    },
    rowWithHoverBorderRadius: {
      '& td:first-child': {
        borderRadius: '0',
      },
      '& td:last-child': {
        borderRadius: '0',
      },
    },
    actionButton: {
      padding: 0,
    },
    actionButtonWithoutHover: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    footer: {
      height: theme.spacing.unit * 4,
    },
  })

// TODO: Handle undefined value of cell

const isNumeric = (cell: Cell) =>
  typeof cell !== 'string' &&
  ((cell !== null && typeof cell === 'number') ||
    (typeof cell !== 'number' &&
      (typeof cell.render === 'number' || cell.isNumber)))

const renderCheckBox = ({
  type,
  onChange,
  id = '',
  rows,
  checkedRows = [],
  className = '',
  checked = false,
  disabled = false,
}: {
  type: 'check' | 'expand' | 'checkAll' | 'expandAll' | null
  onChange: OnChange | OnChangeWithEvent
  id?: string
  checkedRows?: ReadonlyArray<string>
  rows?: Data
  className?: any
  checked?: boolean
  disabled?: boolean | '' | 0
}) =>
  type === 'expand' ? (
    <Checkbox
      classes={{
        root: className.checkboxClasses,
      }}
      disabled={Boolean(disabled)}
      checkedIcon={<ExpandLess />}
      icon={<ExpandMore />}
      // onChange={() => {
      //   ;(onChange as OnChange)(id)
      // }}
      color="default"
      checked={checked}
    />
  ) : type === 'check' ? (
    <Checkbox
      classes={{
        root: className.checkboxClasses,
      }}
      color="default"
      indeterminate={false}
      checked={checked}
      onChange={() => {
        ;(onChange as OnChange)(id)
      }}
    />
  ) : type === 'checkAll' ? (
    <Checkbox
      classes={{
        indeterminate: className.indeterminate,
        root: className.root,
      }}
      color="default"
      indeterminate={
        rows && checkedRows.length > 0 && rows.body.length > checkedRows.length
      }
      checked={checked}
      onChange={onChange as OnChangeWithEvent}
    />
  ) : type === 'expandAll' ? (
    <Checkbox
      classes={{
        root: className.root,
      }}
      color="default"
      checkedIcon={<ExpandLess />}
      icon={<ExpandMore />}
      disabled={Boolean(disabled)}
      checked={checked}
      onChange={onChange as OnChangeWithEvent}
    />
  ) : null

const renderCell = ({
  cell,
  id,
  numeric,
  variant = 'body',
  padding = 'default',
  tableStyles = {
    cell: {},
  },
}: renderCellType) => {
  const align = numeric ? 'right' : 'left'
  if (cell !== null && typeof cell === 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant={variant}
        style={{ ...cell.style, ...tableStyles.cell, color: cell.color }}
        key={id}
        rowSpan={cell.rowspan}
        colSpan={cell.colspan}
        padding={padding}
        align={align}
        onClick={cell.onClick}
      >
        {cell.render}
      </CustomTableCell>
    )
  }
  if (typeof cell !== 'object') {
    return (
      <CustomTableCell
        style={{ ...tableStyles.cell }}
        padding={padding}
        scope="row"
        variant={variant}
        align={align}
        key={id}
      >
        {cell}
      </CustomTableCell>
    )
  }

  return (
    <CustomTableCell
      padding={padding}
      scope="row"
      style={{ ...tableStyles.cell }}
      variant={variant}
      align={align}
      key={id}
    >
      {''}
    </CustomTableCell>
  )
}

const renderHeadCell = ({
  cell,
  isSortable,
  sort,
}: {
  cell: Head
  isSortable: boolean
  sort: sortTypes | undefined
}) =>
  isSortable ? (
    <StyledTableSortLabel
      active={sort!.sortColumn === cell.id}
      direction={sort!.sortDirection}
      onClick={() => sort!.sortHandler(cell.id)}
      style={{ fontSize: 'inherit' }}
    >
      {cell.label}
    </StyledTableSortLabel>
  ) : (
    cell.label
  )

const renderCells = ({
  row,
  renderCellObject,
  padding,
  tableStyles,
}: {
  row: NotExpandableRow
  renderCellObject?: (cell: Cell, key: string) => renderCellType
  padding?: Padding
  tableStyles?: TableStyles
}) => {
  const reduce = Object.keys(row)
    .map((key) => {
      if (
        key === 'id' ||
        key === 'options' ||
        key === 'expandableContent' ||
        key === 'orderbook' ||
        key === 'tooltipTitle'
      ) {
        return null
      }

      const cell = row[key]
      const numeric = isNumeric(cell)

      const renderCellArg = renderCellObject
        ? renderCellObject(cell, key)
        : {
            cell,
            numeric: numeric as boolean,
            id: key,
            variant: (row.options && row.options.variant) || 'body',
            padding: padding ? padding : 'default',
          }

      return renderCell({ tableStyles, ...renderCellArg })
    })
    .filter(Boolean)

  return reduce
}

const renderFooterCells = ({
  row,
  stickyOffset,
  theme,
  padding,
}: {
  row: NotExpandableRow
  stickyOffset: number
  theme: Theme
  padding?: Padding
}) => {
  const setFooterCellObject = (cell: Cell, key: string) => {
    const numeric = isNumeric(cell)
    const spreadedCell = isObject(cell) ? cell : { render: cell }
    const bodyBackground =
      row.options && row.options.variant === 'body'
        ? { background: theme.palette.background.paper }
        : {}
    const style =
      typeof cell !== 'number' && typeof cell !== 'string' ? cell.style : {}
    const footerCell = {
      ...(spreadedCell as object),
      style: {
        ...bodyBackground,
        position: row.options && row.options.static ? 'static' : 'sticky',
        bottom: stickyOffset,
        ...style,
      },
    }
    const variant: 'footer' | 'body' = 'footer'

    return {
      padding,
      numeric: numeric as boolean,
      cell: footerCell as Cell,
      id: key,
      variant: variant,
    }
  }

  return renderCells({ row, renderCellObject: setFooterCellObject })
}

const addPaginationFake = (
  data: ReadonlyArray<any> = [],
  pagination: Pagination
) =>
  data.slice(
    pagination!.page * pagination!.rowsPerPage,
    pagination!.page * pagination!.rowsPerPage + pagination!.rowsPerPage
  )

const addRealPagination = (
  data: ReadonlyArray<any> = [],
  pagination: Pagination
) => data

{
  /* ToDo:
            - Add settings render
            - Add Tooltips To header
            - Break into files
          */
}

const CustomTable = (props: Props) => {
  const defaultrowsPerPageOptions: number[] = [10, 25, 100, 200]
  const defaultRowsPerPage = 100

  const {
    classes = {},
    padding = 'default',
    columnNames = [],
    withCheckboxes = false,
    title,
    elevation = 0,
    onChange = () => {
      return
    },
    expandableRows = false,
    expandedRows = [],
    expandAllRows = false,
    onSelectAllClick = () => {
      return
    },
    checkedRows = [],
    staticCheckbox = false,
    sort,
    theme,
    data = { body: [] },
    pagination = {
      totalCount: null,
      enabled: false,
      fakePagination: true,
      rowsPerPage: defaultRowsPerPage,
      rowsPerPageOptions: defaultrowsPerPageOptions,
      page: 0,
      handleChangePage: () => {
        return
      },
      handleChangeRowsPerPage: () => {
        return
      },
      additionalBlock: null,
      showPagination: true,
    },
    actions = [],
    actionsColSpan = 1,
    borderBottom = false,
    rowsWithHover = true,
    rowWithHoverBorderRadius = true, //TODO false rowWithHoverBorderRadius ,
    emptyTableText = 'no data',
    tableStyles = {
      heading: {},
      row: {},
      title: {},
      footer: {},
      cell: {},
      tab: {},
    },
    onTrClick,
    style,
    autoRefetch = false,
    needRefetch = false,
    toggleAutoRefetch,
    stylesForTable,
    paperAdditionalStyle = '',
    hideCommonCheckbox = false,
    onboardingPlaceholder = false,
    onboardingPromoPlaceholder = false,
  } = props

  if (
    data.body &&
    !Array.isArray(data.body) &&
    !Array.isArray(columnNames)
    // here you also can add check in future
    // for crashes
  ) {
    return null
  }
  const howManyColumns =
    withCheckboxes || expandableRows
      ? // space for checkbox
        (columnNames as ReadonlyArray<any>).filter(Boolean).length + 1
      : (columnNames as ReadonlyArray<any>).filter(Boolean).length

  //  if there is no title head must be at the top
  const isOnTop = !title ? { top: 0 } : {}

  const paginationFunc: PaginationFunctionType = pagination.fakePagination
    ? addPaginationFake
    : addRealPagination

  const enabledPagination = !!pagination && pagination.enabled

  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    rowsPerPageOptions,
    totalCount,
    additionalBlock,
    paginationStyles,
    showPagination,
  } = pagination || {
    totalCount: null,
    enabled: false,
    fakePagination: true,
    rowsPerPage: defaultRowsPerPage,
    rowsPerPageOptions: defaultrowsPerPageOptions,
    page: 0,
    handleChangePage: () => {
      return
    },
    handleChangeRowsPerPage: () => {
      return
    },
    additionalBlock: null,
    paginationStyles: {},
    showPagination: true,
  }

  return (
    <Paper
      elevation={elevation}
      style={{
        width: '100%',
        borderRadius: 'inherit',
        overflow: 'hidden scroll',
        ...(enabledPagination ? { height: 'calc(100% - 6rem)' } : {}),
        ...style,
      }}
    >
      <StyledTable
        padding={padding ? padding : 'default'}
        className={`${classes.table} ${props.className || ''}`}
        id={props.id}
        style={{
          width: '100%',

          ...stylesForTable,
        }}
      >
        <TableHead>
          {title && (
            <TableRow className={classes.headRow}>
              <CustomTableCell
                padding="default"
                className={classes.title}
                colSpan={howManyColumns} // - actionsColSpan
                style={{ ...tableStyles.tab }}
              >
                <Typography
                  style={{
                    fontSize: 16,
                    textTransform: 'none',
                  }}
                  variant="button"
                  color="default"
                >
                  {title}
                </Typography>
              </CustomTableCell>
              {/* <CustomTableCell
                padding="default"
                colSpan={actionsColSpan}
                className={classes.title}
                numeric={true}
              >
                {actions.map((action) => (
                  <ActionButton
                    className={`${classes.actionButton} + ${
                      action.withoutHover
                        ? classes.actionButtonWithoutHover
                        : ''
                    }`}
                    color={action.color || 'default'}
                    key={action.id}
                    onClick={action.onClick}
                    style={action.style}
                  >
                    {action.icon}
                  </ActionButton>
                ))}
              </CustomTableCell> */}
            </TableRow>
          )}
          <TableRow
            className={classes.headRow}
            style={{ ...tableStyles.headRow }}
          >
            {(withCheckboxes || expandableRows) && !hideCommonCheckbox && (
              <CustomTableCell
                padding="checkbox"
                style={{ ...isOnTop, width: '6rem' }}
              >
                {renderCheckBox({
                  checkedRows,
                  rows: data,
                  type: withCheckboxes ? 'checkAll' : 'expandAll',
                  checked: withCheckboxes
                    ? data && data.body.length === checkedRows.length
                    : expandAllRows,
                  onChange: onSelectAllClick,
                  className: {
                    indeterminate: classes.indeterminateCheckbox,
                    root: classes.checkbox,
                  },
                })}
              </CustomTableCell>
            )}

            {(columnNames as ReadonlyArray<Head>).map((column) => {
              return (
                <CustomTableCell
                  style={{
                    ...column.style,
                    ...isOnTop,
                    ...tableStyles.heading,
                  }}
                  variant="head"
                  padding={column.disablePadding ? 'none' : padding}
                  align={column.isNumber ? 'right' : 'left'}
                  key={column.id}
                >
                  {renderHeadCell({
                    sort,
                    isSortable:
                      typeof sort !== 'undefined' &&
                      column.isSortable !== false,
                    cell: column,
                  })}
                </CustomTableCell>
              )
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.body.length === 0 && onboardingPromoPlaceholder ? (
            <OnboardingPromoPlaceholder />
          ) : data.body.length === 0 && onboardingPlaceholder ? (
            <OnboardingPlaceholder />
          ) : data.body.length === 0 && !onboardingPlaceholder ? (
            <CustomPlaceholder theme={theme} text={emptyTableText} />
          ) : (
            paginationFunc(
              data.body.filter(Boolean).map((row) => {
                const selected = checkedRows.indexOf(row.id) !== -1
                const expandedRow = expandedRows.indexOf(row.id) !== -1

                const rowClassName = selected
                  ? `${classes.row} + ${classes.rowSelected}`
                  : classes.row

                const rowHoverClassName = rowsWithHover
                  ? rowWithHoverBorderRadius
                    ? `${rowClassName} + ${classes.rowWithHover} + ${
                        classes.rowWithHoverBorderRadius
                      }`
                    : `${classes.rowWithHover}`
                  : rowClassName

                const expandable = row.expandableContent
                const typeOfCheckbox: 'check' | 'expand' | null = withCheckboxes
                  ? 'check'
                  : expandableRows
                  ? 'expand'
                  : null
                const checkboxClasses = staticCheckbox
                  ? `${classes.staticCheckbox} ${classes.checkbox}`
                  : classes.checkbox

                const Component = row.tooltipTitle
                  ? StyledTooltip
                  : React.Fragment

                return (
                  <React.Fragment key={row.id}>
                    <Component
                      {...(row.tooltipTitle
                        ? {
                            disableFocusListener: true,
                            title: `Key: ${row.tooltipTitle}`,
                            enterDelay: 250,
                          }
                        : {})}
                    >
                      <TableRow
                        style={
                          borderBottom
                            ? {
                                borderBottom: `1px solid ${fade(
                                  theme!.palette.divider,
                                  0.5
                                )}`,
                                cursor: 'pointer',
                                ...tableStyles.row,
                              }
                            : {
                                cursor: 'pointer',
                                boxShadow: 'none',
                                ...tableStyles.row,
                              }
                        }
                        className={rowHoverClassName}
                        onClick={() =>
                          onTrClick
                            ? onTrClick(row.orderbook ? row.orderbook : row)
                            : typeOfCheckbox === 'expand'
                            ? onChange(row.id)
                            : null
                        }
                      >
                        {row.expandableContent &&
                        row.expandableContent.length > 0 ? (
                          <CustomTableCell
                            padding="checkbox"
                            style={{
                              backgroundColor: tableStyles.cell.backgroundColor,
                            }}
                          >
                            {renderCheckBox({
                              onChange,
                              id: row.id,
                              checked: withCheckboxes ? selected : expandedRow,
                              disabled:
                                expandable &&
                                row.expandableContent &&
                                (row.expandableContent as ReadonlyArray<
                                  NotExpandableRow
                                >).length === 0,
                              className: {
                                checkboxClasses,
                                disabledExpandRow: '',
                              },
                              type: typeOfCheckbox,
                            })}
                          </CustomTableCell>
                        ) : (
                          typeOfCheckbox !== null && (
                            <CustomTableCell
                              style={{
                                backgroundColor:
                                  tableStyles.cell.backgroundColor,
                              }}
                              padding="checkbox"
                            >
                              {' '}
                            </CustomTableCell>
                          )
                        )}
                        {renderCells({ row, padding, tableStyles })}
                      </TableRow>
                    </Component>
                    {expandable &&
                      // rendering content of expanded row if it is expandable
                      (row!.expandableContent! as ReadonlyArray<
                        NotExpandableRow
                      >).map((collapsedRows: Row, i: number) => {
                        return (
                          <Grow
                            in={expandedRow}
                            key={i}
                            unmountOnExit={true}
                            mountOnEnter={true}
                          >
                            <TableRow
                              className={rowsWithHover && classes.rowExpanded}
                            >
                              <CustomTableCell padding="checkbox" />
                              {renderCells({
                                padding,
                                tableStyles,
                                row: collapsedRows,
                              })}
                            </TableRow>
                          </Grow>
                        )
                      })}
                  </React.Fragment>
                )
              }),
              pagination
            )
          )}
        </TableBody>
        {/*{Array.isArray(data.footer) && (
          <TableFooter>
            {data.footer.filter(Boolean).map((row, index) => {
              const stickyOffset =
                data.footer !== undefined &&
                rowOffset(index, data.footer.filter(Boolean).length)
              return (
                <TableRow
                  key={index}
                  className={`${classes.row} ${classes.footer}`}
                >
                  {(withCheckboxes || expandableRows) && (
                    <CustomTableCell
                      padding="checkbox"
                      style={{
                        // temporary
                        position:
                          row.options && row.options.static
                            ? 'static'
                            : 'sticky',
                        bottom: stickyOffset || 0,
                        background:
                          row.options && row.options.variant === 'body'
                            ? theme!.palette.background.paper
                            : '',
                      }}
                      variant={(row.options && row.options.variant) || 'footer'}
                    />
                  )}

                  {renderFooterCells({
                    row,
                    padding,
                    stickyOffset: stickyOffset || 0,
                    theme: theme!,
                  })}
                </TableRow>
              )
            })}
          </TableFooter>
        )} */}
      </StyledTable>
      {enabledPagination && (
        <div
          // we show pagination only when you pass pagination.enabled = true
          style={{ display: pagination.enabled ? 'flex' : 'none' }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              backgroundColor: '#f2f4f6',
              borderBottomLeftRadius: 'inherit',
              borderBottomRightRadius: 'inherit',
              border: '.1rem solid #e0e5ec',
              borderRight: '0',
              display: 'flex',
              height: '3rem',
              ...paginationStyles,
            }}
          >
            {needRefetch ? (
              <AutoRefetch
                autoRefetch={autoRefetch}
                toggleAutoRefetch={toggleAutoRefetch}
              />
            ) : null}
            {/* <StyledTablePagination
            component="div"
            count={pagination.totalCount || data.body.length}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            rowsPerPageOptions={pagination.rowsPerPageOptions}
            onChangePage={pagination.handleChangePage}
            onChangeRowsPerPage={pagination.handleChangeRowsPerPage}
          /> */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#16253D',
                fontSize: '1.2rem',
                width: '100%',
              }}
            >
              <div>{additionalBlock}</div>
              {showPagination !== false ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PaginationBlock
                    theme={theme}
                    style={{ alignItems: 'center', whiteSpace: 'nowrap' }}
                  >
                    Rows per page:{' '}
                    <StyledSelect
                      theme={theme}
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                    >
                      {rowsPerPageOptions.map((quantity) => {
                        return <StyledOption>{quantity}</StyledOption>
                      })}
                    </StyledSelect>
                  </PaginationBlock>
                  <PaginationBlock theme={theme}>
                    {page * rowsPerPage} -{' '}
                    {page * rowsPerPage + rowsPerPage > totalCount
                      ? totalCount
                      : page * rowsPerPage + rowsPerPage}{' '}
                    of {totalCount}
                  </PaginationBlock>
                  <PaginationBlock theme={theme}>
                    <ArrowBackIosIcon
                      onClick={() =>
                        handleChangePage(page === 0 ? 0 : page - 1)
                      }
                      style={{
                        fill: '#7284a0',
                        width: '2rem',
                        height: '2rem',
                        margin: '0 1rem',
                        cursor: 'pointer',
                      }}
                    />
                    <ArrowForwardIosIcon
                      onClick={() =>
                        handleChangePage(
                          (page + 1) * rowsPerPage >= totalCount
                            ? page
                            : page + 1
                        )
                      }
                      style={{
                        fill: '#7284a0',
                        width: '2rem',
                        height: '2rem',
                        margin: '0 1rem',
                        cursor: 'pointer',
                      }}
                    />
                  </PaginationBlock>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Paper>
  )
}

// rewrite with hooks
export default withStyles(styles, { withTheme: true })(
  withErrorFallback(withStandartSettings(withPagination(memo(CustomTable))))
)
