// TODO: Why when I edit it did not update the hot reloader

export interface IProps {

}

export interface IState {
  timeInterval: string
  industry: undefined[] | string[]

  marketCapSlider: string
  changeInPercentage: string
  simpleMovingAverage: string
  closingPriceAverage: string
  averageVolume: string
  averageVolumeOnBalance: string
  low: string
  high: string

  changeInPercentageInput: string
  simpleMovingAverageInput: string
  closingPriceAverageInput: string
  averageVolumeInput: string
  averageVolumeOnBalanceInput: string

  showFilters: boolean
}
