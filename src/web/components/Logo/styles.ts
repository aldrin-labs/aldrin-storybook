import { Link } from 'react-router-dom'
import styled from 'styled-components'

type LogoBlockProps = {
  $width?: string
}

export const LogoBlock = styled.div<LogoBlockProps>`
  display: flex;
  align-items: center;

  svg {
    width: ${(props) => props.$width || '96px'};
    height: auto;

    path {
      fill: ${(props) => props.theme.colors.logo};
    }
  }
`

export const LogoLink = styled(Link)`
  display: block;
`
