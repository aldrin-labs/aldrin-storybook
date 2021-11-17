import { Theme } from '@sb/types/materialUI'
import React from 'react'
import { DesktopBanner } from './desktopPopup'
import { MobileBanner } from './mobilePopup'

export const WarningBanner = ({
  theme,
  localStorageProperty = '',
  title = 'Important note!',
  notification = [''],
  needMobile = true,
}: {
  theme: Theme
  localStorageProperty: string
  title?: string
  notification: string[]
  needMobile: boolean
}) => {
  return (
    <>
      <DesktopBanner
        theme={theme}
        localStorageProperty={localStorageProperty}
        title={title}
        notification={notification}
      />
      {needMobile ? (
        <MobileBanner
          theme={theme}
          localStorageProperty={localStorageProperty}
          title={title}
          notification={notification}
        />
      ) : null}
    </>
  )
}
