import React, { ReactNode } from 'react'

export const getTextOverButton = ({
  showRebalanceProgress,
  showRetryButton,
  rebalanceError,
  rebalanceIsCanceled,
}: {
  showRebalanceProgress: boolean
  showRetryButton: boolean
  rebalanceError: boolean
  rebalanceIsCanceled: boolean
}): ReactNode => {
  if ((rebalanceError || rebalanceIsCanceled) && showRetryButton) {
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

  if (showRebalanceProgress) {
    return <span>REBALANCE IS PROCESSING</span>
  } else {
    return (
      <div>
        Distribute <span>100%</span> of your assets for rebalance.
      </div>
    )
  }
}
