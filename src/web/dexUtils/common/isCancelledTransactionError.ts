export const isCancelledTransactionError = (e: Error) =>
  e.message.includes('cancelled') || e.message.includes('rejected')
