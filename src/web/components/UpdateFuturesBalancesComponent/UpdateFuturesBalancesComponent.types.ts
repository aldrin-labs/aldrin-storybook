export interface IProps {
    keyId: string
    updateFuturesBalancesHandler: (keyId: string) => Promise<void>
}