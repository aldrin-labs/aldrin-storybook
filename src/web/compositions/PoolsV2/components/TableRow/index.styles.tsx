import { BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { PADDINGS } from '@sb/components/Button'

import { RootRow } from '../../index.styles'

type ContainerProps = {
  width?: string
  margin?: string
  height?: string
}

export const LabelsRow = styled(RootRow)`
  margin: 10px 0 0 0;
  align-items: flex-start;
  div {
    margin: 0 0 5px 0;
  }
  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
    width: 100%;
    div {
      margin: 0 5px 0 0;
    }
  }
`
export const Row = styled(RootRow)`
  margin: 0;
  flex-direction: row;
`
export const DepositRow = styled(RootRow)`
  height: 100%;
  margin: 0;
  width: auto;
  justify-content: space-around;
  @media (min-width: ${BREAKPOINTS.sm}) {
    justify-content: space-between;
    flex-direction: column;
    width: 12%;
  }
`
export const Container = styled.div<ContainerProps>`
  width: 90%;
  background: ${(props) => props.theme.colors.white6};
  border-radius: ${BORDER_RADIUS.lg};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-bottom: ${(props) => props.margin || '1em'};
  height: 12em;
  padding: ${PADDINGS.xxxl};
  transition: 0.3s;
  overflow-x: scroll;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: ${(props) => props.width || '58%'};
    height: ${(props) => props.height || '8.5em'};
    justify-content: space-between;
    overflow: hidden;
  }

  &:hover {
    background: ${(props) => props.theme.colors.gray6};

    .wave-icon,
    .small-wave-icon {
      path {
        fill: ${(props) => props.theme.colors.gray6};
      }
    }
  }
`

export const StretchedRow = styled(RootRow)`
  width: 700px;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }
`
