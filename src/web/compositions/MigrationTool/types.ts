interface CommonStepParams {
  nextStep: () => void
}

interface ConnectWalletStepParams extends CommonStepParams {
  openWalletPopup: () => void
}

interface SpecifyWalletAddressParams extends CommonStepParams {
  setSendToWalletAddress: (address: string) => void
}

interface WithdrawPositionsParams extends CommonStepParams {
  operationType: 'withdraw' | 'deposit'
  sendToWalletAddress: string
}

export {
  CommonStepParams,
  ConnectWalletStepParams,
  SpecifyWalletAddressParams,
  WithdrawPositionsParams,
}
