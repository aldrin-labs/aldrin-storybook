import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

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
  render() {
    const {
      dialogHedaing,
      titleDescription,
      btnFirst,
      btnSecond,
      accordionTitle,
      data,
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
    } = this.props

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
          <DialogTitleCustom id="customized-dialog-title" onClose={handleClose}>
            <TypographyCustomHeading
              fontWeight={'bold'}
              borderRadius={'10px'}
              color={black.custom}
            >
              {dialogHedaing}
            </TypographyCustomHeading>
          </DialogTitleCustom>

          <DialogContent justify="center">
            <TypographyTopDescription>
              {titleDescription}
            </TypographyTopDescription>

            <GridCustom container justify="center">
              <BtnCustom
                padding={'5px 0'}
                borderRadius={'10px'}
                btnWidth="130px"
                onClick={handleClose}
                color={red.custom}
                margin='0 5px'
              >
                {btnFirst}
              </BtnCustom>

              <BtnCustom
                padding={'5px 0'}
                borderRadius={'10px'}
                btnWidth="130px"
                color={blue.custom}
                margin='0 5px'
                onClick={async () => await executeRebalanceHandler()}
              >
                {btnSecond}
              </BtnCustom>
            </GridCustom>
            <AccordionTable
              accordionTitle={accordionTitle}
              data={data}
              accordionTitle={accordionTitle}
            />
          </DialogContent>
        </DialogWrapper>
      </div>
    )
  }
}

export default RebalanceDialogTransaction
