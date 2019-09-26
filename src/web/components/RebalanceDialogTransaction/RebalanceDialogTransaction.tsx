import React from 'react'
// import { withStyles } from '@material-ui/core/styles'
// import MuiDialogContent from '@material-ui/core/DialogContent'
// import Timer from 'react-compound-timer'

import CircularProgressbar from '@sb/components/ProgressBar/CircularProgressBar'

import { withTheme } from '@material-ui/styles'
import { Dialog } from '@material-ui/core'

import SvgIcon from '@sb/components/SvgIcon'
import Stroke from '@icons/Stroke.svg'
import Ellipse from '@icons/RainbowGo.svg'

import {
  TypographyCustomHeading,
  GridCustom,
  LinkCustom,
  DialogContent,
  DialogTitleCustom,
  TypographyTopDescription,
  StyledPaper,
  RebalanceDialogTypography,
} from './RebalanceDialogTransaction.styles'

import RebalanceSlippageSlider from '@sb/components/RebalanceSlippageSlider'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccordionTable from './AccordionTable'

import * as UTILS from './utils'
import { IProps, IState } from './RebalanceDialogTransaction.types'

@withTheme()
class RebalanceDialogTransaction extends React.Component<IProps, IState> {
  state: IState = {
    isFinished: false,
    isError: false,
    isDisableBtns: false,
    showLoader: false,
    hideDialogButton: false,
    showTransactionTable: true,
  }

  getErrorForTransaction = (errorState: boolean) => {
    const { setErrorStatus, enableShowRetryButton } = this.props

    setErrorStatus(true)
    enableShowRetryButton()
    this.setState({ isError: errorState, showLoader: false, isFinished: false })
  }

  isCompletedTransaction = () => {
    this.setState({ isFinished: true, showLoader: false })
  }

  cancelRebalance = async () => {
    const {
      toggleCancelRebalance,
      cancelOrder,
      setTransactions,
      setErrorStatus,
      updateProgress,
      hideLeavePopup,
      handleClose,
    } = this.props

    await toggleCancelRebalance(true)
    await cancelOrder()
    await setTransactions()
    await this.defaultStateForTransaction(handleClose)
    await setErrorStatus(false)
    await updateProgress(100)
    await hideLeavePopup()
  }

  activateGoBtn = async () => {
    const { setErrorStatus, executeRebalanceHandler } = this.props

    await this.setState({
      isFinished: false,
      isError: false,
      isDisableBtns: true,
      showLoader: true,
      hideDialogButton: true,
      showTransactionTable: true,
    })

    await setErrorStatus(false)
    await executeRebalanceHandler()
  }

  retryRebalance = async () => {
    const { handleClickOpen } = this.props

    // to restart rebalance we need to unmount transactions table ( progress bar )
    // so here i do it before activate rebalance
    await handleClickOpen()
    await this.setState({ showTransactionTable: false })
    await this.activateGoBtn()
  }

  defaultStateForTransaction = (handleClickOpen) => {
    this.setState(
      {
        isFinished: false,
        isError: false,
        isDisableBtns: false,
        showLoader: false,
        showTransactionTable: false,
      },
      () => this.setState({ showTransactionTable: true })
    )

    handleClickOpen()
  }

  handleRainbowGoButton = async () => {
    const {
      handleClickOpen,
      setErrorStatus,
      toggleCancelRebalance,
    } = this.props

    await this.defaultStateForTransaction(handleClickOpen)
    await setErrorStatus(false)
    await toggleCancelRebalance(false)
  }

  render() {
    let {
      accordionTitle,
      transactionsData,
      theme: {
        palette: { blue, black },
        spacing: { unit },
      },
      open,
      slippageValue,
      onChangeSlippage,
      handleClose,
      onNewSnapshot,
      progress,
      rebalanceInfoPanelData,
      openDialog,
      rebalanceError,
      cancelOrder,
      showRetryButton,
      rebalanceIsCanceled,
    } = this.props

    const {
      isFinished,
      isError,
      isDisableBtns,
      showLoader,
      showTransactionTable,
    } = this.state

    const isEmptyTable = transactionsData.length === 0
    const isChangedSliderAfterRebalanceError =
      !showRetryButton && rebalanceError

    const availablePercentage = Math.ceil(
      100 - rebalanceInfoPanelData.availablePercentage
    )

    const whatElementToShow = UTILS.decideElementToShow({
      rebalanceError,
      showRetryButton,
      rebalanceIsCanceled,
      availablePercentage,
    })

    const elementToShow =
      whatElementToShow === 'retry' ? (
        <LinkCustom background={Stroke} onClick={this.retryRebalance}>
          <CircularProgressbar value={100} text={`RETRY`} />
        </LinkCustom>
      ) : whatElementToShow === 'goButton' ? (
        <LinkCustom
          style={{ position: 'relative', bottom: '.5rem' }}
          background={Stroke}
          onClick={this.handleRainbowGoButton}
        >
          <SvgIcon width={'9rem'} height={'9rem'} src={Ellipse} />
        </LinkCustom>
      ) : (
        <CircularProgressbar
          value={availablePercentage}
          text={`${availablePercentage > 100 ? 100 : availablePercentage}%`}
        />
      )

    return (
      <div style={{ textAlign: 'center' }}>
        {progress === null || rebalanceError ? elementToShow : null}

        {progress !== null &&
        (rebalanceError ? !isChangedSliderAfterRebalanceError : true) ? (
          <RebalanceDialogTypography
            onClick={() => {
              openDialog()
            }}
          >
            See detailed status
          </RebalanceDialogTypography>
        ) : null}

        <Dialog
          PaperComponent={StyledPaper}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={true}
          style={{
            opacity: open ? '1' : '0',
            visibility: open ? 'visible' : 'hidden',
            transition: '.3s all ',
          }}
        >
          <DialogTitleCustom id="customized-dialog-title" onClose={handleClose}>
            <TypographyCustomHeading
              fontWeight={'bold'}
              borderRadius={'1rem'}
              color={black.custom}
            >
              {isError
                ? `rebalance unsuccessful`
                : isFinished
                ? `REBALANCE SUCCESSFULL`
                : `ARE YOU SURE?`}
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent
            justify="center"
            style={{ borderRadius: '20px' }}
            unit={unit}
          >
            {isError ? (
              <>
                <GridCustom container>
                  <TypographyTopDescription margin="-10px 0 0 0">
                    You can cancel the unexecuted orders <br />
                    or reset slippage and re-execute the remaining orders.
                  </TypographyTopDescription>
                </GridCustom>
                <GridCustom container justify="center">
                  <RebalanceSlippageSlider
                    disabled={false}
                    slippageValue={slippageValue}
                    onChangeSlippage={onChangeSlippage}
                  />
                </GridCustom>
                <GridCustom container justify="center">
                  <BtnCustom
                    height="3.4rem"
                    borderRadius={'1rem'}
                    btnWidth="10rem"
                    color={'#DD6956'}
                    margin="0 .5rem"
                    onClick={() => {
                      onNewSnapshot()
                      handleClose()
                    }}
                  >
                    Cancel
                  </BtnCustom>
                  <BtnCustom
                    height="3.4rem"
                    borderRadius={'1rem'}
                    btnWidth="10rem"
                    btnColor={'#fff'}
                    backgroundColor={'#165be0'}
                    borderColor={'#165be0'}
                    margin="0 .5rem"
                    onClick={this.retryRebalance}
                  >
                    Retry
                  </BtnCustom>
                </GridCustom>
              </>
            ) : isFinished ? (
              <>
                <GridCustom container>
                  <TypographyTopDescription margin="-12px 0 2.5rem 0">
                    Next rebalance will be at the time that you selected.
                    {/*<span style={{ color: `${blue.custom}` }}>*/}
                    {/*<Timer*/}
                    {/*initialTime={initialTime}*/}
                    {/*direction="backward"*/}
                    {/*startImmediately={true}*/}
                    {/*>*/}
                    {/*{() => (*/}
                    {/*<React.Fragment>*/}
                    {/*<Timer.Hours />:*/}
                    {/*<Timer.Minutes />:*/}
                    {/*<Timer.Seconds />*/}
                    {/*</React.Fragment>*/}
                    {/*)}*/}
                    {/*</Timer>*/}
                    {/*</span>*/}
                  </TypographyTopDescription>
                </GridCustom>

                <GridCustom container justify="center">
                  <RebalanceSlippageSlider
                    disabled={false}
                    slippageValue={slippageValue}
                    onChangeSlippage={onChangeSlippage}
                  />
                </GridCustom>

                <GridCustom container justify="center">
                  <BtnCustom
                    height="3.4rem"
                    borderRadius={'1rem'}
                    btnWidth="10rem"
                    color={blue.custom}
                    margin="0 .5rem"
                    onClick={handleClose}
                  >
                    Ok
                  </BtnCustom>
                </GridCustom>
              </>
            ) : (
              <>
                <TypographyTopDescription margin="20px auto 32px auto">
                  Your portfolio will change.
                </TypographyTopDescription>
                <GridCustom container justify="center">
                  <RebalanceSlippageSlider
                    disabled={showLoader}
                    slippageValue={slippageValue}
                    onChangeSlippage={onChangeSlippage}
                  />
                </GridCustom>
                <GridCustom container justify="center">
                  <BtnCustom
                    height="3.4rem"
                    borderRadius={'1rem'}
                    btnWidth="10rem"
                    onClick={showLoader ? this.cancelRebalance : handleClose}
                    color={'#DD6956'}
                    margin="0 .5rem"
                  >
                    Cancel
                  </BtnCustom>
                  <BtnCustom
                    height="3.4rem"
                    borderRadius={'1rem'}
                    btnWidth="10rem"
                    btnColor={'#fff'}
                    backgroundColor={
                      isDisableBtns || isEmptyTable ? '#9f9f9f' : '#165be0'
                    }
                    borderColor={
                      isDisableBtns || isEmptyTable ? '#9f9f9f' : '#165be0'
                    }
                    margin="0 .5rem"
                    onClick={this.activateGoBtn}
                    disabled={isDisableBtns || isEmptyTable}
                  >
                    Go!
                  </BtnCustom>
                </GridCustom>
              </>
            )}

            {showTransactionTable && (
              <AccordionTable
                accordionTitle={accordionTitle}
                transactionsData={transactionsData}
                getError={this.getErrorForTransaction}
                isCompleted={this.isCompletedTransaction}
                isFinished={isFinished}
                showLoader={showLoader}
                cancelOrder={cancelOrder}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default RebalanceDialogTransaction
