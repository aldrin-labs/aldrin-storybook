import React from 'react'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import CoinRow from './CoinRow'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import Add from '@material-ui/icons/Add'

class DialogAddCoin extends React.Component {
  state = {
    open: false,
    mouseInPopup: false,
    inputValue: '',
    selectedValue: '',
    timeout: null,
  }

  // componentDidUpdate() {
  //   this.state.ref ? this.state.ref.focus() : null
  // }

  changeRowToShow = (option) => {
    return {
      ...option,
      label: <CoinRow symbol={option.value} {...option} />,
    }
  }

  onInputChange = (inputValue: string) => {
    this.setState({ inputValue })
  }

  filterCoins = (coin) => {
    const { existCoins } = this.props

    // dustFilterEnabled &&
    // row.coinValueSnapshot < dustFilterRebalanceValue &&
    // row.coinValue < dustFilterRebalanceValue &&
    // !row.isCustomAsset

    return !existCoins.find((row) => row.symbol === coin.symbol)
  }

  addExistCoinsLighting = (coin) => {
    const { existCoins, dustFilterEnabled } = this.props

    const existCoin = existCoins.find((row) => row.symbol === coin.symbol)

    const dustFiltered =
      dustFilterEnabled &&
      existCoin &&
      existCoin.coinValueSnapshot < 1 &&
      existCoin.coinValue < 1 &&
      !existCoin.isCustomAsset

    return {
      ...coin,
      alreadyExist: !!existCoin,
      dustFiltered,
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    !this.state.mouseInPopup ? this.setState({ open: false }) : null
  }

  mouseEnter = () => {
    this.setState((prevState) => ({
      mouseInPopup: true,
      timeout: clearTimeout(prevState.timeout),
    }))
  }

  mouseLeave = () => {
    this.setState({ mouseInPopup: false }, () =>
      this.setState({ timeout: setTimeout(this.handleClose, 2000) })
    )
  }

  handleSelectChange = async (
    coin: string,
    priceUSD: string | number,
    priceBTC: string | number
  ) => {
    const { onAddRowButtonClick } = this.props

    await onAddRowButtonClick(coin, priceUSD, priceBTC)

    await this.setState({ inputValue: '' })
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          padding: '1rem 0',
          display: 'inline-block',
        }}
      >
        <BtnCustom
          color="#fff"
          onClick={this.handleClickOpen}
          onFocus={this.handleClickOpen}
          onBlur={this.handleClose}
          style={{
            position: 'relative',
            top: 0,
            right: 0,
            width: '9.5rem',
            borderRadius: '.75rem',
            background: '#0B1FD1',
            letterSpacing: '1px',
            paddingRight: '.5rem',
          }}
        >
          <Add
            style={{
              color: '#fff',
              position: 'relative',
              bottom: '.1rem',
              right: '.2rem',
              width: '2rem',
            }}
          />
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
              //ref={(ref) => this.setState({ ref })}
              isSearchable={false}
              key={JSON.stringify(this.state.selectedValue)}
              classNamePrefix="custom-select-box"
              controlShouldRenderValue={false}
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              filterOption={() => true}
              //needAdditionalFiltering={true}
              //additionalFiltering={this.filterCoins}
              needAdditionalMapping={true}
              additionalMapping={this.addExistCoinsLighting}
              changeRowToShow={this.changeRowToShow}
              // menuPortalTarget={document.body}
              // menuPortalStyles={{
              //   zIndex: 11111,
              // }}
              menuStyles={{
                fontSize: '1.2rem',
                minWidth: '150px',
                padding: '0 1.5rem 0 1.5rem',
                borderRadius: '1.5rem',
                textAlign: 'center',
                background: 'white',
                position: 'relative',
                // overflowY: 'auto',
                boxShadow: 'none',
                border: 'none',
              }}
              menuListStyles={{
                height: '16rem',
                // overflowY: '',
              }}
              optionStyles={{
                color: '#7284A0',
                background: 'transparent',
                textAlign: 'left',
                fontSize: '1.2rem',
                borderBottom: '.1rem solid #e0e5ec',
                position: 'relative',
                padding: '0',

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
              ) => {
                this.handleSelectChange(
                  optionSelected.value || '',
                  optionSelected.priceUSD,
                  optionSelected.priceBTC
                )
                this.setState({ selectedValue: optionSelected.value })
              }}
            />
          </div>
        )}
      </div>
    )
  }
}

export default DialogAddCoin
