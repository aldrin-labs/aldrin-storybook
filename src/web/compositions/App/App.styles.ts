import styled from 'styled-components'

// put overflow-x hidden since
// we dont need it to horizontal scrollbar
// on whole page

// implicitly we set overflow-y to scroll/auto
export const AppGridLayout = styled.div`
  position: relative;
  overflow-x: hidden !important;
  height: ${(props) => (props.isChartPage ? '100vh' : '93.6vh')};
`

// height: calc(100vh - 3rem)
// @media (max-width: 1920px) {
//   min-height: ${(props) =>
//     props.showFooter ? 'calc(100vh - 48px)' : '100vh'};
//   max-height: ${(props) => (props.isPNL ? 'calc(100vh - 48px)' : '')};
// }

// todo

// fix >5 acc
// transactions layout
// btc usdt switcher
