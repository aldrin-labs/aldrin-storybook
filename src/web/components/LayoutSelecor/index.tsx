import React from 'react'

import { withTheme } from '@material-ui/styles'

import { SelectR, SelectContainer } from './styles'
import { AddLayoutDialog } from '@sb/components/AddLayoutDialog'
import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'


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
  } = props

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
          value=""
          placeholder="Select layout"
          fullWidth={true}
          options={layouts}
          onChange={handleChange}
        />
      </SelectContainer>
      <AddLayoutDialog
        charts={charts}
        saveLayout={saveLayout}
      />
    </>
  )
}

export default withTheme()(LayoutSelecorComponent)
