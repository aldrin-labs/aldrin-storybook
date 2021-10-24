import React, { useEffect, useState } from 'react'

import { estimatedTime } from '@core/utils/dateUtils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'

export const ReloadTimerTillUpdate = ({
  duration,
  getSecondsTillNextUpdate,
}: {
  duration: number
  getSecondsTillNextUpdate: () => number
}) => {
  const [secondsTillNextUpdate, setSecondsTillUpdate] = useState(0)
  const [
    refreshSecondsTillUpdateCounter,
    setRefreshSecondsTillUpdateCounter,
  ] = useState(0)

  const refreshSecondsTillUpdate = () =>
    setRefreshSecondsTillUpdateCounter(refreshSecondsTillUpdateCounter + 1)

  useEffect(() => {
    const secondsTillNextUpdate = getSecondsTillNextUpdate()

    setSecondsTillUpdate(secondsTillNextUpdate)
  }, [refreshSecondsTillUpdateCounter])

  if (!secondsTillNextUpdate) return null

  return (
    <DarkTooltip
      title={`${estimatedTime(
        secondsTillNextUpdate
      )} till data update. (every ${estimatedTime(duration)})`}
    >
      <span>
        <ReloadTimer
          initialRemainingTime={secondsTillNextUpdate}
          duration={duration}
          rerenderOnClick={false}
          callback={refreshSecondsTillUpdate}
        />
      </span>
    </DarkTooltip>
  )
}
