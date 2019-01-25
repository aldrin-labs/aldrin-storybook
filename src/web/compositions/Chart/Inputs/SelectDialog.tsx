import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import AutoSuggestSelect from './AutoSuggestSelect/AutoSuggestSelect'

const styles = (theme) => ({
  root: {
    overflow: 'visible !important',
  },
  rootContent: {
    overflow: 'visible',
    height: '4rem',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    color: 'white',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    color: 'white',
  },
})

class DialogSelect extends React.Component {
  state = {
    open: false,
    base: 'BTC',
    quote: 'USDT',
  }

  handleChange = (name) => (value) => {
    this.setState({
      [name]: value,
    })
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes, handleSelect } = this.props
    const { handleChange } = this
    const { base, quote } = this.state

    return (
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleClickOpen}
        >
          Add Currencies
        </Button>
        <Dialog
          classes={{
            paper: classes.root,
          }}
          className={classes.root}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Add pair of currencies</DialogTitle>
          <DialogContent className={classes.rootContent}>
            <form className={classes.container}>
              <FormControl className={classes.formControl}>
                <AutoSuggestSelect
                  {...{ handleChange, id: 'base', value: base }}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <AutoSuggestSelect
                  {...{ handleChange, id: 'quote', value: quote }}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSelect([base, quote].join('/'))
                this.handleClose()
              }}
              color="primary"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(DialogSelect)
