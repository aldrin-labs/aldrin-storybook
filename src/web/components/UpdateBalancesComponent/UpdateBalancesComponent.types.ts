export interface IProps {
    marketType: 0 | 1
    keyId: string
    updateBalancesHandler: (keyId: string) => Promise<void>
}