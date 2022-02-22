import React, { ReactNode } from 'react'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

export const TooltipRegionBlocker = ({
  isFromRestrictedRegion,
  children,
}: {
  isFromRestrictedRegion: boolean
  children: any
}) => {
  if (isFromRestrictedRegion) {
    return (
      <DarkTooltip
        title={`
            Sorry, Aldrin.com doesn't offer its services in your region.
            If you think your access is restricted by mistake or have another
            question, please contact us via: contact@aldrin.com
        `}
      >
        {children}
      </DarkTooltip>
    )
  }

  return children
}
