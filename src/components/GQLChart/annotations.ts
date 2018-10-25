import { ProfileQueryQuery } from '../profile-annotation'

export interface Props {
  coin?: ProfileQueryQuery['assetById']
  style?: Object
  height?: number
}

export interface State {
  activeChart: number
  lastDrawLocation: {
    top: number
    left: number
    right: number
    bottom: number
  } | null
  crosshairValues: ({ x: number; y: number } | null)[]
}
