import React, { CSSProperties } from 'react'

import { TriggerTitle, CardTitle } from './styles'

const ChartCardHeader = ({
  children,
  style,
  triggerTitleStyle,
  padding,
}: {
  children?: React.ReactChild
  style?: CSSProperties
  triggerTitleStyle?: CSSProperties
  padding?: string
}) => {
  return (
    <TriggerTitle style={triggerTitleStyle} padding={padding}>
      <CardTitle padding={padding} style={style} variant="subtitle2">
        {children}
      </CardTitle>
    </TriggerTitle>
  )
}

export default ChartCardHeader
