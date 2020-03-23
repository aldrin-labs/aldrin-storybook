import React from 'react'
import { withStyles } from '@material-ui/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

import { MASTER_BUILD } from '@core/utils/config'

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

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'
import ContentList from './ContentList'

import { IProps, IState } from './RebalanceDialogAdd.types'
import ComingSoon from '../ComingSoon'

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
        palette: { blue, black, secondary },
      },
      children,
      onSearch,
    } = this.props

    return (
      <>
        <BtnCustom
          btnColor={secondary.main}
          fontSize="1.2rem"
          letterSpacing="1px"
          margin="0px auto 12px auto"
          padding="3px"
          borderRadius="16px"
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
              borderRadius={'1rem'}
              color={black.custom}
            >
              {title}
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent
            justify="center"
            style={MASTER_BUILD && { filter: 'blur(3px)' }}
          >
            <GridSearchPanel>
              <SearchIconCustom />
              <InputBaseCustom placeholder="Search…" onChange={onSearch} />
            </GridSearchPanel>

            <GridCustom>
              {children ? (
                children
              ) : (
                <ContentList
                  handleRadioBtn={this.handleRadioBtn}
                  isSelected={this.state.isSelected}
                  data={data}
                />
              )}
            </GridCustom>

            <GridCustom container justify="space-between" alignItems="center">
              <LinkCustom href={'#'} color={blue.custom}>
                Go to index market
              </LinkCustom>
              <BtnCustom
                btnWidth={'110px'}
                borderRadius={'1rem'}
                btnColor={blue.custom}
              >
                ADD
              </BtnCustom>
            </GridCustom>
          </DialogContent>
          {MASTER_BUILD && <ComingSoon />}
        </DialogWrapper>
      </>
    )
  }
}

export default RebalanceDialogAdd
