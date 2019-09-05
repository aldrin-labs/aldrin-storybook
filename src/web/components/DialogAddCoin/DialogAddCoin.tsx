import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { ReactSelectCustom } from './DialogAddCoin.styles'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'

class DialogAddCoin extends React.Component {
  state = {
    open: false,
    mouseInPopup: false,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    !this.state.mouseInPopup ? this.setState({ open: false }) : null
  }

  mouseEnter = () => {
    this.setState({ mouseInPopup: true })
  }

  mouseLeave = () => {
    this.setState({ mouseInPopup: false })
  }

  // handleSelectChange = (index, symbol, optionSelected) => {
  //   console.log(optionSelected)
  //   this.handleClose()
  // }

  render() {
    const { handleSelectChange, onAddRowButtonClick } = this.props

    return (
      <div style={{ position: 'relative', padding: '1rem 0' }}>
        <BtnCustom
          variant="outlined"
          color="#165BE0"
          btnWidth="100px"
          onFocus={this.handleClickOpen}
          onBlur={this.handleClose}
          style={{
            position: 'relative',
            left: '75%',
            top: 0,
            transform: 'translateX(-50%)',
            width: '10rem',
            height: '2.5rem',
          }}
        >
          Add Coin
        </BtnCustom>
        {/* <Dialog
          style={{ background: 'transparent' }}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ minWidth: '400px', height: '220px' }}> */}
        {this.state.open && (
          <div
            onMouseEnter={this.mouseEnter}
            onMouseLeave={this.mouseLeave}
            onBlur={this.handleClose}
            style={{
              position: 'absolute',
              right: '0',
              top: '4.5rem',
              background: 'white',
              border: '1px solid #ABBAD1',
              width: '24rem',
              borderRadius: '1.5rem',
            }}
          >
            <SelectCoinList
              //ref={handleRef}
              key={`inputCoinSymbol${'index'}`}
              classNamePrefix="custom-select-box"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              // menuPortalTarget={document.body}
              // menuPortalStyles={{
              //   zIndex: 11111,
              // }}
              menuStyles={{
                fontSize: '12px',
                minWidth: '150px',
                padding: '0 0 0 1.5rem',
                borderRadius: '1.5rem',
                textAlign: 'center',
                background: 'white',
                position: 'relative',
                boxShadow: 'none',
                border: 'none',
              }}
              menuListStyles={{
                height: '8rem',
              }}
              optionStyles={{
                color: '#7284A0',
                background: 'transparent',
                textAlign: 'left',
                fontSize: '12px',
                position: 'relative',

                '&:hover': {
                  borderRadius: '1rem',
                  color: '#16253D',
                  background: '#E7ECF3',
                },
              }}
              controlStyles={{
                padding: '1rem 1.5rem 0 1.5rem',
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
              // noOptionsMessage={() => `No such coin in our DB found`}
              valueContainerStyles={{
                border: '2px solid #E7ECF3',
                borderRadius: '54px',
                background: '#F2F4F6',
                paddingLeft: '15px',
              }}
              noOptionsMessageStyles={{
                textAlign: 'left',
              }}
              menuIsOpen={true}
              onChange={(
                optionSelected: {
                  label: string
                  value: string
                } | null
              ) => onAddRowButtonClick(optionSelected.label)}
            />
          </div>
        )}
      </div>
    )
  }
}

export default DialogAddCoin
