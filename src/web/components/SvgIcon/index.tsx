import * as React from 'react'
import styled from 'styled-components'


interface WebIconProps {
  width?: string
  height?: string
}

interface Props extends WebIconProps {
  alt?: string
  src: string
  style?: React.CSSProperties
  onClick?: (any: any) => any
  onError?: (e: React.ChangeEvent<HTMLImageElement>) => void
}


const WebIcon = styled.img<WebIconProps>`
  object-fit: contain;
  width: ${(props: WebIconProps) => props.width || '16px'};
  height: ${(props: WebIconProps) => props.height || '16px'};
`


const SvgIcon: React.FC<Props> = (props) => {
  const {
    alt = '', src, onClick, onError, style, width, height
  } = props
  return (
    <WebIcon
      alt={alt}
      src={src.replace(/"/gi, '')}
      style={style}
      onClick={onClick}
      onError={onError}
      width={width}
      height={height}
    />
  )
}


export default SvgIcon