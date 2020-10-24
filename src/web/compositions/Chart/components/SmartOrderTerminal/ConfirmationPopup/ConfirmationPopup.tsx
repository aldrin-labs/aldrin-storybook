import React from 'react'
import { Grid, Theme } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'

import { SendButton } from '@sb/components/TraidingTerminal/styles'
import { StyledTypography } from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock.styles'

import {
  TypographyCustomHeading,
  DialogWrapper,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import {
  ClearButton,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import { InputRowContainer, TargetTitle, TargetValue } from '../styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { getArrowSymbol } from '@sb/components/AddArrowIcon/AddArrowIcon'
import { DialogContent } from '@sb/styles/Dialog.styles'

import { EntryPointType, StopLossType, TakeProfitType } from '../types'

const EditButton = ({ children, ...props }) => (
  <BtnCustom
    btnWidth={'6rem'}
    padding={'0'}
    borderRadius={'.4rem'}
    backgroundColor={props.theme.palette.blue.main}
    btnColor={props.theme.palette.white.main}
    borderWidth={'.1rem'}
    borderColor={props.theme.palette.blue.main}
    fontWeight={'bold'}
    fontSize={'1.2rem'}
    height={'2.2rem'}
    {...props}
  >
    {children}
  </BtnCustom>
)

const TitleTypography = ({ children, theme, ...props }) => (
  <StyledTypography
    {...props}
    style={{
      fontSize: '1.2rem',
      color: theme.palette.dark.main,
      letterSpacing: '1px',
      ...props.style,
    }}
  >
    {children}
  </StyledTypography>
)

const ItemTypography = ({ children, ...props }) => (
  <StyledTypography
    {...props}
    style={{
      fontSize: '1.2rem',
      padding: '0 0 0.65rem 0',
      letterSpacing: '1px',
      ...props.style,
    }}
  >
    {children}
  </StyledTypography>
)

interface IProps {
  open: boolean
  handleClose: () => void
  confirmTrade: () => void
  handleOpenEditPopup: (popupName: string) => void
  entryPoint: EntryPointType
  stopLoss: StopLossType
  takeProfit: TakeProfitType
  pair: [string, string]
  theme: Theme
}

const getColor = (value: boolean, theme: Theme) =>
  value ? theme.palette.green.main : theme.palette.red.main
const getOnOffText = (value: boolean) => (value ? 'ON' : 'OFF')

export default ({
  open,
  handleClose,
  confirmTrade,
  handleOpenEditPopup,
  entryPoint,
  stopLoss,
  takeProfit,
  pair,
  theme,
}: IProps) => {
  const { order, trailing } = entryPoint

  return (
    <>
      <DialogWrapper
        theme={theme}
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          // paddingTop: 0,
        }}
      >
        <StyledDialogTitle
          theme={theme}
          disableTypography
          id="customized-dialog-title"
        >
          <TypographyCustomHeading
            fontWeight={'700'}
            style={{
              textAlign: 'center',
              fontSize: '1.4rem',
              letterSpacing: '1.5px',
              color: theme.palette.dark.main,
            }}
          >
            Confirm trade
          </TypographyCustomHeading>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <DialogContent
          theme={theme}
          justify="center"
          style={{
            minWidth: '440px',
            padding: '3rem',
          }}
        >
          <Grid>
            <Grid id="entry">
              <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ padding: '1rem 0' }}
              >
                <TitleTypography theme={theme}>Entry point</TitleTypography>
                <EditButton
                  theme={theme}
                  onClick={() => handleOpenEditPopup('entryOrder')}
                >
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 5.5rem' }}>
                <Grid style={{ textAlign: 'right', position: 'relative' }}>
                  <ItemTypography theme={theme}>Side:</ItemTypography>
                  <ItemTypography theme={theme}>price:</ItemTypography>
                  <ItemTypography theme={theme}>amount:</ItemTypography>
                  <ItemTypography
                    theme={theme}
                    style={{ position: 'absolute', bottom: '0' }}
                  >
                    Trailing:
                  </ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem', width: '55%' }}>
                  <ItemTypography
                    theme={theme}
                    color={getColor(order.side === 'buy', theme)}
                  >
                    {order.side}
                  </ItemTypography>
                  <ItemTypography theme={theme} color={theme.palette.dark.main}>
                    {`${
                      entryPoint.order.type === 'limit'
                        ? entryPoint.order.price
                        : entryPoint.trailing.isTrailingOn
                        ? entryPoint.order.price
                        : 'MARKET'
                    } ${pair[1]}`}
                  </ItemTypography>
                  <ItemTypography theme={theme} color={theme.palette.dark.main}>
                    {getArrowSymbol(
                      `${entryPoint.order.amount} ${pair[0]}`,
                      `${entryPoint.order.total} ${pair[1]}`,
                      true
                    )}
                  </ItemTypography>
                  <Grid container justify="space-between" wrap={'nowrap'}>
                    <ItemTypography
                      theme={theme}
                      color={getColor(trailing.isTrailingOn, theme)}
                    >
                      {getOnOffText(trailing.isTrailingOn)}
                    </ItemTypography>
                    {trailing.isTrailingOn && (
                      <>
                        <ItemTypography
                          theme={theme}
                          style={{ padding: '0 .5rem .65rem .5rem' }}
                        >
                          Deviation:
                        </ItemTypography>
                        <ItemTypography
                          theme={theme}
                          color={theme.palette.dark.main}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {trailing.deviationPercentage}%
                        </ItemTypography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid id="hedge">
              <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ padding: '1rem 0' }}
              >
                <Grid
                  container
                  justify="space-between"
                  style={{ width: '18%' }}
                >
                  <TitleTypography theme={theme}>hedge:</TitleTypography>
                  <TitleTypography theme={theme}
                    style={{ color: getColor(entryPoint.order.isHedgeOn) }}
                  >
                    {getOnOffText(entryPoint.order.isHedgeOn)}
                  </TitleTypography>
                </Grid>
                <EditButton theme={theme} onClick={() => handleOpenEditPopup('hedge')}>
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 4.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography theme={theme}>Side:</ItemTypography>
                  <ItemTypography theme={theme}>amount:</ItemTypography>
                  <ItemTypography theme={theme}>leverage:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem', width: '55%' }}>
                  <ItemTypography theme={theme}
                    color={getColor(entryPoint.order.hedgeSide !== 'short')}
                  >
                    {entryPoint.order.hedgeSide}
                  </ItemTypography>
                  <ItemTypography theme={theme} color={theme.palette.dark.main}>
                    {entryPoint.order.hedgePrice}
                  </ItemTypography>
                  <ItemTypography theme={theme} color={theme.palette.dark.main}>
                    X{entryPoint.order.hedgeIncrease}
                  </ItemTypography>
                </Grid>
              </Grid>
            </Grid> */}
            <Grid id="takeaprofit">
              <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ padding: '1rem 0' }}
              >
                <Grid
                  container
                  justify="space-between"
                  style={{ width: '30%' }}
                >
                  <TitleTypography theme={theme}>take profit:</TitleTypography>
                  <TitleTypography
                    theme={theme}
                    style={{
                      color: getColor(takeProfit.isTakeProfitOn, theme),
                    }}
                  >
                    {getOnOffText(takeProfit.isTakeProfitOn)}
                  </TitleTypography>
                </Grid>
                <EditButton
                  theme={theme}
                  onClick={() => handleOpenEditPopup('takeProfit')}
                >
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 0.5rem 1rem 2.8rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  {!takeProfit.trailingTAP.isTrailingOn && (
                    <>
                      <ItemTypography theme={theme}>
                        split target:
                      </ItemTypography>
                      {takeProfit.splitTargets.isSplitTargetsOn && (
                        <ItemTypography
                          theme={theme}
                          style={{
                            paddingBottom: `${takeProfit.splitTargets.targets
                              .length *
                              1.8 +
                              1}rem`,
                          }}
                        >
                          targets
                        </ItemTypography>
                      )}
                    </>
                  )}
                  {!takeProfit.splitTargets.isSplitTargetsOn && (
                    <ItemTypography theme={theme}>trailing:</ItemTypography>
                  )}
                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography theme={theme}>deviation:</ItemTypography>
                    )}
                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    !takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography theme={theme}>price:</ItemTypography>
                    )}
                  {/* <ItemTypography theme={theme}>timeout:</ItemTypography>
                  {takeProfit.timeout.isTimeoutOn && (
                    <>
                      <ItemTypography theme={theme}>when profit:</ItemTypography>
                      <ItemTypography theme={theme}>when in profit:</ItemTypography>
                    </>
                  )} */}
                </Grid>
                <Grid style={{ paddingLeft: '4rem', width: '55%' }}>
                  {!takeProfit.trailingTAP.isTrailingOn && (
                    <ItemTypography
                      theme={theme}
                      color={getColor(
                        takeProfit.splitTargets.isSplitTargetsOn,
                        theme
                      )}
                    >
                      {getOnOffText(takeProfit.splitTargets.isSplitTargetsOn)}
                    </ItemTypography>
                  )}

                  {takeProfit.splitTargets.isSplitTargetsOn &&
                    !takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography theme={theme}>
                        <InputRowContainer padding=".2rem .5rem">
                          <TargetTitle theme={theme} style={{ width: '50%' }}>
                            price
                          </TargetTitle>
                          <TargetTitle theme={theme} style={{ width: '50%' }}>
                            quantity
                          </TargetTitle>
                        </InputRowContainer>
                        <div
                          style={{
                            width: '100%',
                          }}
                        >
                          {takeProfit.splitTargets.targets.map((target, i) => (
                            <InputRowContainer
                              key={`${target.price}${target.quantity}${i}`}
                              padding=".2rem .5rem"
                              style={{ borderBottom: '.1rem solid #e0e5ec' }}
                            >
                              <TargetValue
                                theme={theme}
                                style={{
                                  width: '50%',
                                  color: getColor(true, theme),
                                }}
                              >
                                +{target.price}%
                              </TargetValue>
                              <TargetValue
                                theme={theme}
                                style={{ width: '50%' }}
                              >
                                {target.quantity}%
                              </TargetValue>
                            </InputRowContainer>
                          ))}
                        </div>
                      </ItemTypography>
                    )}
                  {!takeProfit.splitTargets.isSplitTargetsOn && (
                    <ItemTypography
                      theme={theme}
                      color={getColor(
                        takeProfit.trailingTAP.isTrailingOn,
                        theme
                      )}
                    >
                      {getOnOffText(takeProfit.trailingTAP.isTrailingOn)}
                    </ItemTypography>
                  )}

                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography
                        theme={theme}
                        color={theme.palette.dark.main}
                      >
                        {takeProfit.trailingTAP.deviationPercentage} %
                      </ItemTypography>
                    )}

                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    !takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography
                        theme={theme}
                        color={getColor(true, theme)}
                      >
                        {takeProfit.pricePercentage} %
                      </ItemTypography>
                    )}

                  {/* <ItemTypography theme={theme}
                    color={getColor(takeProfit.timeout.isTimeoutOn)}
                  >
                    {getOnOffText(takeProfit.timeout.isTimeoutOn)}
                  </ItemTypography>

                  {takeProfit.timeout.isTimeoutOn && (
                    <>
                      <ItemTypography theme={theme} color={theme.palette.dark.main}>
                        {`${takeProfit.timeout.whenProfitSec} ${
                          takeProfit.timeout.whenProfitMode
                        }`}
                      </ItemTypography>
                      <ItemTypography theme={theme} color={theme.palette.dark.main}>
                        {`${takeProfit.timeout.whenProfitableSec} ${
                          takeProfit.timeout.whenProfitableMode
                        }`}
                      </ItemTypography>
                    </>
                  )} */}
                </Grid>
              </Grid>
            </Grid>
            <Grid id="stoploss">
              <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ padding: '1rem 0' }}
              >
                <Grid
                  container
                  justify="space-between"
                  style={{ width: '25%' }}
                >
                  <TitleTypography theme={theme}>stop loss:</TitleTypography>
                  <TitleTypography
                    theme={theme}
                    style={{ color: getColor(stopLoss.isStopLossOn, theme) }}
                  >
                    {getOnOffText(stopLoss.isStopLossOn)}
                  </TitleTypography>
                </Grid>
                <EditButton
                  theme={theme}
                  onClick={() => handleOpenEditPopup('stopLoss')}
                >
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 1.6rem 3rem 1.6rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography theme={theme}>price:</ItemTypography>
                  <ItemTypography theme={theme}>timeout:</ItemTypography>
                  {stopLoss.timeout.isTimeoutOn && (
                    <>
                      {/* <ItemTypography theme={theme}>when loss:</ItemTypography> */}
                      <ItemTypography theme={theme}>
                        when in loss:
                      </ItemTypography>{' '}
                    </>
                  )}
                  <ItemTypography theme={theme}>forced stop:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '5rem' }}>
                  <ItemTypography theme={theme} color={getColor(false, theme)}>
                    -{stopLoss.pricePercentage}%
                  </ItemTypography>
                  <ItemTypography
                    theme={theme}
                    color={getColor(stopLoss.timeout.isTimeoutOn, theme)}
                  >
                    {getOnOffText(stopLoss.timeout.isTimeoutOn)}
                  </ItemTypography>
                  {stopLoss.timeout.isTimeoutOn && (
                    <>
                      {/* <ItemTypography theme={theme} color={theme.palette.dark.main}>
                        {`${stopLoss.timeout.whenLossSec} ${
                          stopLoss.timeout.whenLossMode
                        }`}
                      </ItemTypography> */}
                      <ItemTypography
                        theme={theme}
                        color={theme.palette.dark.main}
                      >
                        {`${stopLoss.timeout.whenLossableSec} ${
                          stopLoss.timeout.whenLossableMode
                        }`}
                      </ItemTypography>
                    </>
                  )}
                  <ItemTypography
                    theme={theme}
                    color={getColor(stopLoss.forcedStop.isForcedStopOn, theme)}
                  >
                    {`${getOnOffText(stopLoss.forcedStop.isForcedStopOn)} / ${
                      stopLoss.forcedStop.pricePercentage
                    }%`}
                  </ItemTypography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              justify="center"
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                width: 'calc(100% - 6rem)',
              }}
            >
              <SendButton
                theme={theme}
                type={'buy'}
                onClick={() => confirmTrade()}
              >
                confirm
              </SendButton>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}
