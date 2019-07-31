import React, { Component } from 'react'
import { Grid, Input, withWidth } from '@material-ui/core'
import {
  GridFlex,
  GridInfoPanelWrapper,
  StyledTypography,
  StyledSubTypography,
  TypographyRebalance,
  ReactSelectCustom,
} from './RebalanceInfoPanel.styles'
import { withTheme } from '@material-ui/styles'
import Timer, { useTimer } from 'react-compound-timer'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps, IState } from './RebalanceInfoPanel.types'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import { rebalanceSelectTimeOptions } from './RebalanceInfoPanel.config'

import { slicePrice } from '../Utils/MoneyUtils/prepareMoneyViewForInfoPanel'

@withTheme()
class RebalanceInfoPanel extends Component<IProps, IState> {
  state: IState = {
    isHiddenRebalanceDaysInput: 'hidden',
  }

  timerRef = React.createRef()

  componentDidUpdate(prevProps) {
    // update timer
    if (
      this.props.rebalanceTimePeriod.value !==
      prevProps.rebalanceTimePeriod.value
    ) {
      this.timerRef.current.setTime(this.props.rebalanceTimePeriod.value)
      if (
        prevProps.rebalanceTimePeriod.value === 0 ||
        prevProps.rebalanceTimePeriod.value === -1
      ) {
        this.timerRef.current.start()
      }
    }
  }

  render() {
    let {
      rebalanceInfoPanelData: {
        accountValue,
        availableValue,
        availablePercentage,
      },
      toggleSectionCoinChart,
      isSectionChart,
      theme: {
        palette: { blue, red, green, grey },
      },
      rebalanceTimePeriod,
      onRebalanceTimerChange,
      width,
    } = this.props

    const showEveryTimeInput =
      rebalanceTimePeriod && rebalanceTimePeriod.label === 'Every'

    return (
      <GridInfoPanelWrapper
        borderColor={theme.palette.grey[theme.palette.type]}
        bgColor={theme.palette.background.default}
        container
        justify="space-between"
      >
        {/* Grid - 1st item md - 6 Starts */}
        <Grid item md={5} lg={5}>
          <Grid container>
            <Grid container justify="space-between">
              <Grid item lg={4} md={3} justify="center">
                <StyledTypography fontWeight={'700'}>
                  Binance trade account
                </StyledTypography>
                <StyledSubTypography fontWeight={'700'} color={blue.light}>
                  {'$'}
                  {roundAndFormatNumber(+accountValue, 2, false)}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={3} md={4} style={{ paddingRight: '17px' }}>
                <StyledTypography fontWeight={'700'} position="right">
                  Available value
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'700'}
                  color={green.custom}
                  position="right"
                >
                  $ {availableValue !== '0' ? slicePrice(availableValue) : `0`}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={4} md={4}>
                <StyledTypography fontWeight={'700'} position="right">
                  Available percentage
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'700'}
                  color={green.custom}
                  position="right"
                >
                  {slicePrice(availablePercentage)}%
                </StyledSubTypography>
              </Grid>
            </Grid>
            {/* Grid - container justify center end*/}
          </Grid>
          {/* Grid - container end*/}
        </Grid>{' '}
        {/* Grid - 1st item md = 6 end */}
        {/* <Grid item md={0} lg={2}></Grid>
          Space */}
        {/* Grid - 2nd item md - 6 Starts */}
        <Grid item md={5} lg={5}>
          <Grid container>
            <Grid container justify="space-between">
              <GridFlex justify="flex-start" alignItems="center" item lg={3}>
                <BtnCustom
                  borderRadius={'10px'}
                  btnColor={blue.custom}
                  btnWidth="118px"
                  // height="24px"
                  size={width === 'xl' ? 'large' : ''}
                  onClick={toggleSectionCoinChart}
                >
                  {isSectionChart ? `coin chart` : `section chart`}
                </BtnCustom>
              </GridFlex>

              <GridFlex
                item
                lg={6}
                justify="center"
                alignItems="center"
                style={{ paddingRight: '17px' }}
              >
                <TypographyRebalance href={'#'} linkColor={grey.dark}>
                  rebalance
                </TypographyRebalance>

                <ReactSelectCustom
                  value={[rebalanceTimePeriod]}
                  onChange={(
                    optionSelected: {
                      label: string
                      value: string
                    } | null
                  ) => onRebalanceTimerChange(optionSelected)}
                  isSearchable={false}
                  options={rebalanceSelectTimeOptions}
                  singleValueStyles={{
                    color: '#165BE0',
                    fontSize: `1.1rem`,
                    padding: '0',
                  }}
                  indicatorSeparatorStyles={{}}
                  controlStyles={{
                    background: 'transparent',
                    border: 'none',
                    width: 100,
                  }}
                  menuStyles={{
                    width: 140,
                    padding: '5px 8px',
                    borderRadius: '14px',
                    textAlign: 'center',
                  }}
                  optionStyles={{
                    color: '#7284A0',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: `1.1rem`,
                    '&:hover': {
                      borderRadius: '14px',
                      color: '#16253D',
                      background: '#E7ECF3',
                    },
                    '&:last-child': {
                      borderTop: '1px solid #E7ECF3',
                      color: '#D93B28',
                    },
                  }}
                />
                {showEveryTimeInput && (
                  <Input
                    style={{ width: '65px' }}
                    placeholder="days"
                    type="number"
                    onChange={(event) =>
                      onRebalanceTimerChange({
                        label: 'Every',
                        value:
                          (event.target.value &&
                            event.target.value * 86400000) ||
                          0,
                      })
                    }
                  />
                )}
              </GridFlex>

              <Grid item lg={3}>
                <StyledTypography fontWeight={'700'} position="right">
                  Next Rebalance in
                </StyledTypography>
                <StyledSubTypography
                  fontSize={'1.152rem'}
                  color={red.bright}
                  fontWeight={'700'}
                  position="right"
                >
                  <Timer
                    ref={this.timerRef}
                    initialTime={+rebalanceTimePeriod.value}
                    direction="backward"
                    startImmediately={true}
                  >
                    {() => (
                      <React.Fragment>
                        <Timer.Days />
                        {' D '}
                        <Timer.Hours />
                        {' H '}
                        <Timer.Minutes />
                        {' M '}
                        <Timer.Seconds />
                        {' S '}
                      </React.Fragment>
                    )}
                  </Timer>
                  {/*<TimerOnHooks />*/}
                </StyledSubTypography>
              </Grid>
            </Grid>
            {/* Grid - container justify center end*/}
          </Grid>
          {/* Grid - container end*/}
        </Grid>{' '}
        {/* Grid - 2nd item md = 6 end */}
      </GridInfoPanelWrapper>
      // Grid - main container
    )
  }
}

export default withWidth()(RebalanceInfoPanel)
