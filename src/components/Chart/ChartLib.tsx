import { PureComponent } from 'react'
import { UDFCompatibleDatafeed } from './datafeed'

export const IntervalTypes = {
  D: 'D',
  W: 'W',
}

export const Themes = {
  LIGHT: 'Light',
  DARK: 'Dark',
}

export const BarStyles = {
  BARS: '0',
  CANDLES: '1',
  HOLLOW_CANDLES: '9',
  HEIKIN_ASHI: '8',
  LINE: '2',
  AREA: '3',
  RENKO: '4',
  LINE_BREAK: '7',
  KAGI: '5',
  POINT_AND_FIGURE: '6',
}

const SCRIPT_ID = 'tradingview-widget-script'
const CONTAINER_ID = 'tradingview-widget'

export default class TradingViewWrapper extends PureComponent {
  state = { containerStyle: {} }

  componentDidMount = () => this.appendScript(this.initWidget)

  componentDidUpdate = () => {
    this.cleanWidget()
    this.initWidget()
  }

  appendScript = (onload) => {
    if (this.scriptExists()) {
      onload()
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://s3.tradingview.com/tv.js'
    script.onload = onload
    document.getElementsByTagName('head')[0].appendChild(script)
  }

  scriptExists = () => document.getElementById(SCRIPT_ID) !== null

  initWidget = () => {
    const { widgetType, ...widgetConfig } = this.props
    const config = { ...widgetConfig, container_id: CONTAINER_ID }

    if (config.autosize) {
      delete config.width
      delete config.height
      const container = document.getElementById(CONTAINER_ID)
      container.style.width = '100%'
      container.style.height = '100%'
    }

    if (typeof config.interval === 'number') {
      config.interval = config.interval.toString()
    }

    if (config.popup_width && typeof config.popup_width === 'number') {
      config.popup_width = config.popup_width.toString()
    }

    if (config.popup_height && typeof config.popup_height === 'number') {
      config.popup_height = config.popup_height.toString()
    }

    /* global TradingView */
    new TradingView[widgetType](config)
  }

  cleanWidget = () => {
    document.getElementById(CONTAINER_ID).innerHTML = ''
  }

  render = () => <article id={CONTAINER_ID} />
}
