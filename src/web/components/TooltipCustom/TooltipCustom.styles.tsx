import { withStyles } from '@material-ui/core/styles'
import { Tooltip } from '@material-ui/core'

export const StyledTooltip = withStyles({
  popper: {
    // minWidth: '30rem'
  },
  tooltip: {
    fontSize: '1.25rem',
  },
})(Tooltip)
