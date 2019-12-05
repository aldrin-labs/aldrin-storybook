export interface IProps {
  isDepositPage?: boolean
  selectedCoin: string
  setSelectedCoin: (selectedCoin: string) => void
  selectedAccount: { keyId: string; label: string; value: number }
  setSelectedAccount: (selectedAccount: { keyId: string; label: string; value: number }) => void
}
