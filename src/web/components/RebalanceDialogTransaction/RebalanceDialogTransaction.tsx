import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
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
import SvgIcon from '../../components/SvgIcon'
import Stroke from '../../../icons/Stroke.svg'

import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import AccordionTable from './AccordionTable'
import Ellipse from '../../../icons/Ellipse.png'

import { IProps, IState } from './RebalanceDialogTransaction.types'
import { graphQLResultHasError } from 'apollo-utilities'

const DialogTitle = withStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))((props) => {
  const { children, classes, onClose } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions)

@withTheme()
class RebalanceDialogTransaction extends React.Component<IProps, IState> {
  state = {
    isFinished: false,
    isError: false,
  }

  getError = (error) => {
    this.setState({ isError: error })
  }

  isCompleted = (progressOfComplition) => {
    this.setState({ isFinished: true })
  }

  render() {
    const {
      dialogHedaing,
      titleDescription,
      btnFirst,
      btnSecond,
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
    } = this.props

    //TODO
    const { isFinished, isError } = this.state

    return (
      <div>
        <LinkCustom background={Stroke} onClick={handleClickOpen}>
          <SvgIcon width="60" height="60" src={Ellipse} />
        </LinkCustom>

        <DialogWrapper
          style={{ borderRadius: '32px' }}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            onClose={handleClose}
          >
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

          <DialogContent justify="center" style={{borderRadius: '20px'}}>
            {isError ? (
              <>
                <GridCustom container>
                  <TypographyTopDescription margin="-10px 0 0 0">
                    Rebalance unsuccessful so sorry
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
              getError={this.getError}
              isCompleted={this.isCompleted}
            />
          </DialogContent>
        </DialogWrapper>
      </div>
    )
  }
}

export default RebalanceDialogTransaction
