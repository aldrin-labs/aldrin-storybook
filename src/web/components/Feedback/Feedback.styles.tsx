import {
    Button,

    withStyles
} from '@material-ui/core'

export const BoldButton = withStyles({
    root: {
        fontWeight: 600
    }
})(Button)
