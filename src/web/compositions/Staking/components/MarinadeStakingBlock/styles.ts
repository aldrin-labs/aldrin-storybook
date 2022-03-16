import { BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { ContentBlock } from '../../styles'
import bg from './bg.png'
import { FillerProps } from './types'

export const LogoWrap = styled.div`
  height: 200px;
  position: relative;
  background-image: url(${bg});
  background-repeat: none;
  background-size: cover;

  border-radius: 12px 12px 0px 0px;
  display: flex;
  align-items: center;
  padding: 0 20px;
`

export const AbsoluteImg = styled.img`
  position: absolute;
  left: 13%;
  max-width: 75%;
`

export const Filler = styled.div<FillerProps>`
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(38, 159, 19, 0.2);
  border-radius: ${BORDER_RADIUS.md};
  width: ${(props: FillerProps) => props.$width}%;
  height: 100%;
`

export const RelativeContentBlock = styled(ContentBlock)`
  position: relative;
`
