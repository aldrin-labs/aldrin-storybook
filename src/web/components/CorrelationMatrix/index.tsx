import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/styles'
import FullScreen from 'react-fullscreen-crossbrowser'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import FullScreenIcon from '@material-ui/icons/Fullscreen'

import { customAquaScrollBar } from '../cssUtils'
import SelectTimeRange from '../SelectTimeRangeDropdown'
import { CorrelationMatrixTable } from './CorrelationMatrixTable'
import { IProps } from './types'
import { ErrorFallback } from '../ErrorFallback'

@withTheme
class CorrelationMatrixComponent extends PureComponent<IProps> {
  state = {
    isFullscreenEnabled: false,
  }

  renderPlaceholder = () => (
    <StyledCard raised>
      <CardContent>
        <Typography gutterBottom align="center" variant="h2">
          🤔
        </Typography>
        <Typography color="secondary" variant="h5">
          Empty Response...
        </Typography>
      </CardContent>
    </StyledCard>
  )

  changeScreenMode = () => {
    this.setState((prevstate) => ({
      isFullscreenEnabled: !prevstate.isFullscreenEnabled,
    }))
  }

  renderError = (error: string) => <ErrorFallback>{error}</ErrorFallback>

  render() {
    const {
      // isFullscreenEnabled,
      data,
      // fullScreenChangeHandler,
      // setCorrelationPeriod,
      period,
      CustomColors,
      oneColor,
      dates: { startDate, endDate },
      theme: { palette },
      theme,
      updateCorrelationPeriodMutation,
    } = this.props

    const { isFullscreenEnabled } = this.state

    const colors = CustomColors || [
      palette.red.main,
      palette.background.default,
      palette.green.main,
      palette.background.default,
    ]

    return (
      <ScrolledWrapper>
        <FullScreen
          onClose={() => {
            this.changeScreenMode(isFullscreenEnabled)
          }}
          style={{ height: '100%' }}
          enabled={isFullscreenEnabled}
        >
          <FullscreenNode
            style={
              data.values
                ? {
                    display: 'grid',
                    gridTemplateColumns: isFullscreenEnabled
                      ? '1fr'
                      : '15% 70% 15%',
                    gridTemplateRows: '1fr 1fr 1fr 0.2fr',
                    alignItems: 'center',
                  }
                : {
                    display: 'grid',
                    gridTemplateColumns: '20% 1fr 20%',
                    gridTemplateRows: '100%',
                    alignItems: 'center',
                  }
            }
            className="full-screenable-node"
          >
            {isFullscreenEnabled ? null : (
              <ButtonsWrapper id="ButtonsWrapper">
                <Typography noWrap align="center" variant="h6">
                  Time Range
                </Typography>
                <SelectTimeRange
                  style={{
                    height: 'auto',
                    maxWidth: '16rem',
                    margin: '3.2rem 0',
                  }}
                  updateCorrelationPeriodMutation={
                    updateCorrelationPeriodMutation
                  }
                  period={period}
                />
                <Typography noWrap={true} align="center" variant="body1">
                  {startDate}-
                  {endDate}
                </Typography>
              </ButtonsWrapper>
            )}

            {data.error ? (
              this.renderError(data.error)
            ) : data ? (
              <CorrelationMatrixTable
                key="1234124"
                {...{
                  isFullscreenEnabled,
                  data,
                  colors,
                  oneColor,
                  theme,
                }}
              />
            ) : (
              this.renderPlaceholder()
            )}
            {isFullscreenEnabled ? null : (
              <StyledFullscreenButton
                id="FullscreenButton"
                size="large"
                color="primary"
                variant="contained"
                onClick={() => {
                  this.changeScreenMode()
                }}
              >
                <FullScreenIcon />
              </StyledFullscreenButton>
            )}
            {isFullscreenEnabled ? null : (
              <Typography
                noWrap={true}
                align="center"
                variant="body1"
                style={{ gridColumn: '1 / span 3', gridRowStart: 4 }}
              >
                Correlation between returns of your assets
              </Typography>
            )}
          </FullscreenNode>
        </FullScreen>
      </ScrolledWrapper>
    )
  }
}

export default CorrelationMatrixComponent

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-row-start: 2;
`

const StyledFullscreenButton = styled(Button)`
  grid-row-start: 2;
  grid-column-start: 3;

  z-index: 100;

  width: 25%;

  && {
    margin: 0 auto;
  }
`

const FullscreenNode = styled.div`
  height: 100%;
`

const StyledCard = styled(Card)`
  width: 24rem;
  && {
    margin: auto;
  }
`

const ScrolledWrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  margin: 0 auto;
  ${customAquaScrollBar};
`
