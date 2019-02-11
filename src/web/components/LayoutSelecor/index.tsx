import React from 'react'

import { withTheme, withStyles } from '@material-ui/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import { SelectR, SelectContainer } from './styles'
import { SaveLayoutDialog } from '@sb/components/SaveLayoutDialog'
import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'


import { components } from 'react-select'

const ActionButton = withStyles(() => ({
  root: { padding: 6 },
}))(IconButton)

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
      <div style={{display: 'flex'}}>
        <components.Option {...optionProps}/>
        <ActionButton aria-label="Delete" onClick={() => {removeLayout(optionProps.value)}}>
          <DeleteIcon fontSize="small" />
        </ActionButton>

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
