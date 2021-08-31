import React, { CSSProperties } from 'react'
import { Theme } from '@material-ui/core'

import { TriggerTitle, CardTitle } from './styles'

const ChartCardHeader = ({
  children,
  style,
  theme,
  triggerTitleStyle,
  padding,
}: {
  children?: React.ReactChild
  style?: CSSProperties
  triggerTitleStyle?: CSSProperties
  theme?: Theme
  padding?: string
}) => {
  return (
    <TriggerTitle style={triggerTitleStyle} theme={theme} padding={padding}>
      <CardTitle
        padding={padding}
        style={style}
        variant="subtitle2"
        theme={theme}
      >
        {children}
      </CardTitle>
    </TriggerTitle>
  )
}

export default ChartCardHeader
