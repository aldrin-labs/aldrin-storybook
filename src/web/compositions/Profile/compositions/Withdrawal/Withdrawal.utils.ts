export const validateTransactionAmount = ({
  amount,
  transactionFee,
  minimalWithdrawalAmount,
}: {
  amount: number
  transactionFee: number
  minimalWithdrawalAmount: number
}): boolean => amount >= minimalWithdrawalAmount
