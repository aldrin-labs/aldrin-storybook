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
} from './AddAccountDialog.styles'

import AddIcon from '@material-ui/icons/Add'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps, IState } from './AddAccountDialog.types'

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

@withTheme()
class AddAccountDialog extends React.Component<IProps, IState> {
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
      theme: {
        palette: { blue, black },
      },
    } = this.props

    return (
      <>
        <BtnCustom
          btnWidth={'160px'}
          height={'24px'}
          btnColor={'#165BE0'}
          borderRadius={'10px'}
          color={'#165BE0'}
          margin={'8px 0px'}
          padding={'0px'}
          fontSize={'0.65rem'}
          onClick={this.handleClickOpen}
        >
          {/* <AddIcon fontSize={`small`} /> */}+ Add Account
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
              Add Api Key
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent justify="center">
            <GridCustom style={{ width: '440px' }}>
              <InputBaseCustom placeholder="SELECT EXCHANGE" />
              <InputBaseCustom placeholder="ACCOUNT NAME" />
              <InputBaseCustom placeholder="API KEY" />
              <InputBaseCustom placeholder="SECRET KEY" />
            </GridCustom>

            <GridCustom container justify="space-between" alignItems="center">
              <LinkCustom href={'#'}>How to get keys?</LinkCustom>

              <BtnCustom
                btnWidth={'85px'}
                borderRadius={'32px'}
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



// export default WrappedComponent = compose(
//     graphql(addExchangeKeyMutation, { name: 'createOrderMutation' })
// )(AddAccountDialog)

export default AddAccountDialog
