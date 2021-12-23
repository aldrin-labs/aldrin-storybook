import styled from 'styled-components'
import { BREAKPOINTS } from '../../../variables/variables'
// put overflow-x hidden since
// we dont need it to horizontal scrollbar
// on whole page

// implicitly we set overflow-y to scroll/auto
export const AppGridLayout = styled.div`
  position: relative;
  overflow-x: hidden !important;
  height: ${(props) =>
    props.isRewards
      ? 'auto'
      : props.isChartPage || !props.showFooter
      ? 'calc(100vh)'
      : 'calc(100vh)'};
  min-height: 100vh;
  @media (max-width: 600px) {
    height: calc(var(--vh, 1vh) * 100);
    min-height: auto;
  }
`

export const AppInnerContainer = styled.div`
  overflow: ${(props) => (props.currentPage === '/' ? 'hidden' : 'auto')};
  display: flex;
  flex-direction: column;
  height: calc(100% - 19rem);
  @media (min-width: ${BREAKPOINTS.md}) {
    height: ${(props) =>
      props.showFooter ? 'calc(100% - 11.7rem)' : 'calc(100% - 48px)'};
  }
`
