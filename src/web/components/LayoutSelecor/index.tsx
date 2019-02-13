import React from 'react'

import { withTheme, withStyles } from '@material-ui/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import { components } from 'react-select'

import { SaveLayoutDialog } from '@sb/components/SaveLayoutDialog'
import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'

import {
  SelectR,
  SelectContainer,
  OptionContainer,
} from './styles'

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
    theme: {
      palette: { divider },
    },
    setTopMarkets,
    setTopCoinInPortfolio,
    removeLayout,
  } = props

  const Option = (optionProps: any) => (
    <OptionContainer>
      <components.Option {...optionProps} />
      <ActionButton aria-label="Delete" onClick={() => { removeLayout(optionProps.value); } }>
        <DeleteIcon fontSize="small" />
      </ActionButton>
    </OptionContainer>
  )
  return (
    <>
      <TransparentExtendedFAB
        onClick={setTopMarkets}
      >
        Top Marketcap Charts
      </TransparentExtendedFAB>
      <TransparentExtendedFAB
        onClick={setTopCoinInPortfolio}
      >
        Top Portfolio Charts
      </TransparentExtendedFAB>
    </>
  )
}

export default withTheme()(LayoutSelecorComponent)
