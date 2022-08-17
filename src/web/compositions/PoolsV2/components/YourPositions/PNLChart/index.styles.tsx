import styled from 'styled-components'

import { RootColumn } from '@sb/compositions/PoolsV2/index.styles'

export const CanvasContainer = styled.div`
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.white4};
  border-radius: 10px;

  canvas {
  }
`
export const ChartMask = styled.div`
  position: absolute;
  height: 65%;
  width: 2px;
  background: ${(props) => props.theme.colors.white6};
  right: 2%;
  top: 25%;
`

export const SRootColumn = styled(RootColumn)`
  position: relative;
`
