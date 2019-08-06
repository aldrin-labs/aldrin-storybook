import React, { memo } from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell, { Padding } from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'
import { fade } from '@material-ui/core/styles/colorManipulator'

import { StyledTable } from './Table.styles'

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
} from './index.types'
import { isObject } from 'lodash-es'
import {
  Typography,
  IconButton,
  Grow,
  TableSortLabel,
  TablePagination,
} from '@material-ui/core'
import { withErrorFallback } from '../hoc/withErrorFallback/withErrorFallback'
import withStandartSettings from './withStandartSettings/withStandartSettings'
import withPagination from './withPagination/withPagination'

import CustomPlaceholder from '@sb/components/CustomPlaceholder'

const CustomTableCell = withStyles((theme) => ({
  head: {
    position: 'sticky',
    top: theme.spacing.unit * 4,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
    border: 0,
    whiteSpace: 'nowrap',
    zIndex: 100,
    padding: '0.2rem 1.6rem 0.2rem  0.6rem',
  },
  body: {
    color: theme.palette.text.primary,
    borderBottom: 'none',
    fontSize: 14,
    padding: '0.2rem 1.6rem 0.2rem 0.6rem',
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
        background: theme.palette.background.paper,
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
    },
    rowSelected: {
      backgroundColor: theme.palette.action.selected,
    },
    row: {
      height: '2rem',
      transition: `background-color ${theme.transitions.duration.short}ms  ${
        theme.transitions.easing.easeOut
      }`,
      borderBottom: '0',
    },
    rowWithHover: {
      '&:hover': {
        borderRadius: '32px',
        backgroundColor: theme.palette.hover[theme.palette.type], //TODO theme.palette.action.hover,
      },
    },
    rowWithHoverBorderRadius: {
      '& td:first-child': {
        borderRadius: '12px 0 0 12px',
      },
      '& td:last-child': {
        borderRadius: '0 12px 12px 0',
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
      onChange={() => {
        ;(onChange as OnChange)(id)
      }}
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
  if (cell !== null && typeof cell === 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant={variant}
        style={{ color: cell.color, ...cell.style, ...tableStyles.cell }}
        key={id}
        padding={padding}
        numeric={numeric}
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
        numeric={numeric}
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
      variant={variant}
      numeric={numeric}
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
    <TableSortLabel
      active={sort!.sortColumn === cell.id}
      direction={sort!.sortDirection}
      onClick={() => sort!.sortHandler(cell.id)}
    >
      {cell.label}
    </TableSortLabel>
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
      if (key === 'id' || key === 'options' || key === 'expandableContent') {
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

const addPagination = (data: ReadonlyArray<any> = [], pagination: Pagination) =>
  data.slice(
    pagination!.page * pagination!.rowsPerPage,
    pagination!.page * pagination!.rowsPerPage + pagination!.rowsPerPage
  )

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
    onSelectAllClick = () => {
      return
    },
    checkedRows = [],
    staticCheckbox = false,
    sort,
    theme,
    data = { body: [] },
    pagination = {
      enabled: false,
      rowsPerPage: defaultRowsPerPage,
      rowsPerPageOptions: defaultrowsPerPageOptions,
      page: 0,
      handleChangePage: () => {
        return
      },
      handleChangeRowsPerPage: () => {
        return
      },
    },
    actions = [],
    actionsColSpan = 1,
    borderBottom = false,
    rowsWithHover = true,
    rowWithHoverBorderRadius = true, //TODO false rowWithHoverBorderRadius ,
    emptyTableText = 'no data',
    tableStyles = {
      heading: {},
      title: {},
      cell: {},
    },
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

  return (
    <Paper
      elevation={elevation}
      style={{
        width: '100%',
      }}
    >
      <StyledTable
        padding={padding ? padding : 'default'}
        className={`${classes.table} ${props.className || ''}`}
        id={props.id}
        style={{
          width: '100%',
        }}
      >
        <TableHead>
          {title && (
            <TableRow className={classes.headRow}>
              <CustomTableCell
                padding="default"
                className={classes.title}
                colSpan={howManyColumns - actionsColSpan}
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
              <CustomTableCell
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
              </CustomTableCell>
            </TableRow>
          )}
          <TableRow className={classes.headRow}>
            {(withCheckboxes || expandableRows) && (
              <CustomTableCell padding="checkbox" style={{ ...isOnTop }}>
                {renderCheckBox({
                  checkedRows,
                  rows: data,
                  type: withCheckboxes ? 'checkAll' : 'expandAll',
                  checked: withCheckboxes
                    ? data && data.body.length === checkedRows.length
                    : expandedRows.length > 0,
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
                  numeric={column.isNumber}
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
          {data.body.length === 0 ? (
            <CustomPlaceholder text={emptyTableText} />
          ) : (
            addPagination(
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

                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      style={
                        borderBottom
                          ? {
                              borderBottom: `1px solid ${fade(
                                theme!.palette.divider,
                                0.5
                              )}`,
                            }
                          : {}
                      }
                      className={rowHoverClassName}
                    >
                      {typeOfCheckbox !== null && (
                        <CustomTableCell padding="checkbox">
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
                      )}
                      {renderCells({ row, padding, tableStyles })}
                    </TableRow>
                    {expandable &&
                    row!.expandableContent!.length > 1 && // rendering content of expanded row if it is expandable
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
                            <TableRow className={classes.rowExpanded}>
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
        {/* {Array.isArray(data.footer) && (
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

      <Grow
        // we show pagination only when you pass pagination.enabled = true
        in={pagination.enabled}
        mountOnEnter
        unmountOnExit
      >
        <>
          <TablePagination
            component="div"
            count={data.body.length}
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
          />
        </>
      </Grow>
    </Paper>
  )
}

// rewrite with hooks
export default withStyles(styles, { withTheme: true })(
  withErrorFallback(withStandartSettings(withPagination(memo(CustomTable))))
)
