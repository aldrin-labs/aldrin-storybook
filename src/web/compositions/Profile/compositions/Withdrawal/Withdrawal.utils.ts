import storage from '@storage'

export const validateTransactionAmount = ({
  amount,
  transactionFee,
  minimalWithdrawalAmount,
}: {
  amount: number
  transactionFee: number
  minimalWithdrawalAmount: number
}): boolean => amount >= minimalWithdrawalAmount


export const getWithdrawalValues = async (withdrawalKey = 'withdrawal'): Promise<string | null> => {
  return await storage.getItem(`${withdrawalKey}`)
}

export const removeWithdrawalValues = async (withdrawalKey = 'withdrawal'): Promise<void> => {
  await storage.removeItem(`${withdrawalKey}`)
}

export const setWithdrawalValues = async (withdrawalObj: string, withdrawalKey = 'withdrawal'): Promise<void> => {
  return await storage.setItem(`${withdrawalKey}`, withdrawalObj)
}
