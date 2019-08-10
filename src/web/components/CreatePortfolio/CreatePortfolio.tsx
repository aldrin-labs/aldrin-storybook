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
} from './CreatePortfolio.styles'

import AddIcon from '@material-ui/icons/Add'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps, IState } from './CreatePortfolio.types'

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
class CreatePortfolio extends React.Component<IProps, IState> {
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
          btnWidth={'17rem'}
          height={'3rem'}
          btnColor={'#16253D'}
          backgroundColor="white"
          borderRadius={'1rem 1rem 0 0'}
          padding={'0px'}
          fontSize={'1.175rem'}
          letterSpacing="1px"
          onClick={this.handleClickOpen}

          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            border: 'none'
          }}
        >
          {/* <AddIcon fontSize={`small`} /> */}Create portfolio
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
              Create Portfolio
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent justify="center">
            <GridCustom style={{ width: '440px' }}>
              <InputBaseCustom placeholder="Name" />
            </GridCustom>

            <GridCustom container justify="space-between" alignItems="center">
              <BtnCustom
                btnWidth={'85px'}
                borderRadius={'32px'}
                btnColor={blue.custom}
              >
                Create
              </BtnCustom>
            </GridCustom>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default CreatePortfolio
