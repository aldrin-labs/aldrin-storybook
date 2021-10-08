import { RebalancePopupStep } from '../Rebalance.types'

export const getTransactionState = ({
  rebalanceStep,
  isTransactionCompleted,
}: {
  rebalanceStep: RebalancePopupStep
  isTransactionCompleted: boolean
}): RebalancePopupStep | null => {
  switch (rebalanceStep) {
    case 'initial': {
      return null
    }
    case 'pending': {
      if (isTransactionCompleted) {
        return 'done'
      }
      return 'pending'
    }
    case 'failed': {
      if (isTransactionCompleted) {
        return 'done'
      }
      return 'failed'
    }
    case 'done': {
      return 'done'
    }
    default: {
      return null
    }
  }
}
