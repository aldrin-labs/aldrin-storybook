import React from 'react'
import { IconArrow } from '@sb/styles/cssUtils'

export const getArrowSymbol = (base: string, quote: string) => (
  <>
    {base.toUpperCase()}
    <IconArrow
      className="fa fa-arrow-right"
      style={{
        color: '#2F7619'
      }}
    />
    {quote.toUpperCase()}
  </>
)
