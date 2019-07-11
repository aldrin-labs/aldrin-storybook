import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import PersonIcon from '@material-ui/icons/Person'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import blue from '@material-ui/core/colors/blue'

import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import { ReactSelectCustom } from './DialogAddCoin.styles'

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
}

class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue)
  }

  handleListItemClick = (value) => {
    this.props.onClose(value)
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <ReactSelectCustom
          style={{ width: '300px', height: '300px' }}
          options={[
            {
              value: 'daily',
              label: 'daily',
              color: '#165BE0',
              isFixed: true,
            },
            // { value: 'Checkbox', label: <Checkbox/>, color: '#D93B28' },
            {
              value: 'stop-rebalance',
              label: 'Stop Rebalance',
              color: '#D93B28',
            },
          ]}
          // singleValueStyles={{
          //   color: '#165BE0',
          //   fontSize: '11px',
          //   padding: '0',
          // }}
          // indicatorSeparator={{
          //   color: 'orange',
          //   background: 'transparent',
          // }}
          // control={{
          //   background: 'transparent',
          //   border: 'none',
          //   width: 100,
          //   // border: state.isFocused ? 0 : 0,
          //   // boxShadow: state.isFocused ? 0 : 0,
          //   // '&:hover': {
          //   //   border: state.isFocused ? 0 : 0,
          //   // },
          // }}
          // menu={{
          //   width: 120,
          //   padding: '5px 8px',
          //   borderRadius: '14px',
          // }}
          // container={{
          //   background: 'transparent',
          //   padding: 0,
          //   color: '#165BE0',
          //   '&:focus': {
          //     border: '0 solid transparent',
          //     borderColor: 'transparent',
          //     boxShadow: '0 0 0 1px transparent',
          //   },
          // }}
        />
      </Dialog>
    )
  }
}

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog)

class SimpleDialogDemo extends React.Component {
  state = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = (value) => {
    this.setState({ selectedValue: value, open: false })
  }

  render() {
    return (
      <div>
        {/* <Typography variant="subtitle1">
          Selected: {this.state.selectedValue}
        </Typography>
        <br /> */}
        <BtnCustom
          variant="outlined"
          color="#165BE0"
          btnWidth="100px"
          onClick={this.handleClickOpen}
        >
          Add Coin
        </BtnCustom>

        <SimpleDialogWrapped
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onClose={this.handleClose}
          style={{ top: '400px', left: '565px' }}
        />
      </div>
    )
  }
}

export default SimpleDialogDemo
