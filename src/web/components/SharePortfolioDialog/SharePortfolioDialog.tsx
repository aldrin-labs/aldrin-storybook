import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { withTheme } from '@material-ui/styles'
import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from './SharePortfolioDialog.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { IProps, IState } from './SharePortfolioDialog.types'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme()
class SharePortfolioDialog extends React.Component<IProps, IState> {
  state: IState = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  render() {
    const {
      theme: {
        palette: { blue, black },
      },
    } = this.props

    return (
      <div>
        <BtnCustom
          btnColor={blue.custom}
          margin="0px auto 12px auto"
          padding="5px"
          onClick={this.handleClickOpen}
        >
          share portfolio
        </BtnCustom>
        <DialogWrapper
          style={{ borderRadius: '32px' }}
          //onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitleCustom id="customized-dialog-title">
            {/* <DialogTitleCustom id="customized-dialog-title" onClose={handleClose}> */}
            <TypographyCustomHeading
              fontWeight={'bold'}
              borderRadius={'10px'}
              color={black.custom}
            >
              Share Trade Portfolio 1
            </TypographyCustomHeading>
          </DialogTitleCustom>

          <DialogContent justify="center" style={{ borderRadius: '20px' }} />
        </DialogWrapper>
      </div>
    )
  }
}

export default SharePortfolioDialog
