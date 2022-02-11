export const resolveStakingNotification = (
  status: 'success' | 'failed' | string
) => {
  if (status === 'success') {
    return 'Successfully staked.'
  }
  if (status === 'failed') {
    return 'Staking failed, please try again later or contact us in telegram.'
  }

  return 'Staking cancelled.'
}

export const resolveUnstakingNotification = (
  status: 'success' | 'failed' | string
) => {
  if (status === 'success') {
    return 'Successfully unstaked.'
  }
  if (status === 'failed') {
    return 'Unstaking failed, please try again later or contact us in telegram.'
  }

  return 'Unstaking cancelled.'
}

export const resolveClaimNotification = (
  status: 'success' | 'failed' | 'rejected' | string
) => {
  if (status === 'success') {
    return 'Successfully claimed rewards.'
  }
  if (status === 'failed') {
    return 'Claim rewards failed, please try again later or contact us in telegram.'
  }
  if (status === 'rejected') {
    return 'Claim rewards cancelled.'
  }

  return 'Operation timeout, please claim rest rewards in a few seconds.'
}

export const resolveRestakeNotification = (
  status: 'success' | 'failed' | 'rejected' | string
) => {
  if (status === 'success') {
    return 'Successfully restaked.'
  }
  if (status === 'failed') {
    return 'Restake failed, please try again later or contact us in telegram.'
  }
  if (status === 'rejected') {
    return 'Restake cancelled.'
  }

  return 'Operation timeout, please claim rest rewards in a few seconds.'
}
