import * as React from 'react'
import styled from 'styled-components'

interface Props {
  src: string
  styledComponentsAdditionalStyle?: string
  style?: Object
  width?: number
  height?: number
}

export default class SvgIcon extends React.Component<Props, {}> {
  render() {
    const { src, style, styledComponentsAdditionalStyle } = this.props
    const width = this.props.width || 16
    const height = this.props.height || 16

    return (
      <WebIcon
        styledComponentsAdditionalStyle={styledComponentsAdditionalStyle}
        src={src.replace(/"/gi, '')}
        style={{ ...style, width, height }}
      />
    )
  }
}

const WebIcon = styled.img`
  object-fit: contain;
  ${(props: { styledComponentsAdditionalStyle: string }) =>
    props.styledComponentsAdditionalStyle};
`
