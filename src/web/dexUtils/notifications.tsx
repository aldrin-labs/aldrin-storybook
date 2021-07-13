import React from 'react'
import { Link } from '@material-ui/core'

import SnackbarUtils from '@sb/utils/SnackbarUtils'

export const notify = ({
  message,
  description = '',
  txid = '',
  type = 'info',
}: {
  message: string
  description?: any
  txid?: string
  type?: string
}) => {
  console.log('notification: ', message)
  if (txid) {
    description = (
      <Link
        rel="noopener noreferrer"
        target="_blank"
        to={'https://explorer.solana.com/tx/' + txid}
        href={'https://explorer.solana.com/tx/' + txid}
      >
        {description ? (
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '.5rem' }}>
            <span style={{ color: '#fff', fontFamily: 'Avenir Next Demi' }}>
              {message}
            </span>
            <p style={{ color: '#fff' }}>
              {description}{' '}
              <span style={{ color: '#09ACC7' }}>
                {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
              </span>
            </p>
          </div>
        ) : (
          <span style={{ color: '#fff' }}>
            {message}:{' '}
            <span style={{ color: '#09ACC7' }}>
              {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
            </span>
          </span>
        )}
      </Link>
    )
  }

  SnackbarUtils[type](txid ? description : message, {
    variant: type,
  })

  return null
}
