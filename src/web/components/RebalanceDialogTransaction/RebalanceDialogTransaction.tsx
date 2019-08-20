import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import Timer from 'react-compound-timer'
import { withTheme } from '@material-ui/styles'
import { Dialog, Grid } from '@material-ui/core'
import {
  TypographyCustomHeading,
  GridCustom,
  DialogTitleCustom,
  TypographyTopDescription,
  LinkCustom,
  StyledPaper,
} from './RebalanceDialogTransaction.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccordionTable from './AccordionTable'

import SvgIcon from '@sb/components/SvgIcon'
import Stroke from '@icons/Stroke.svg'
import Ellipse from '@icons/Ellipse.png'

import { IProps, IState } from './RebalanceDialogTransaction.types'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme()
class RebalanceDialogTransaction extends React.Component<IProps, IState> {
  state: IState = {
    isFinished: false,
    isError: false,
    isDisableBtns: false,
  }

  getErrorForTransaction = (errorState) => {
    this.setState({ isError: errorState })
  }

  isCompletedTransaction = () => {
    this.setState({ isFinished: true })
  }

  activateGoBtn = async () => {
    this.setState({ isDisableBtns: true })
    await this.props.executeRebalanceHandler()
  }

  defaultStateForTransaction = (handleClickOpen) => {
    this.setState({ isFinished: false, isError: false, isDisableBtns: false })
    handleClickOpen()
  }

  render() {
    let {
      accordionTitle,
      transactionsData,
      theme: {
        palette: { blue, red },
      },
      open,
      handleClickOpen,
      handleClose,
      theme: {
        palette: { black },
      },
      executeRebalanceHandler,
      initialTime,
      onNewSnapshot,
    } = this.props

    const { isFinished, isError, isDisableBtns } = this.state

    return (
      <div>
        <LinkCustom
          background={Stroke}
          onClick={() => this.defaultStateForTransaction(handleClickOpen)}
        >
          <SvgIcon width="60" height="60" src={Ellipse} />
        </LinkCustom>

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
          <DialogContent justify="center" style={{ borderRadius: '20px' }}>
            {isError ? (
              <>
                <GridCustom container>
                  <TypographyTopDescription margin="-10px 0 0 0">
                    Rebalance unsuccessful
                  </TypographyTopDescription>
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
                  <BtnCustom
                          height="34px"
                          borderRadius={'1rem'}
                          btnWidth="120px"
                          onClick={handleClose}
                          color={'#B93B2B'}
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
                          disabled={isDisableBtns}
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
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default RebalanceDialogTransaction
