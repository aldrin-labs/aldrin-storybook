import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import { ReactSelectCustom } from './DialogAddCoin.styles'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'

class DialogAddCoin extends React.Component {
  state = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
        <BtnCustom
          variant="outlined"
          color="#165BE0"
          btnWidth="100px"
          onClick={this.handleClickOpen}
        >
          Add Coin
        </BtnCustom>
        <Dialog
          style={{ background: 'transparent' }}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ minWidth: '400px' }}
          >
            {/* {"Use Google's location service?"} */}
          </DialogTitle>
          <DialogContent>
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
                zIndex: 11111,
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
              menuIsOpen={true}
              // onChange={(
              //   optionSelected: {
              //     label: string
              //     value: string
              //   } | null
              // ) => handleSelectChange('index', 'symbol', optionSelected)}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default DialogAddCoin