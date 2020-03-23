import React from 'react'
import styled from 'styled-components'

const IconArrow = styled.i`
  padding: 0 5px;
  font-size: 1rem;

  position: relative;
  top: -1px;
  left: 0;
`

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
