import React from 'react'

import { withTheme } from '@material-ui/styles'

import { SelectR, SelectContainer } from './styles'
import { AddLayoutDialog } from '@sb/components/AddLayoutDialog'

const LayoutSelecorComponent = ({...props}) => {
  const handleChange = ({ value }) => {
    const {
      loadLayout
    } = this.props

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
  } = props

  return (
    <>
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
