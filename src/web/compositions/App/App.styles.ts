import styled, { createGlobalStyle } from 'styled-components'
import DMSans from '@sb/fonts/DMSans.woff2'
import DMSansMedium from '@sb/fonts/DMSans-Medium.woff2'
import FontAwesome from '@sb/fonts/fontawesome-webfont.woff2'
import IBMPlexSansCondensed from '@sb/fonts/IBMPlexSansCondensed.woff2'
// put overflow-x hidden since
// we dont need it to horizontal scrollbar
// on whole page

// implicitly we set overflow-y to scroll/auto
export const AppGridLayout = styled.div`
  position: relative;
  overflow-x: hidden !important;
  height: ${(props) =>
    props.isChartPage || !props.showFooter ? '100vh' : '93.6vh'};
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

export const FontStyle = createGlobalStyle`
/* latin */
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400;
  src: local('DM Sans Regular'), local('DMSans-Regular'), url('${DMSans}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'DM Sans Medium';
  font-style: normal;
  font-weight: 500;
  src: local('DM Sans Medium'), local('DMSans-Regular'), url('${DMSans}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'IBM Plex Sans Condensed';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('IBM Plex Sans Condensed'), local('IBMPlexSansCond'), url('${IBMPlexSansCondensed}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'FontAwesome';
  src: url('${FontAwesome}') format('woff2');
  font-weight: normal;
  font-style: normal;
}

.fa{display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.fa-circle:before{content:"\f111"}.fa-usd:before{content:"\f155"}.fa-btc:before{content:"\f15a"}.fa-arrow-left:before{content:"\f060"}.fa-arrow-right:before{content:"\f061"}.fa-ellipsis-h:before{content:"\f141"}
`
