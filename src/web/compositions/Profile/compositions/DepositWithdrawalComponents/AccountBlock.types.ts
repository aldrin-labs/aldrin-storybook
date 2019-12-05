export interface IProps {
    isDepositPage?: boolean
    selectedCoin: string
    setSelectedCoin: (selectedCoin: string) => void
    selectedAccount: string
    setSelectedAccount: (selectedAccount: string) => void
}