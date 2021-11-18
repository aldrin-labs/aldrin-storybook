import { withTheme } from '@material-ui/core'
import { Theme } from '@sb/types/materialUI'
import React from 'react'
import { compose } from 'recompose'
import { DesktopBanner } from './desktopPopup'
import { MobileBanner } from './mobilePopup'

const WarningBanner = ({
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

export default compose(withTheme())(WarningBanner)
