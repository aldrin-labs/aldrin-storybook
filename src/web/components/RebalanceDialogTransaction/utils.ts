export const decideElementToShow = ({
  rebalanceError,
  showRetryButton,
  rebalanceIsCanceled,
  availablePercentage,
}) => {
  return rebalanceError && showRetryButton && !rebalanceIsCanceled
    ? 'retry'
    : availablePercentage === 100
    ? 'goButton'
    : 'progressBar'
}
