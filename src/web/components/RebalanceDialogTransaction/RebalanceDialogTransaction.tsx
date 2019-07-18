import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import Timer from 'react-compound-timer'
import { withTheme } from '@material-ui/styles'
import {
  TypographyCustomHeading,
  GridCustom,
  DialogWrapper,
  DialogTitleCustom,
  TypographyTopDescription,
  LinkCustom,
} from './RebalanceDialogTransaction.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccordionTable from './AccordionTable'

import SvgIcon from '@sb/components/SvgIcon'
import Stroke from '../../../icons/Stroke.svg'
import Ellipse from '../../../icons/Ellipse.png'

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
    isFinished: true,
    isError: false,
  }

  getErrorForTransaction = (errorState) => {
    this.setState({ isError: errorState })
  }

  isCompletedTransaction = () => {
    this.setState({ isFinished: true })
  }

  defaultStateForTransaaction = (handleClickOpen) => {
    this.setState({ isFinished: false, isError: false })
    handleClickOpen()
  }

  render() {
    const {
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

    const { isFinished, isError } = this.state

    return (
      <div>
        <LinkCustom
          background={Stroke}
          onClick={() => this.defaultStateForTransaaction(handleClickOpen)}
        >
          <SvgIcon width="60" height="60" src={Ellipse} />
        </LinkCustom>

        <DialogWrapper
          style={{ borderRadius: '32px' }}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitleCustom id="customized-dialog-title" onClose={handleClose}>
            <TypographyCustomHeading
              fontWeight={'bold'}
              borderRadius={'10px'}
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
                    borderRadius={'10px'}
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
                    Next rebalance will be at {` `}
                    <span style={{ color: `${blue.custom}` }}>
                      <Timer
                        initialTime={initialTime}
                        direction="backward"
                        startImmediately={true}
                      >
                        {() => (
                          <React.Fragment>
                            <Timer.Hours />:
                            <Timer.Minutes />:
                            <Timer.Seconds />
                          </React.Fragment>
                        )}
                      </Timer>
                    </span>
                  </TypographyTopDescription>
                </GridCustom>

                <GridCustom container justify="center">
                  <BtnCustom
                    height="34px"
                    borderRadius={'10px'}
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
                    borderRadius={'10px'}
                    btnWidth="120px"
                    onClick={handleClose}
                    color={red.custom}
                    margin="0 5px"
                  >
                    Cancel
                  </BtnCustom>

                  <BtnCustom
                    height="34px"
                    borderRadius={'10px'}
                    btnWidth="120px"
                    color={blue.custom}
                    margin="0 5px"
                    onClick={async () => await executeRebalanceHandler()}
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
        </DialogWrapper>
      </div>
    )
  }
}

export default RebalanceDialogTransaction
