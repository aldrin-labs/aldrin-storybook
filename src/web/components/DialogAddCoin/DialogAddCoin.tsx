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
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'



const emails = ['username@gmail.com', 'user02@gmail.com']
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
    console.log("$$$$$",value.target.value)
    this.props.onClose(value)
  }

  render() {
    const { children, classes, onClose, selectedValue, ...other } = this.props

    return (
      <Dialog
        // style={{width: '300px'}}
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <div>
          <SelectCoinList
            value={
              // shouldWeShowPlaceholderForCoin
              //   ? null
              //   : [
              //       {
              //         value: row.symbol,
              //         label: row.sym bol,
              //       },
              //     ]
              'btc'
            }
            //ref={handleRef}
            key={`inputCoinSymbol${'index'}`}
            classNamePrefix="custom-select-box"
            isClearable={true}
            isSearchable={true}
            openMenuOnClick={false}
            menuPortalTarget={document.body}
            menuPortalStyles={{
              zIndex: 111,
            }}
            menuStyles={{
              fontSize: '12px',
              minWidth: '150px',
              height: '200px',
            }}
            menuListStyles={{
              height: '200px',
            }}
            optionStyles={{
              fontSize: '12px',
            }}
            clearIndicatorStyles={{
              padding: '2px',
            }}
            valueContainerStyles={{
              minWidth: '35px',
              maxWidth: '55px',
              overflow: 'hidden',
            }}
            inputStyles={{
              marginLeft: '0',
            }}
            dropdownIndicatorStyles={{
              display: 'none',
            }}
            noOptionsMessage={() => `No such coin in our DB found`}
            // onChange={(
            //   optionSelected: {
            //     label: string
            //     value: string
            //   } | null
            // ) => handleSelectChange('index', 'symbol', optionSelected)}
          />

          {/* <List>
            {emails.map((email) => (
              <ListItem
                button
                onClick={this.handleListItemClick}
                key={email}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={'email'} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => this.handleListItemClick('addAccount')}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="add account" />
            </ListItem>
            </List>*/}
        </div>
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
