import { BREAKPOINTS, FONTS } from "@variables/variables"
import { ToastContainer } from 'react-toastify'
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
  background: ${(props) => props.theme.colors.background1};
  height: ${(props) => (props.isRewards ? 'auto' : '100vh')};
  min-height: 100vh;

  @media (max-width: 600px) {
    height: calc(var(--vh, 1vh) * 100);
    min-height: auto;
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    padding-bottom: 70px;
  }
`

export const AppInnerContainer = styled.div`
  display: flex;
  flex-direction: column;

  flex: ${(props) => (props.$isSwapPage ? '1' : '1 0 auto')};
  overflow: ${(props) => (props.$isSwapPage ? 'auto' : 'inherit')};
`

export const StyledToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'toast-body',
  progressClassName: 'toast-progress',
})`
  font-size: 1.5em;

  --toastify-font-family: ${FONTS.main};

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
