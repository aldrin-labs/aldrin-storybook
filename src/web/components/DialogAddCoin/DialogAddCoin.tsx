import React from 'react'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'

class DialogAddCoin extends React.Component {
  state = {
    open: false,
    mouseInPopup: false,
    inputValue: '',
  }

  onInputChange = (inputValue: string) => {
    this.setState({ inputValue })
  }

  filterCoins = (coin) => {
    const { existCoinsNames } = this.props
    return !existCoinsNames.includes(coin.symbol)
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

  handleSelectChange = async (coin: string, priceUSD: string | number) => {
    const { onAddRowButtonClick } = this.props

    await onAddRowButtonClick(coin, priceUSD)

    this.setState({ open: false })
  }

  render() {
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
          }}
        >
          Add Coin
        </BtnCustom>
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
              zIndex: '10007',
            }}
          >
            <SelectCoinList
              //ref={handleRef}
              key={`inputCoinSymbol${'index'}`}
              classNamePrefix="custom-select-box"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              needAdditionalFiltering={true}
              additionalFiltering={this.filterCoins}
              menuStyles={{
                fontSize: '1.2rem',
                minWidth: '150px',
                padding: '0 1.5rem 0 1.5rem',
                borderRadius: '1.5rem',
                textAlign: 'center',
                background: 'white',
                position: 'relative',
                overflowY: 'auto',
                boxShadow: 'none',
                border: 'none',
              }}
              menuListStyles={{
                height: '16rem',
                overflowY: ''
              }}
              optionStyles={{
                color: '#7284A0',
                background: 'transparent',
                textAlign: 'left',
                fontSize: '1.2rem',
                borderBottom: '.1rem solid #e0e5ec',
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
              inputStyles={{
                marginLeft: '0',
              }}
              dropdownIndicatorStyles={{
                display: 'none',
              }}
              // noOptionsMessage={() => `No such coin in our DB found`}
              valueContainerStyles={{
                border: '1px solid #E7ECF3',
                borderRadius: '3rem',
                background: '#F2F4F6',
                paddingLeft: '15px',
              }}
              noOptionsMessageStyles={{
                textAlign: 'left',
              }}
              menuIsOpen={true}
              inputValue={this.state.inputValue}
              onInputChange={this.onInputChange}
              onChange={(
                optionSelected: {
                  label: string
                  value: string
                  priceUSD: string | number
                } | null
              ) =>
                this.handleSelectChange(
                  optionSelected.value || '',
                  optionSelected.priceUSD
                )
              }
            />
          </div>
        )}
      </div>
    )
  }
}

export default DialogAddCoin
