import React, { Component } from 'react'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import FullScreenIcon from '@material-ui/icons/Fullscreen'

import { customAquaScrollBar } from '../cssUtils'
import SelectTimeRange from '../SelectTimeRangeDropdown'
import { CorrelationMatrixTable } from './CorrelationMatrixTable'
import { IProps, IState } from './types'
import { formatDate } from '../Utils/dateUtils'
import { ErrorFallback } from '../ErrorFallback'

class CorrelationMatrixComponent extends Component<IProps, IState> {

  state: IState = {
    isFullscreenEnabled: false,
  }

  fullScreenChangeHandler = () => {
    this.setState((state) => ({ isFullscreenEnabled: !state.isFullscreenEnabled }))
  }

  setPeriodToStore = (data: {
    correlationPeriod: string,
    correlationStartDate: number,
    correlationEndDate: number
  }) => setCorrelationPeriod(
    data.correlationStartDate,
    data.correlationEndDate,
    data.correlationPeriod
    )

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

  renderError = (error: string) => <ErrorFallback>{error}</ErrorFallback>

  render() {
    const {
      data,
      setCorrelationPeriod,
      period,
      CustomColors,
      oneColor,
      dates: { startDate, endDate },
      theme: { palette },
      theme,
    } = this.props

    const { isFullscreenEnabled } = this.state

    const colors = CustomColors || [
      palette.red.main,
      palette.background.default,
      palette.green.main,
      palette.background.default,
    ]

    console.log(this.state)
    console.log(isFullscreenEnabled)

    return (
      <ScrolledWrapper>
        <FullScreen
          onClose={() => {
            this.fullScreenChangeHandler()
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
                    gridTemplateRows: '100%',
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
                    maxWidth: '10rem',
                    margin: '2rem 0',
                  }}
                  setPeriodToStore={this.setPeriodToStore}
                  period={period}
                />
                <Typography noWrap={true} align="center" variant="body1">
                  {formatDate(startDate, 'MM/DD/YYYY')}–
                  {formatDate(endDate, 'MM/DD/YYYY')}
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
                  this.fullScreenChangeHandler()
                }}
              >
                <FullScreenIcon />
              </StyledFullscreenButton>
            )}
          </FullscreenNode>
        </FullScreen>
      </ScrolledWrapper>
    )
  }
}

export const CorrelationMatrix = CorrelationMatrixComponent

export default CorrelationMatrix

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledFullscreenButton = styled(Button)`
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
  width: 15rem;
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
