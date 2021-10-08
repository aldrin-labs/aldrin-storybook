import React from 'react'
import { Link } from '@material-ui/core'

import SnackbarUtils from '@sb/utils/SnackbarUtils'
import { MASTER_BUILD } from '@core/utils/config'

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
        to={`https://solanabeach.io/tx/${txid}`}
        href={`https://solanabeach.io/tx/${txid}`}
      >
        {description ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginLeft: '.5rem',
              height: '6rem',
            }}
          >
            <span
              style={{
                color: '#fff',
                fontFamily: 'Avenir Next Demi',
                fontSize: '1.6rem',
              }}
            >
              {message}
            </span>
            <p style={{ color: '#fff', margin: 0 }}>
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
  } else {
    description = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: description ? 'space-between' : 'center',
          marginLeft: '.5rem',
          height: '6rem',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontFamily: 'Avenir Next Demi',
            fontSize: '1.6rem',
          }}
        >
          {message}
        </span>
        {description && (
          <p style={{ color: '#fff', margin: 0 }}>{description}</p>
        )}
      </div>
    )
  }

  SnackbarUtils[type](description, {
    variant: type,
  })

  return null
}

export const notifyForDevelop = ({
  message = 'Something went wrong',
  type = 'error',
  ...args
}) => {
  console.error(`${message}`, args)
  !MASTER_BUILD &&
    notify({
      type,
      message,
    })
}

export const notifyWithLog = ({
  message = 'Something went wrong',
  type = 'error',
  ...args
}) => {
  console.error(`${message}`, args)
  notify({
    type,
    message,
  })
}
