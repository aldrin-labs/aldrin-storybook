import React from 'react'
import { IconArrow } from '@sb/styles/cssUtils'

export const getArrowSymbol = (base: string, quote: string, left = false) => (
  <>
    <span style={{ textTransform: 'uppercase' }}>{base}</span>
    <IconArrow
      className={`fa fa-arrow-${left ? 'left' : 'right'}`}
      style={{
        color: '#2F7619',
      }}
    />
    <span style={{ textTransform: 'uppercase' }}>{quote}</span>
  </>
)
