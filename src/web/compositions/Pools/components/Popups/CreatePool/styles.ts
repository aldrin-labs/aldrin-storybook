import styled from 'styled-components'
import { FlexBLock } from '@sb/components/Layout'
import { Button } from '@sb/components/Button'
import { BlockContent } from '@sb/components/Block'

export const Title = styled.span`
  font-size: 32px;
  line-height: 1.4;
  font-weight: 700;

  span {
    font-weight: 400;
  }
`

export const Footer = styled(FlexBLock)`
  ${Button} {
    flex: 1;
    margin: 0 10px;
  }
`

export const Body = styled(BlockContent)`
  width: 95vw;
  max-width: 730px;
`