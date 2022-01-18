import React, { useEffect, useState } from 'react'

import { estimatedTime } from '@core/utils/dateUtils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'

export const ReloadTimerTillUpdate = ({
  duration,
  margin,
  getSecondsTillNextUpdate,
}: {
  duration: number
  margin?: string
  getSecondsTillNextUpdate: () => number
}) => {
  const [secondsTillNextUpdate, setSecondsTillUpdate] = useState(0)
  const [refreshSecondsTillUpdateCounter, setRefreshSecondsTillUpdateCounter] =
    useState(0)

  const refreshSecondsTillUpdate = () =>
    setRefreshSecondsTillUpdateCounter(refreshSecondsTillUpdateCounter + 1)

  useEffect(() => {
    const secondsToUpdate = getSecondsTillNextUpdate()

    setSecondsTillUpdate(secondsToUpdate)
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
          margin={margin}
          rerenderOnClick={false}
          callback={refreshSecondsTillUpdate}
        />
      </span>
    </DarkTooltip>
  )
}
