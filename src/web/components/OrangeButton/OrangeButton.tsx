import { withStyles, Button } from '@material-ui/core'

export const OrangeButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#DD6956',
    '&:hover': {
      backgroundColor: '#f27561',
    },
  },
}))(Button)
