import { BREAKPOINTS, FONTS } from '@variables/variables'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

// put overflow-x hidden since
// we dont need it to horizontal scrollbar
// on whole page

// implicitly we set overflow-y to scroll/auto

type AppContainerProps = {
  isSwapPage?: boolean
}

export const AppGridLayout = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden !important;
  background: ${(props) => props.theme.colors.background1};
  height: ${(props) =>
    props.isRewards || props.isSwapPage
      ? 'auto'
      : props.isChartPage || !props.showFooter
      ? 'calc(100vh)'
      : 'calc(100vh)'};
  min-height: 100vh;

  @media (max-width: 600px) {
    height: calc(var(--vh, 1vh) * 100);
    min-height: auto;
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    padding-bottom: 70px;
  }
`

export const AppInnerContainer = styled.div<AppContainerProps>`
  display: flex;
  flex-direction: column;
  //min-height: calc(100vh - 160px); /* header + footer*/
  flex: 1 0 auto;

  @media (max-width: ${BREAKPOINTS.xxxl}) {
    ${(props) => props.isSwapPage && `height: calc(100vh - 76px)`};
  }

  @media (max-width: ${BREAKPOINTS.sm}) {
    ${(props) => props.isSwapPage && `height:100%`};
  }
`

export const StyledToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'toast-body',
  progressClassName: 'toast-progress',
})`
  font-size: 1.5em;

  --toastify-font-family: ${FONTS.main};

  --toastify-toast-width: 360px;

  .toast {
    background-color: ${(props) => props.theme.colors.white6};
    border: 1px solid ${(props) => props.theme.colors.white5};
    border-radius: 16px;
    padding: 1.75em;
  }

  button[aria-label='close'] {
    display: none;
  }

  .toast-body {
    color: ${(props) => props.theme.colors.white1};
    padding: 0;
    min-height: 3em;
  }
`
