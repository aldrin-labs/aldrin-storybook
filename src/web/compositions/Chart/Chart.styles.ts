import styled from 'styled-components'
import { Card, Grid } from '@material-ui/core'
import { CSS_CONFIG } from '@storybook/config/cssConfig'

export const MainContainer = styled.div`
  ${(props: { fullscreen: boolean }) => props.fullscreen && 'height: 100vh'};
`
export const DepthChartContainer = styled(Card)`
  height: 100%;
  width: 100%;
`

export const TablesBlockWrapper = styled(Card)`
  min-width: 150px;
  width: 50%;
  position: relative;
  ${(props: { blur?: boolean }) => (props.blur ? 'filter: blur(5px);' : '')}

  && {
    overflow: hidden;
    background-color: ${(props: { background?: string }) => props.background};
    box-shadow: none !important;
  }

  @media (max-width: 1080px) {
    display: ${(props: { variant: { show?: boolean } }) =>
  props.variant.show ? 'block' : 'none'};
    width: 100%;
    height: calc(100vh - 57px - 70px);
    position: relative;
  }
`

export const TablesContainer = styled(Grid)`
  position: relative;
  display: flex;

  height: calc(100vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`

export const ChartsContainer = styled(TablesContainer)`
  height: calc(100vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  justify-content: flex-end;
  flex-direction: column;
  width: 60%;

  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }
`

// margin for centring
export const TogglerContainer = styled(Grid)`
  margin-bottom: -8px;
  height: 4rem;
  width: 100%;
`

export const Toggler = styled.div`
  && {
    margin-left: 0.7rem;
  }
`

export const Container = styled(Grid)`
  width: 100%;
  margin: 0;
`
