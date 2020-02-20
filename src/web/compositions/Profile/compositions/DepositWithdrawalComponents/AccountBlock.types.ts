export interface IProps {
  isDepositPage?: boolean
  selectedCoin: { label: string; name: string }
  setSelectedCoin: ({ label, name }: { label: string; name: string }) => void
  selectedKey: string
}
