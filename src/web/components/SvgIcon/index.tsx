import * as React from 'react'
import styled from 'styled-components'

interface Props {
  src: string
  styledComponentsAdditionalStyle?: string
  style?: Object
  width?: number | string
  height?: number | string
  onClick?: (any: any) => any
}

export default class SvgIcon extends React.Component<Props, {}> {
  render() {
    const {
      src,
      style,
      styledComponentsAdditionalStyle,
      animation,
      onClick,
      alt = '',
    } = this.props
    const width = this.props.width || 16
    const height = this.props.height || 16

    return (
      <WebIcon
        alt={alt}
        styledComponentsAdditionalStyle={styledComponentsAdditionalStyle}
        src={src.replace(/"/gi, '')}
        style={{ ...style, width, height }}
        onClick={onClick}
      />
    )
  }
}

const WebIcon = styled.img`
  object-fit: contain;
  ${(props: { styledComponentsAdditionalStyle: string }) =>
    props.styledComponentsAdditionalStyle};
`
