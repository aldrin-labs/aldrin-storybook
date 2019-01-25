import { Theme } from '@material-ui/core'

export interface Props {
  title: string
  style: object
  height: string
  lastDrawLocation: {
    left: number
    right: number
  }
  data: ReadonlyArray<Record>
  crosshairValues: ReadonlyArray<Record>
  activeChart: string
  theme: Theme
  isShownMocks: boolean
  chartBtns: ReadonlyArray<string>
  mapLabelToDays: MapLabelToDays
  setActiveChartAndUpdateDays: (label: string, days: number) => void
}

export interface Record {
  x: number
  y: number
}

export interface MapLabelToDays {
  [index: string]: number
}