import styled from 'styled-components'

// put overflow-x hidden since
// we dont need it to horizontal scrollbar
// on whole page

// implicitly we set overflow-y to scroll/auto
export const AppGridLayout = styled.div`
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 130px); /* header + footer*/
  // flex: 1 0 auto;
`
