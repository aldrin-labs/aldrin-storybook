import React from 'react'
import { Grid } from '@material-ui/core'
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
    borderRadius={'8px'}
    backgroundColor={'#5C8CEA'}
    btnColor={'#fff'}
    borderWidth={'2px'}
    borderColor={'#0B1FD1'}
    fontWeight={'bold'}
    fontSize={'1.2rem'}
    height={'2.2rem'}
    {...props}
  >
    {children}
  </BtnCustom>
)

const TitleTypography = ({ children, ...props }) => (
  <StyledTypography
    {...props}
    style={{
      fontSize: '1.2rem',
      color: '#16253D',
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
}

const getColor = (value: boolean) => (value ? '#29AC80' : '#DD6956')
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
}: IProps) => {
  const { order, trailing } = entryPoint

  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          // paddingTop: 0,
        }}
      >
        <StyledDialogTitle disableTypography id="customized-dialog-title">
          <TypographyCustomHeading
            fontWeight={'700'}
            style={{
              textAlign: 'center',
              fontSize: '1.4rem',
              letterSpacing: '1.5px',
              color: '#16253D',
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
                <TitleTypography>Entry point</TitleTypography>
                <EditButton onClick={() => handleOpenEditPopup('entryOrder')}>
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 5.5rem' }}>
                <Grid style={{ textAlign: 'right', position: 'relative' }}>
                  <ItemTypography>Side:</ItemTypography>
                  <ItemTypography>price:</ItemTypography>
                  <ItemTypography>amount:</ItemTypography>
                  <ItemTypography style={{ position: 'absolute', bottom: '0' }}>
                    Trailing:
                  </ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem', width: '55%' }}>
                  <ItemTypography color={getColor(order.side === 'buy')}>
                    {order.side}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {`${
                      entryPoint.order.type === 'limit'
                        ? entryPoint.order.price
                        : entryPoint.trailing.isTrailingOn
                        ? entryPoint.order.price
                        : 'MARKET'
                    } ${pair[1]}`}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {getArrowSymbol(
                      `${entryPoint.order.amount} ${pair[0]}`,
                      `${entryPoint.order.total} ${pair[1]}`,
                      true
                    )}
                  </ItemTypography>
                  <Grid container justify="space-between" wrap={'nowrap'}>
                    <ItemTypography color={getColor(trailing.isTrailingOn)}>
                      {getOnOffText(trailing.isTrailingOn)}
                    </ItemTypography>
                    {trailing.isTrailingOn && (
                      <>
                        <ItemTypography
                          style={{ padding: '0 .5rem .65rem .5rem' }}
                        >
                          Deviation:
                        </ItemTypography>
                        <ItemTypography
                          color="#16253D"
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
                  <TitleTypography>hedge:</TitleTypography>
                  <TitleTypography
                    style={{ color: getColor(entryPoint.order.isHedgeOn) }}
                  >
                    {getOnOffText(entryPoint.order.isHedgeOn)}
                  </TitleTypography>
                </Grid>
                <EditButton onClick={() => handleOpenEditPopup('hedge')}>
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 4.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>Side:</ItemTypography>
                  <ItemTypography>amount:</ItemTypography>
                  <ItemTypography>leverage:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem', width: '55%' }}>
                  <ItemTypography
                    color={getColor(entryPoint.order.hedgeSide !== 'short')}
                  >
                    {entryPoint.order.hedgeSide}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {entryPoint.order.hedgePrice}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
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
                  <TitleTypography>take a profit:</TitleTypography>
                  <TitleTypography
                    style={{ color: getColor(takeProfit.isTakeProfitOn) }}
                  >
                    {getOnOffText(takeProfit.isTakeProfitOn)}
                  </TitleTypography>
                </Grid>
                <EditButton onClick={() => handleOpenEditPopup('takeProfit')}>
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 0.5rem 1rem 2.8rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  {!takeProfit.trailingTAP.isTrailingOn && (
                    <>
                      <ItemTypography>split target:</ItemTypography>
                      {takeProfit.splitTargets.isSplitTargetsOn && (
                        <ItemTypography
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
                    <ItemTypography>trailing:</ItemTypography>
                  )}
                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography>deviation:</ItemTypography>
                    )}
                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    !takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography>price:</ItemTypography>
                    )}
                  {/* <ItemTypography>timeout:</ItemTypography>
                  {takeProfit.timeout.isTimeoutOn && (
                    <>
                      <ItemTypography>when profit:</ItemTypography>
                      <ItemTypography>when in profit:</ItemTypography>
                    </>
                  )} */}
                </Grid>
                <Grid style={{ paddingLeft: '4rem', width: '55%' }}>
                  {!takeProfit.trailingTAP.isTrailingOn && (
                    <ItemTypography
                      color={getColor(takeProfit.splitTargets.isSplitTargetsOn)}
                    >
                      {getOnOffText(takeProfit.splitTargets.isSplitTargetsOn)}
                    </ItemTypography>
                  )}

                  {takeProfit.splitTargets.isSplitTargetsOn &&
                    !takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography>
                        <InputRowContainer padding=".2rem .5rem">
                          <TargetTitle style={{ width: '50%' }}>
                            price
                          </TargetTitle>
                          <TargetTitle style={{ width: '50%' }}>
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
                                style={{ width: '50%', color: getColor(true) }}
                              >
                                +{target.price}%
                              </TargetValue>
                              <TargetValue style={{ width: '50%' }}>
                                {target.quantity}%
                              </TargetValue>
                            </InputRowContainer>
                          ))}
                        </div>
                      </ItemTypography>
                    )}
                  {!takeProfit.splitTargets.isSplitTargetsOn && (
                    <ItemTypography
                      color={getColor(takeProfit.trailingTAP.isTrailingOn)}
                    >
                      {getOnOffText(takeProfit.trailingTAP.isTrailingOn)}
                    </ItemTypography>
                  )}

                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography color="#16253D">
                        {takeProfit.trailingTAP.deviationPercentage} %
                      </ItemTypography>
                    )}

                  {!takeProfit.splitTargets.isSplitTargetsOn &&
                    !takeProfit.trailingTAP.isTrailingOn && (
                      <ItemTypography color={getColor(true)}>
                        {takeProfit.pricePercentage} %
                      </ItemTypography>
                    )}

                  {/* <ItemTypography
                    color={getColor(takeProfit.timeout.isTimeoutOn)}
                  >
                    {getOnOffText(takeProfit.timeout.isTimeoutOn)}
                  </ItemTypography>

                  {takeProfit.timeout.isTimeoutOn && (
                    <>
                      <ItemTypography color="#16253D">
                        {`${takeProfit.timeout.whenProfitSec} ${
                          takeProfit.timeout.whenProfitMode
                        }`}
                      </ItemTypography>
                      <ItemTypography color="#16253D">
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
                  <TitleTypography>stop loss:</TitleTypography>
                  <TitleTypography
                    style={{ color: getColor(stopLoss.isStopLossOn) }}
                  >
                    {getOnOffText(stopLoss.isStopLossOn)}
                  </TitleTypography>
                </Grid>
                <EditButton onClick={() => handleOpenEditPopup('stopLoss')}>
                  edit
                </EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 1.6rem 3rem 1.6rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>price:</ItemTypography>
                  <ItemTypography>timeout:</ItemTypography>
                  {stopLoss.timeout.isTimeoutOn && (
                    <>
                      {/* <ItemTypography>when loss:</ItemTypography> */}
                      <ItemTypography>when in loss:</ItemTypography>{' '}
                    </>
                  )}
                  {/* <ItemTypography>forced stop:</ItemTypography> */}
                </Grid>
                <Grid style={{ paddingLeft: '5rem' }}>
                  <ItemTypography color={getColor(false)}>
                    -{stopLoss.pricePercentage}%
                  </ItemTypography>
                  <ItemTypography
                    color={getColor(stopLoss.timeout.isTimeoutOn)}
                  >
                    {getOnOffText(stopLoss.timeout.isTimeoutOn)}
                  </ItemTypography>
                  {stopLoss.timeout.isTimeoutOn && (
                    <>
                      {/* <ItemTypography color="#16253D">
                        {`${stopLoss.timeout.whenLossSec} ${
                          stopLoss.timeout.whenLossMode
                        }`}
                      </ItemTypography> */}
                      <ItemTypography color="#16253D">
                        {`${stopLoss.timeout.whenLossableSec} ${
                          stopLoss.timeout.whenLossableMode
                        }`}
                      </ItemTypography>
                    </>
                  )}
                  {/* <ItemTypography
                    color={getColor(stopLoss.forcedStop.isForcedStopOn)}
                  >
                    {getOnOffText(stopLoss.forcedStop.isForcedStopOn)}
                  </ItemTypography> */}
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
              <SendButton type={'buy'} onClick={() => confirmTrade()}>
                confirm
              </SendButton>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}
