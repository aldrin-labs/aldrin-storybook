import React, { ReactNode } from 'react'

export const getTextOverButton = ({
  progress,
  showRetryButton,
  rebalanceError,
  rebalanceIsCanceled,
}: {
  progress: number | null
  showRetryButton: boolean
  rebalanceError: boolean
  rebalanceIsCanceled: boolean
}): ReactNode => {
  if (rebalanceError && showRetryButton && !rebalanceIsCanceled) {
    return (
      <span style={{ color: '#DD6956', textTransform: 'uppercase' }}>
        Rebalance is unsuccessful
      </span>
    )
  }

  if (rebalanceIsCanceled) {
    return (
      <div>
        Distribute <span>100%</span> of your assets for rebalance.
      </div>
    )
  }

  if (progress !== null) {
    return <span>REBALANCE IS PROCESSING</span>
  } else {
    return (
      <div>
        Distribute <span>100%</span> of your assets for rebalance.
      </div>
    )
  }
}
