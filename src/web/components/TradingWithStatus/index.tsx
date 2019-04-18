import React from 'react'
import { Button, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { SnackbarProvider, withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core/styles'
import TradingWrapper from '../TradingWrapper'

const canselStyeles = theme => ({
  icon: {
    fontSize: 20,
  }
})

const snackStyeles = theme => ({
  success: { backgroundColor: theme.customPalette.green.main },
  error: { backgroundColor: theme.customPalette.red.main },
})

const CloseButton = withStyles(canselStyeles)((props) => (
  <IconButton
  key="close"
  aria-label="Close"
  color="inherit"
  >
  <CloseIcon className={props.classes.icon} />
</IconButton>
))

class App extends React.Component {
  showOrderResult = (result) => {
    if (result.status === 'success' && result.orderId && result.message) {
      this.props.enqueueSnackbar(result.message, {
        variant: 'success',
        action: (
          <>
          <Button
            size="small"
            color="inherit"
            onClick={() => this.props.canselOrder(result.orderId)}
          >
            {'Cancel'}
          </Button>
          <CloseButton />
          </>
        ),
      })
    } else if (result.status === 'success' || !result.message) {
      this.props.enqueueSnackbar('Something went wrong', { variant: 'error' })
    } else {
      this.props.enqueueSnackbar(result.message, { variant: 'error' })
    }
  }


  render() {
    const { canselOrder } = this.props
    return (
      <TradingWrapper
        showOrderResult={this.showOrderResult}
        canselOrder={canselOrder}
        {...this.props}
      />
    )
  }
}


const MyApp = withSnackbar(App)

const IntegrationNotistack = ({classes, ...otherProps}) => {
  return (
    <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    action={(
      <CloseButton />
    )}
    classes={{
      variantSuccess: classes.success,
      variantError: classes.error,
    }}
    >
      <MyApp
        {...otherProps}
      />
    </SnackbarProvider>
  );
}

export default withStyles(snackStyeles)(IntegrationNotistack)