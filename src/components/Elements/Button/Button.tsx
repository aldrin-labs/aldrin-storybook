import * as React from 'react'
import styled from 'styled-components'

import { Props } from '@components/Elements/Button/types'

export default class Button extends React.Component<Props> {
  onClick = (e: MouseEvent) => {
    const { onClick } = this.props

    if (onClick) onClick()
  }

  render() {
    const { style, title, mRight, active } = this.props
    let btnStyle = {}
    if (mRight) btnStyle = { ...btnStyle, marginRight: '24px' }
    if (active)
      btnStyle = { ...btnStyle, backgroundColor: '#4ed8da', color: '#000000df' }

    return (
      <Btn onClick={this.onClick} style={{ ...style, ...btnStyle }}>
        {title}
      </Btn>
    )
  }
}

const Btn = styled.button`
  border-radius: 2px;
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
  text-transform: uppercase;
`
