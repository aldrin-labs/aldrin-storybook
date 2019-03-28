export interface IProps {
  pair: [string, string]
  priceType: string
  classes: any
  funds: [number, number],
  price: number
  placeOrder: (values: any) => void
}
