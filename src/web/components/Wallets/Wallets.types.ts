
export interface IProps {
  data: {getProfile: any}
  setWallets: Function
  setActiveWallets: Function
  wallets: string[]
  activeWallets: string[]
  onToggleWalletCheckbox: Function
  color: string
}

export type walletItem = {
  _id: string
  name: string | null
}
