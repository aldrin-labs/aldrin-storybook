import React from 'react'

import { withTheme } from '@material-ui/styles'

import { SelectR, SelectContainer } from './styles'
import { AddLayoutDialog } from '@sb/components/AddLayoutDialog'

class LayoutSelecorComponent extends React.Component {
  state = {
    open: false,
  }

  handleChange = ({ value }) => {
    const {
      loadLayout
    } = this.props

    if (!value) {
      return
    }
    loadLayout(value)
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    console.log('handleClose')
    this.setState({ open: false })
  }

  render() {
    const {
      layouts,
      saveLayout,
      handleClose,
      handleSubmit,
      charts,
      theme: {
        palette: { divider },
      },
    } = this.props

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
            onChange={this.handleChange}
          />
        </SelectContainer>
        <AddLayoutDialog
          charts={charts}
          saveLayout={saveLayout}
        />
      </>
    )
  }
}

export default withTheme()(LayoutSelecorComponent)
