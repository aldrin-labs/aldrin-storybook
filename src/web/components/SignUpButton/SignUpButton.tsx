import { withStyles, Button } from '@material-ui/core'

export const SignUpButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#048259',
    '&:hover': {
      backgroundColor: '#326F4D',
    },
  },
}))(Button)
