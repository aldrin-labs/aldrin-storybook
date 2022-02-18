import { notify } from '../../dexUtils/notifications'
import { SignAndSendTransactionResult } from '../../dexUtils/transactions/types'

export const notifyAboutStakeTransaction = (
  result: SignAndSendTransactionResult
) => {
  if (result === 'success') {
    return notify({
      message: 'Staked succesfully',
      type: 'success',
    })
  }
  if (result === 'cancelled' || result === 'rejected') {
    return notify({
      message: 'Staking cancelled',
      type: 'warn',
    })
  }
  if (result === 'failed') {
    return notify({
      message: 'Staking failed',
    })
  }
  return notify({
    message: 'Something went wrong',
    type: 'error',
  })
}

export const notifyAboutUnStakeTransaction = (
  result: SignAndSendTransactionResult
) => {
  if (result === 'success') {
    return notify({
      message: 'Unstaked succesfully',
      type: 'success',
    })
  }
  if (result === 'cancelled' || result === 'rejected') {
    return notify({
      message: 'Untaking cancelled',
      type: 'warn',
    })
  }
  if (result === 'failed') {
    return notify({
      message: 'Unstaking failed',
    })
  }
  return notify({
    message: 'Something went wrong',
    type: 'error',
  })
}
