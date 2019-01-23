import { Grid, Card } from '@material-ui/core'
import styled from 'styled-components'
import { customAquaScrollBar } from '@storybook/styles/cssUtils'
import { CSS_CONFIG } from '@storybook/config/cssConfig'
import { CardProps } from '@material-ui/core/Card'
import { GridProps } from '@material-ui/core/Grid'

export const Container = styled(Grid as React.FunctionComponent<GridProps>)`
  && {
    overflow-y: auto;
    height: calc(100vh - ${CSS_CONFIG.navBarHeight}px);

    margin: 0;
    width: 100%;
  }
`

export const Wrapper = styled(Card as React.FunctionComponent<CardProps>)`
  max-height: 100%;
  display: flex;
  width: 100%;

  flex-direction: column;
  overflow-x: auto;
  ${customAquaScrollBar};
`

export const ChartWrapper = styled(Wrapper)`
  max-height: 100%;
  height: 100%;
`
