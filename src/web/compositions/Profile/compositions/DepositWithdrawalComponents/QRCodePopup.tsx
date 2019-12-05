import React from 'react'
const QRCode = require('qrcode.react');
import { Grid, DialogContent, Dialog } from '@material-ui/core'

export default class QRCodePopup extends React.Component<{
  open: boolean
  coinAddress: string
  handleClose: (openedStatu: boolean) => void
}> {
  render() {
    const { open, handleClose, coinAddress } = this.props

    return (
      <Dialog
        maxWidth="md"
        open={open}
        onClose={handleClose}
        style={{ borderRadius: '50%' }}
      >
        <DialogContent
          style={{
            padding: '5rem',
          }}
        >
            <QRCode value={coinAddress} />
        </DialogContent>
      </Dialog>
    )
  }
}
