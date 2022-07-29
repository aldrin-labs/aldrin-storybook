export interface SwapChartProps {
  isCrossOHLCV: boolean
  marketType: number
  inputTokenMintAddress: string
  outputTokenMintAddress: string
  pricesMap: Map<string, number>
}
