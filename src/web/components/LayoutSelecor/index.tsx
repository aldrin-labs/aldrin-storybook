import React from 'react'

import { withTheme } from '@material-ui/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'

import { SelectR, SelectContainer } from './styles'
import { SaveLayoutDialog } from '@sb/components/SaveLayoutDialog'
import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'


import { components } from 'react-select'



const LayoutSelecorComponent = ({...props}) => {
  const handleChange = ({ value }: {value: string}) => {
    const {
      loadLayout,
    } = props

    if (!value) {
      return
    }
    loadLayout(value)
  }

  const {
    layouts,
    saveLayout,
    charts,
    theme: {
      palette: { divider },
    },
    setTopMarkets,
    setTopCoinInPortfolio,
    removeLayout,
  } = props

  const Option = (optionProps) => {
    console.log(optionProps)
    return (
      <div>
        <components.Option {...optionProps}/>
        <Button variant="contained" onClick={() => {removeLayout(optionProps.value)}}>
          <DeleteIcon />
        </Button>
      </div>
    )
  }
  return (
    <>
      <TransparentExtendedFAB
        onClick={setTopMarkets}
      >
        set Top Markets
      </TransparentExtendedFAB>
      <TransparentExtendedFAB
        onClick={setTopCoinInPortfolio}
      >
        set Top Coins from portfolio
      </TransparentExtendedFAB>
      <SelectContainer
        border={divider}
      >
        <SelectR
          components={{ Option }}
          value=""
          placeholder="Select layout"
          fullWidth={true}
          options={layouts}
          onChange={handleChange}
        />
      </SelectContainer>
      <SaveLayoutDialog
        charts={charts}
        saveLayout={saveLayout}
      />
    </>
  )
}

export default withTheme()(LayoutSelecorComponent)
