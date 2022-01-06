import React from 'react'

import { SvgIcon } from '@sb/components'
import { useLocalStorageState } from '@sb/dexUtils/utils'

import Close from '@icons/closeIcon.svg'
import LightLogo from '@icons/lightLogo.svg'

import { BannerContainer, BannerText } from './styles'

export const WaningBanner: React.FC<{ bannerId: string }> = (props) => {
  const { bannerId, children } = props
  const [isWarningPopupOpen, openWarningPopup] = useLocalStorageState(
    bannerId,
    true
  )

  if (!isWarningPopupOpen) return null

  return (
    <BannerContainer>
      <SvgIcon height="4rem" width="auto" src={LightLogo} />
      <BannerText color="white">{children}</BannerText>
      <SvgIcon
        height="2rem"
        width="auto"
        src={Close}
        style={{ cursor: 'pointer' }}
        onClick={() => openWarningPopup(false)}
      />
    </BannerContainer>
  )
}
