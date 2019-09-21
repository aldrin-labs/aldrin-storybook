import {
    TableCell,

    withStyles
} from '@material-ui/core'

export const StyledTableCell = withStyles({
    head: {
        fontSize: '1.25rem'
    }
})(TableCell)
