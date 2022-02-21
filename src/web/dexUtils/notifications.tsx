import { Link } from '@material-ui/core'
import React from 'react'

import SnackbarUtils from '@sb/utils/SnackbarUtils'

import { MASTER_BUILD } from '@core/utils/config'

export const notify = ({
  message,
  description = '',
  txid = '',
  type = 'info',
  persist = false,
}: {
  message: string
  description?: any
  txid?: string
  type?: string
  persist?: boolean
}) => {
  let notificationDescription = null
  console.log('notification: ', message)

  if (txid) {
    notificationDescription = (
      <Link
        rel="noopener noreferrer"
        target="_blank"
        to={`https://solscan.io/tx/${txid}`}
        href={`https://solscan.io/tx/${txid}`}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginLeft: '.5rem',
            height: '4em',
          }}
        >
          <span
            style={{
              color: '#C1C1C1',
              fontFamily: 'Avenir Next',
              fontSize: '1.6rem',
            }}
          >
            {message}
          </span>
          <p style={{ color: '#C1C1C1', margin: 0 }}>
            <span>View transaction{description ? ':' : ''} </span> {description}
          </p>
        </div>
      </Link>
    )
  } else {
    notificationDescription = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: description ? 'space-between' : 'center',
          marginLeft: '.5rem',
          height: '4em',
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
          <p style={{ color: '#C1C1C1', margin: 0 }}>{description}</p>
        )}
      </div>
    )
  }

  // we cannot add new type so for loading we use determined one
  if (type === 'loading') type = 'warning'

  return SnackbarUtils[type](notificationDescription, {
    variant: type,
    persist,
  })
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
