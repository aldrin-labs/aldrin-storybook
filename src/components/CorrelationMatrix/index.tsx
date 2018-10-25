import React, { PureComponent } from 'react'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'

import FullScreenIcon from '@material-ui/icons/Fullscreen'

import { customAquaScrollBar } from '../Utils/cssUtils'
import SelectTimeRange from '../SelectTimeRangeDropdown'
import { CorrelationMatrixTable } from './CorrelationMatrixTable'
import { IProps } from './types'
import { formatDate } from '../Utils/dateUtils'
import { ErrorFallback } from '../ErrorFallback'

export class CorrelationMatrix extends PureComponent<IProps> {
  static defaultProps: Partial<IProps> = {
    colors: ['red', 'white', 'green']
  }

  constructor(props: IProps) {
    super(props)
  }

  renderPlaceholder = () => (
    <>
      <StyledCard raised={true}>
        <CardContent>
          <Typography gutterBottom={true} align="center" variant="h2">
            🤔
          </Typography>
          <Typography color="secondary" variant="h5">
            Empty Response...
          </Typography>
        </CardContent>
      </StyledCard>
    </>
  )

  renderError = (error: string) => <ErrorFallback>{error}</ErrorFallback>

  render() {
    const {
      isFullscreenEnabled,
      data,
      fullScreenChangeHandler,
      setCorrelationPeriod,
      period,
      colors,
      oneColor,
      dates: { startDate, endDate },
    } = this.props

    return (
      <ScrolledWrapper>
        <FullScreen
          onClose={() => {
            fullScreenChangeHandler(isFullscreenEnabled)
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
                      : data.values.length < 10
                        ? '20% 1fr 28%'
                        : '30% 1fr 29%',
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
              <ButtonsWrapper>
                <Typography noWrap={true} align="center" variant="h6">
                  Time Range
                </Typography>
                <SelectTimeRange
                  style={{
                    height: 'auto',
                    maxWidth: '10rem',
                    margin: '2rem 0',
                  }}
                  setPeriodToStore={setCorrelationPeriod}
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
                {...{
                  isFullscreenEnabled,
                  data,
                  colors,
                  oneColor
                }}
              />
            ) : (
              this.renderPlaceholder()
            )}
            {isFullscreenEnabled ? null : (
              <StyledFullscreenButton
                color="primary"
                variant="contained"
                onClick={() => {
                  this.props.fullScreenChangeHandler()
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

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledFullscreenButton = styled(Button)`
  z-index: 100;
  color: #fff;
  width: 25%;

  && {
    font-size: 2rem;
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
  max-height: 70vh;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  margin: 0 auto;
  ${customAquaScrollBar};
`
export default CorrelationMatrix
