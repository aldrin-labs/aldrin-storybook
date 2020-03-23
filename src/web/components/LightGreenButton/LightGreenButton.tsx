import { withStyles, Button } from '@material-ui/core'

export const LightGreenButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#29AC80',
    '&:hover': {
      backgroundColor: '#218f6a',
    },
  },
}))(Button)
