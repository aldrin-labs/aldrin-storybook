import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

import { withTheme } from '@material-ui/styles'

import { Grid } from '@material-ui/core'
import {
  TypographyCustomHeading,
  GridCustom,
  InputBaseCustom,
  DialogWrapper,
  DialogTitleCustom,
  Legend,
  LinkCustom,
} from './AddAccountDialog.styles'

import SvgIcon from '@sb/components/SvgIcon'
import Plus from '@icons/Plus.svg'

import SelectAllExchangeList from '@core/components/SelectAllExchangeList/SelectAllExchangeList'

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

  handleSelectChange = exchange => {
    console.log(exchange)
  }

  render() {
    const { handleSelectChange } = this
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
          btnColor={'#165BE0'}
          borderRadius={'1rem'}
          color={'#165BE0'}
          margin={'1.6rem 0 0 1.2rem'}
          padding={'0px'}
          fontSize={'1.4rem'}
          letterSpacing="1px"
          onClick={this.handleClickOpen}

          style={{
            border: 'none'
          }}
        >
          <SvgIcon src={Plus} width="3.5rem" height="auto" style={{
            marginRight: '.8rem'
          }}/>
          {/* <AddIcon fontSize={`small`} /> */} Add Account
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
              Add Api Key
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent justify="center">
            <Grid style={{ width: '440px' }}>
              <GridCustom>
                <Legend>Exchange</Legend>
                <SelectAllExchangeList
                  classNamePrefix="custom-select-box"
                  isClearable={true}
                  isSearchable={true}
                  openMenuOnClick={true}
                  options={[
                    {
                      label: 'Binance',
                      value: 'Binance',
                    },
                  ]}
                  menuPortalTarget={document.body}
                  menuPortalStyles={{
                    zIndex: 111,
                  }}
                  menuStyles={{
                    fontSize: '12px',
                    minWidth: '150px',
                    height: '200px',
                  }}
                  menuListStyles={{
                    height: '200px',
                  }}
                  optionStyles={{
                    fontSize: '12px',
                  }}
                  clearIndicatorStyles={{
                    padding: '2px',
                  }}
                  valueContainerStyles={{
                    minWidth: '35px',
                    maxWidth: '55px',
                    overflow: 'hidden',
                  }}
                  inputStyles={{
                    marginLeft: '0',
                  }}
                  onChange={(
                    optionSelected: {
                      label: string
                      value: string
                    } | null
                  ) => handleSelectChange(optionSelected)}
                  noOptionsMessage={() => `No such exchange in our DB found`}
                />
              </GridCustom>
              <GridCustom>
                <Legend>Account name</Legend>
                <InputBaseCustom placeholder="Type name..." />
              </GridCustom>
              <GridCustom>
                <Legend>Api key</Legend>
                <InputBaseCustom placeholder="Paste key..." />
              </GridCustom>
              <GridCustom>
                <Legend>Secret key</Legend>
                <InputBaseCustom placeholder="Paste key..." />
              </GridCustom>
            </Grid>

            <Grid container justify="space-between" alignItems="center">
              <LinkCustom href={'#'}>How to get keys?</LinkCustom>

              <BtnCustom
                btnWidth={'85px'}
                borderRadius={'32px'}
                btnColor={blue.custom}
              >
                ADD
              </BtnCustom>
            </Grid>
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
