import React from 'react'

import { DesktopBanner } from './desktopPopup'
import { MobileBanner } from './mobilePopup'

const WarningBanner = ({
  localStorageProperty = '',
  title = 'Important note!',
  notification = [''],
  needMobile = true,
}: {
  localStorageProperty: string
  title?: string
  notification: string[]
  needMobile: boolean
}) => {
  return (
    <>
      <DesktopBanner
        localStorageProperty={localStorageProperty}
        title={title}
        notification={notification}
      />
      {needMobile ? (
        <MobileBanner
          localStorageProperty={localStorageProperty}
          title={title}
          notification={notification}
        />
      ) : null}
    </>
  )
}

export default WarningBanner
