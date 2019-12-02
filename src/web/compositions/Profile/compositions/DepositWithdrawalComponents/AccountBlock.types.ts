export interface IProps {
    isDepositPage?: boolean
    totalBalance: number
    inOrder: number
    availableBalance: number
    selectedCoin: string
    setSelectedCoin: (selectedCoin: string) => void
    selectedAccount: string
    setSelectedAccount: (selectedAccount: string) => void
}