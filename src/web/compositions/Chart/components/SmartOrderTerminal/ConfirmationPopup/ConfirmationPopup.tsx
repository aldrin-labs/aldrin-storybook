import React from 'react'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'

import { StyledTypography } from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock.styles'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { getArrowSymbol } from '@sb/components/AddArrowIcon/AddArrowIcon'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

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
  editEntryPointHandle: () => void
  handleOpenEditPopup: (popupName: string) => void
}

const getColor = (value: boolean) => (value ? '#29AC80' : '#DD6956')
const getOnOffText = (value: boolean) => (value ? 'ON' : 'OFF')

export default ({
  open,
  handleClose,
  confirmTrade,
  editEntryPointHandle,
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
        open={true}
        style={{
          borderRadius: '50%',
          // paddingTop: 0,
        }}
      >
        <DialogTitleCustom
          id="customized-dialog-title"
          //   style={{
          // backgroundColor: '#fff',
          //   }}
        >
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
        </DialogTitleCustom>
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
                <EditButton>edit</EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 5.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>Side:</ItemTypography>
                  <ItemTypography>price:</ItemTypography>
                  <ItemTypography>amount:</ItemTypography>
                  <ItemTypography>Trailing:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem', width: '57%' }}>
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
                  <Grid container justify="space-between">
                    <ItemTypography color={getColor(trailing.isTrailingOn)}>
                      {getOnOffText(trailing.isTrailingOn)}
                    </ItemTypography>
                    <ItemTypography>Deviation:</ItemTypography>
                    <ItemTypography color="#16253D">
                      {trailing.deviationPercentage} %
                    </ItemTypography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid id="hedge">
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
                <EditButton>edit</EditButton>
              </Grid>
              <Grid container style={{ padding: '1rem 4.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>Side:</ItemTypography>
                  <ItemTypography>amount:</ItemTypography>
                  <ItemTypography>leverage:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem' }}>
                  <ItemTypography
                    color={getColor(entryPoint.order.hedgeSide !== 'short')}
                  >
                    {entryPoint.order.hedgeSide}
                  </ItemTypography>
                  <ItemTypography color="#16253D">{`-`}</ItemTypography>
                  <ItemTypography color="#16253D">
                    X{entryPoint.order.leverage}
                  </ItemTypography>
                </Grid>
              </Grid>
            </Grid>
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
              <Grid container style={{ padding: '1rem 0.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>split target:</ItemTypography>
                  <ItemTypography>Trailing:</ItemTypography>
                  <ItemTypography>timeout:</ItemTypography>
                  <ItemTypography>deviation:</ItemTypography>
                  <ItemTypography>when profit:</ItemTypography>
                  <ItemTypography>when in profit:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem' }}>
                  <ItemTypography
                    color={getColor(takeProfit.splitTargets.isSplitTargetsOn)}
                  >
                    {getOnOffText(takeProfit.splitTargets.isSplitTargetsOn)}
                  </ItemTypography>
                  <ItemTypography
                    color={getColor(takeProfit.trailingTAP.isTrailingOn)}
                  >
                    {getOnOffText(takeProfit.trailingTAP.isTrailingOn)}
                  </ItemTypography>
                  <ItemTypography
                    color={getColor(takeProfit.timeout.isTimeoutOn)}
                  >
                    {getOnOffText(takeProfit.timeout.isTimeoutOn)}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {takeProfit.trailingTAP.deviationPercentage} %
                  </ItemTypography>
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
              <Grid container style={{ padding: '1rem 1.6rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>price:</ItemTypography>
                  <ItemTypography>timeout:</ItemTypography>
                  <ItemTypography>when loss:</ItemTypography>
                  <ItemTypography>when in loss:</ItemTypography>
                  <ItemTypography>forced stop:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem' }}>
                  <ItemTypography
                    color={getColor(stopLoss.pricePercentage >= 0)}
                  >
                    {stopLoss.pricePercentage} %
                  </ItemTypography>
                  <ItemTypography
                    color={getColor(stopLoss.timeout.isTimeoutOn)}
                  >
                    {getOnOffText(stopLoss.timeout.isTimeoutOn)}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {`${stopLoss.timeout.whenLossSec} ${
                      stopLoss.timeout.whenLossMode
                    }`}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {`${stopLoss.timeout.whenLossableSec} ${
                      stopLoss.timeout.whenLossableMode
                    }`}
                  </ItemTypography>
                  <ItemTypography
                    color={getColor(stopLoss.forcedStop.isForcedStopOn)}
                  >
                    {getOnOffText(stopLoss.forcedStop.isForcedStopOn)}
                  </ItemTypography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <BtnCustom
                btnWidth={'100%'}
                borderRadius={'8px'}
                backgroundColor={'#29AC80'}
                btnColor={'#fff'}
                borderWidth={'0px'}
                fontWeight={'bold'}
                fontSize={'1.6rem'}
                height={'4rem'}
                onClick={() => confirmTrade()}
              >
                Confirm
              </BtnCustom>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}
