import React from 'react'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'

const CoinRow = ({
  inputValue,
  filterCoin,
  onInputChange,
  updateFilterCoin,
}) => (
  <SelectCoinList
    //ref={handleRef}
    key={`inputCoinSymbol${'index'}`}
    placeholder="coin"
    classNamePrefix="custom-select-box"
    isClearable={true}
    isSearchable={false}
    menuPortalTarget={document.body}
    menuPortalStyles={{
      zIndex: 11111,
    }}
    menuStyles={{
      fontSize: '12px',
      minWidth: '150px',
      borderRadius: '1.5rem',
      textAlign: 'center',
      background: 'white',
      position: 'relative',
      boxShadow: '0px 0px 8px rgba(10,19,43,0.1)',
      border: '1px solid #e0e5ec',
      color: '#7284A0',
    }}
    menuListStyles={{
      height: '8rem',
    }}
    optionStyles={{
      color: '#7284A0',
      background: '#fff',
      textAlign: 'left',
      fontSize: '12px',
      position: 'relative',

      '&:hover': {
        borderRadius: '1rem',
        color: '#16253D',
        background: '#E7ECF3',
      },
    }}
    clearIndicatorStyles={{
      padding: '2px',
    }}
    inputStyles={{
      marginLeft: '0',
      color: '#7284A0',
      opacity: '1',
    }}
    dropdownIndicatorStyles={{
      display: 'none',
    }}
    valueContainerStyles={{
      border: '1px solid #E7ECF3',
      borderRadius: '3rem',
      background: '#fff',
      paddingLeft: '15px',
      minWidth: '80px',
      color: '#7284A0',
    }}
    singleValueStyles={{
      height: 'auto',
      width: 'auto',
      color: 'rgb(114, 132, 160);',
      overflow: 'auto',
    }}
    noOptionsMessageStyles={{
      textAlign: 'left',
    }}
    inputValue={inputValue}
    filterCoin={filterCoin}
    onInputChange={(value: string) => {
      if (value === '') {
        updateFilterCoin('')
        onInputChange('')
        return
      }
      onInputChange(value)
    }}
    onChange={(
      optionSelected: {
        label: string
        value: string
        priceUSD: string | number
      } | null
    ) => {
      updateFilterCoin(optionSelected ? optionSelected.label : '')
    }}
  />
)

export default CoinRow
