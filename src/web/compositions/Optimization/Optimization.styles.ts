import { LinearProgress, Card, CardContent } from '@material-ui/core'
import styled from 'styled-components'
import { customAquaScrollBar } from '@styles/cssUtils'
import { CardHeader } from '@storybook/components/index'

export const Loader = styled(LinearProgress)`
  margin-bottom: 0.5rem;
`

export const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`
export const Chart = styled.div`
  padding: 0.5rem;
  flex-grow: 1;
  min-width: 0;
  height: 300px;
  border-radius: 1rem;
  background: ${(props: { background: string }) => props.background};

  @media (max-width: 1080px) {
    width: 100%;
    flex-basis: 100%;
  }
`

export const MainArea = styled.div`
  margin: 2rem;
  color: white;
  border-radius: 3px;
  flex-direction: column;
`

export const PTWrapper = styled.div`
  overflow-y: auto;
  overflow: auto;
  ${(props: { notScrollable: boolean }) =>
    props.notScrollable ? 'overflow:hidden;' : ''};
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  position: relative;
  height: calc(100vh - 48px);
  background: ${(props: { background: string }) => props.background};

  ${customAquaScrollBar};
`

interface InterfaceStyledCardHeader extends CardHeaderProps {
  title: string
}

export const StyledCardHeader = styled(CardHeader as React.SFC<
  InterfaceStyledCardHeader
>)`
  margin-bottom: 15px;

  & > div {
    align-self: auto !important;
    margin-top: 0 !important;
    margin-right: 0 !important;
  }
`

export const ContentInner = styled.div`
  ${(props: { loading: boolean }) =>
    props.loading
      ? `
  filter: blur(10px);
  user-select: none;
  pointer-events: none;
  `
      : ``};
`

export const Content = styled.div`
  flex: 0 0 auto;
`

export const LoaderWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    z-index: 1;
  }
`

export const CardContentStyled = styled(CardContent)`
  height: calc(100% - 34px);
`

export const LoaderInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`
