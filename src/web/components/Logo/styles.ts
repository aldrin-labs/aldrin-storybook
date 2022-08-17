import { BREAKPOINTS } from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

type LogoBlockProps = {
  $width?: string
}

export const LogoBlock = styled.div<LogoBlockProps>`
  display: flex;
  align-items: center;

  svg {
    width: ${(props) => props.$width || '6em'};
    height: auto;

    @media (max-width: ${BREAKPOINTS.xs}) {
      width: ${(props) => props.$width || '4em'};
    }

    path {
      fill: ${(props) => props.theme.colors.logo};
    }
  }
`

export const LogoLink = styled(Link)`
  display: block;
`
