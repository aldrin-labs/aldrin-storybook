import React from 'react'

import { IProps } from './QueryRenderPlaceholder.types'

export const QueryRenderPlaceholder = ({
  centerAlign,
  placeholderComponent,
}: IProps) => (
  <>
    (
    <div
      style={
        centerAlign ? { margin: '0 auto', height: '100%', width: '100%' } : {}
      }
    >
      {placeholderComponent}
    </div>
    )
  </>
)
