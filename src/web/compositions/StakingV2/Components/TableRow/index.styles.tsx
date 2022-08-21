import { BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import { rgba } from 'polished'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { PADDINGS } from '@sb/components/Button'

import { RootRow } from '../../index.styles'
import { Row as HeaderRow } from '../Popups/index.styles'

type ContainerProps = {
  width?: string
  margin?: string
  height?: string
}

export const LabelsRow = styled(RootRow)`
  margin: 10px 0 0 0;
  align-items: flex-start;
  justify-content: flex-start;
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

  @media (max-width: ${BREAKPOINTS.md}) {
    width: 100%;

    .linksRow {
      display: none;
    }
  }
`
export const Container = styled.div<ContainerProps>`
  width: 90%;
  background: ${(props) => props.theme.colors.white6};
  border-radius: ${BORDER_RADIUS.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: ${(props) => props.margin || '1em'};
  height: 12em;
  padding: ${PADDINGS.xxxl};
  transition: 0.3s;
  overflow-x: scroll;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: ${(props) => props.width || '58%'};
    height: ${(props) => props.height || '8.5em'};
    justify-content: center;
    overflow: hidden;
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    height: 24em;
    align-items: center;
    overflow-x: none;
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
  margin: 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    justify-content: space-between;
    margin: 0;
    height: 5.5em;
    width: 100%;
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    width: 100%;
    flex-direction: column;
    height: 40em;

    .iconColumn {
      position: relative;
      flex-direction: column;
      align-items: flex-start;
    }
  }
`

export const StyledLink = styled(Link)`
  background: ${(props) => rgba(props.theme.colors.green0, 0.15)};
  border: none;
  color: ${(props) => props.theme.colors.green1};
  white-space: nowrap;
  font-weight: 700;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  text-decoration: none;
  padding: 15px 11px;
  font-size: 0.8125em;
  width: 100%;
  border-radius: 8px;

  &:hover {
    background: ${(props) => props.theme.colors.green11};
  }

  &:active {
    background: ${(props) => props.theme.colors.green12};
  }
`

export const SRow = styled(HeaderRow)`
  .smallLinksRow {
    display: none;
  }
  @media (max-width: ${BREAKPOINTS.md}) {
    .smallLinksRow {
      display: block;
      position: absolute;
      top: 10px;
      right: 0px;
    }
  }

  @media (max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column;
    align-items: flex-start;

    div {
      margin-bottom: 0.2em;
    }
  }
`

export const Block = styled.div``
