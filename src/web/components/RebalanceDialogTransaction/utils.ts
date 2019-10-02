export const decideElementToShow = ({
  rebalanceError,
  showRetryButton,
  rebalanceIsCanceled,
  availablePercentage,
}) => {
  return (rebalanceError || rebalanceIsCanceled) && showRetryButton
    ? 'retry'
    : availablePercentage === 100
    ? 'goButton'
    : 'progressBar'
}
