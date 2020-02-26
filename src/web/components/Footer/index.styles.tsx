import { withStyles, Button, Typography } from '@material-ui/core'

export const StyledButton = withStyles((theme) => ({
  root: {
    color: '#7284A0',
    fontSize: '1.3rem',
    textTransform: 'capitalize',
    breakpoints: {
      [theme.breakpoints.up('xl')]: {
        fontSize: '1rem',
      },
    },
  },
}))(Button)

export const StyledTypography = withStyles((theme) => ({
  root: {
    color: '#ABBAD1',
    fontSize: '1.3rem',
    breakpoints: {
      [theme.breakpoints.up('xl')]: {
        fontSize: '1rem',
      },
    },
  },
}))(Typography)
