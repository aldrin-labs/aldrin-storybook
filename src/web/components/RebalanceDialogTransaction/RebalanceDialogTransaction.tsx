import React from 'react'
// import { withStyles } from '@material-ui/core/styles'
// import MuiDialogContent from '@material-ui/core/DialogContent'
// import Timer from 'react-compound-timer'

import { buildStyles } from 'react-circular-progressbar'
import CircularProgressbar from '@sb/components/ProgressBar/CircularProgressBar'

import { withTheme } from '@material-ui/styles'
import { Dialog } from '@material-ui/core'
import {
  TypographyCustomHeading,
  GridCustom,
  DialogContent,
  DialogTitleCustom,
  TypographyTopDescription,
  StyledPaper,
  RebalanceDialogTypography
} from './RebalanceDialogTransaction.styles'

import RebalanceSlippageSlider from '@sb/components/RebalanceSlippageSlider'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccordionTable from './AccordionTable'

import { IProps, IState } from './RebalanceDialogTransaction.types'

// const DialogContent = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing.unit * 2,
//   },
// }))(MuiDialogContent)

@withTheme()
class RebalanceDialogTransaction extends React.Component<IProps, IState> {
  state: IState = {
    isFinished: false,
    isError: false,
    isDisableBtns: false,
    showLoader: false,
    hideDialogButton: false
  }

  getErrorForTransaction = (errorState) => {
    this.setState({ isError: errorState, showLoader: false })
  }

  isCompletedTransaction = () => {
    this.setState({ isFinished: true, showLoader: false })
  }

  activateGoBtn = async () => {
    this.setState({ isDisableBtns: true, showLoader: true, hideDialogButton: true })
    await this.props.executeRebalanceHandler()
  }

  defaultStateForTransaction = (handleClickOpen) => {
    this.setState({
      isFinished: false,
      isError: false,
      isDisableBtns: false,
      showLoader: false,
    })
    handleClickOpen()
  }

  render() {
    let {
      accordionTitle,
      transactionsData,
      theme: {
        palette: { blue, red, black },
        spacing: { unit },
      },
      open,
      slippageValue,
      onChangeSlippage,
      handleClickOpen,
      handleClose,
      executeRebalanceHandler,
      initialTime,
      theme: {
        palette: { black },
      },
      onNewSnapshot,
      progress,
      rebalanceInfoPanelData
    } = this.props

    const { isFinished, isError, isDisableBtns, showLoader } = this.state
    const isEmptyTable = transactionsData.length === 0

    const availablePercentage = Math.ceil(100 - rebalanceInfoPanelData.availablePercentage)

    return (
      <div>
        {progress === null ? <div
          style={{ width: '28%', margin: '0 auto', cursor: availablePercentage === 100 ? 'pointer' : 'default' }}
          onClick={() => availablePercentage === 100 ? this.defaultStateForTransaction(handleClickOpen) : null}
        >
              <CircularProgressbar
                value={availablePercentage}
                text={availablePercentage === 100 ? 'GO!' : `${availablePercentage}%`}
                maxValue={100}
                styles={{
                  ...buildStyles({
                    pathColor: '#0B1FD1',
                    trailColor: '#F9FBFD'
                  }),
                  text: {
                    fontSize: '2rem',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 'bold',
                    fill: '#dd6956',
                    letterSpacing: '1.5px'
                  }
                }}
                strokeWidth={12}
              />
            </div> :
          <RebalanceDialogTypography
            onClick={() => this.defaultStateForTransaction(handleClickOpen)}
          >See detailed status</RebalanceDialogTypography>
        }

        <Dialog
          PaperComponent={StyledPaper}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
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
                    Rebalance unsuccessful
                  </TypographyTopDescription>
                </GridCustom>
                <GridCustom container justify="center">
                  <RebalanceSlippageSlider
                    disabled={true}
                    slippageValue={slippageValue}
                    onChangeSlippage={onChangeSlippage}
                  />
                </GridCustom>
                <GridCustom container justify="center">
                  <BtnCustom
                    height="34px"
                    borderRadius={'1rem'}
                    btnWidth="120px"
                    color={blue.custom}
                    margin="0 5px"
                    onClick={() => {
                      onNewSnapshot()
                      handleClose()
                    }}
                  >
                    Ok
                  </BtnCustom>
                </GridCustom>
              </>
            ) : isFinished ? (
              <>
                <GridCustom container>
                  <TypographyTopDescription margin="-12px 0 25px 0">
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
                    disabled={true}
                    slippageValue={slippageValue}
                    onChangeSlippage={onChangeSlippage}
                  />
                </GridCustom>

                <GridCustom container justify="center">
                  <BtnCustom
                    height="34px"
                    borderRadius={'1rem'}
                    btnWidth="120px"
                    color={blue.custom}
                    margin="0 5px"
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
                    disabled={isEmptyTable}
                    slippageValue={slippageValue}
                    onChangeSlippage={onChangeSlippage}
                  />
                </GridCustom>
                <GridCustom container justify="center">
                  <BtnCustom
                    height="34px"
                    borderRadius={'1rem'}
                    btnWidth="120px"
                    onClick={handleClose}
                    color={isDisableBtns ? '#9f9f9f' : '#b93b2b'}
                    margin="0 5px"
                    disabled={isDisableBtns}
                  >
                    Cancel
                  </BtnCustom>
                  <BtnCustom
                    height="34px"
                    borderRadius={'1rem'}
                    btnWidth="120px"
                    color={isDisableBtns ? '#9f9f9f' : '#165be0'}
                    margin="0 5px"
                    onClick={this.activateGoBtn}
                    disabled={isDisableBtns || isEmptyTable}
                  >
                    Go!
                  </BtnCustom>
                </GridCustom>
              </>
            )}

            <AccordionTable
              accordionTitle={accordionTitle}
              transactionsData={transactionsData}
              getError={this.getErrorForTransaction}
              isCompleted={this.isCompletedTransaction}
              isFinished={isFinished}
              showLoader={showLoader}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }
}

export default RebalanceDialogTransaction
