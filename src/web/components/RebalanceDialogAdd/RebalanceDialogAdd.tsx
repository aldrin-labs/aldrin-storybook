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
  InputBaseCustom,
  DialogWrapper,
  DialogTitleCustom,
  GridSearchPanel,
  LinkCustom,
  SearchIconCustom,
} from './RebalanceDialogAdd.styles'

import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import ContentList from './ContentList'

import { IProps, IState } from './RebalanceDialogAdd.types'

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
class RebalanceDialogAdd extends React.Component<IProps, IState> {
  state: IState = {
    open: false,
    isSelected: true,
  }

  handleRadioBtn = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    })
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const {
      title,
      data,
      theme: {
        palette: { blue, black },
      },
    } = this.props

    return (
      <>
        <BtnCustom
          btnColor={blue.custom}
          margin="0px auto 12px auto"
          padding="5px"
          onClick={this.handleClickOpen}
        >
          {title}
        </BtnCustom>
        <DialogWrapper
          style={{ borderRadius: '50%' }}
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            onClose={this.handleClose}
          >
            <TypographyCustomHeading
              fontWeight={'700'}
              borderRadius={'10px'}
              color={black.custom}
            >
              {title}
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent justify="center">
            <GridSearchPanel>
              <SearchIconCustom />
              <InputBaseCustom placeholder="Search…" />
            </GridSearchPanel>

            <GridCustom>
              <ContentList
                handleRadioBtn={this.handleRadioBtn}
                isSelected={this.state.isSelected}
                data={data}
              />
            </GridCustom>

            <GridCustom container justify="space-between" alignItems="center">
              <LinkCustom href={'#'} color={blue.custom}>
                Go to index market
              </LinkCustom>
              <BtnCustom
                btnWidth={'110px'}
                borderRadius={'10px'}
                btnColor={blue.custom}
              >
                ADD
              </BtnCustom>
            </GridCustom>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default RebalanceDialogAdd
