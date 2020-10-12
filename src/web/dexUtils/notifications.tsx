import React from 'react';
import { Link } from '@material-ui/core'


import SnackbarUtils from '@sb/utils/SnackbarUtils'


export const notify = ({
  message,
  description,
  txid = '',
  type = 'info',
  placement = 'bottomLeft',
}) => {
  console.log('notification: ', message)
  if (txid) {
    description = (
      <Link rel="noopener noreferrer" target="_blank" to={'https://explorer.solana.com/tx/' + txid} href={'https://explorer.solana.com/tx/' + txid}>
        <span style={{ color: "#fff" }}>View transaction: <span style={{ color: "#09ACC7" }}> {txid.slice(0, 8)}...{txid.slice(txid.length - 8)} </span> </span>
      </Link>
    );
  }

    SnackbarUtils[type](txid ? description : message, {
      variant: type,
    })

  return null
}
