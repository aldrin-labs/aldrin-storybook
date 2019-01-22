import styled from 'styled-components'

import { customAquaScrollBar } from '@styles/cssUtils'

export const Table = styled.div`
  font-family: Roboto, sans-serif;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  max-height: calc(100vh - 59px - 80px);
  overflow-y: hidden;

  @media (max-width: 1080px) {
    width: 100%;
  }
`

export const FullWidthBlock = styled.div`
  width: 100%;
`

export const Title = styled.div`
  width: 100%;
  padding: 6px;
  height: 40px;
  background: ${(props: { background: string }) => props.background};
  text-align: center;
  vertical-align: middle;

  @media (max-width: 1080px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const Body = styled.ul`
  margin: 0;
  padding: 0;
  width: 100%;
  height: ${(props: { height?: string }) => props.height};
  overflow-y: auto;
  overflow-x: hidden;
  transition: height 0.25s ease-out;
  background: ${(props: { background?: string; height?: string }) =>
    props.background ? props.background : 'transparent'};
  ${customAquaScrollBar};
`

export const Row = styled.li`
  width: 100%;
  position: relative;
  display: flex;

  transition: background 0.25s ease;
  background-color: ${(props: { isHead?: boolean; background: string }) =>
    props.background};
  height: ${(props: { isHead?: boolean }) => (props.isHead ? '100%' : '2rem')};
  will-change: background;

  &:hover {
    background: ${(props: {
      isHead?: boolean
      hoverBackground?: string
      background: string
    }) => (props.isHead ? props.background : props.hoverBackground)};
  }
`

export const Cell = styled.div`
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0rem 0.4rem;
  font-weight: 600;
  font-size: 0.75rem;
  flex-basis: ${(props: { width: string }) => props.width};
  text-align: center;
  vertical-align: middle;
  display: flex;
  opacity: 1;
  place-items: center;
`

export const HeadCell = styled(Cell)`
  font-weight: 400;
  font-size: 0.75rem;
  white-space: nowrap;
  display: flex;
  width: 7%;
`

// padding right for scrollbar width
export const Head = styled.ul`
  margin: 0;
  padding: 0;
  padding-right: 6px;
  height: 2rem;
  width: 100%;
  background-color: ${(props: { background?: string; border?: string }) =>
    props.background};
  border-bottom: 1px solid
    ${({ border }: { border?: string; background?: string }) => border};
  position: sticky;
  top: 0;
`
