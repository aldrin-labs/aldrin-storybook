import React from 'react'
import {
  Dialog,
  IconButton,
  Button,
  Typography,
  Slide,
  DialogActions,
  DialogContent,
} from '@material-ui/core'
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { toggleMobilePopup } from '@containers/App/actions'

const styles = theme => ({
  largeButton: {
    margin: theme.spacing.unit,
    padding: 24
  },
  largeIcon: {
    fontSize: "3em"
  },
});

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  )
}

const Transition = (props: any) => {
  return <Slide direction="up" {...props} />
}

const PopUp = ({
  mobilePopup,
  togglePopUp,
  classes,
}: {
  mobilePopup: boolean
  togglePopUp: () => void
}) => {
  return (
    <Dialog
      css={`
        opacity: 0.75;
      `}
      TransitionComponent={Transition}
      fullScreen
      open={isMobileDevice() && mobilePopup}
    >
      <DialogContent
        css={`
          display: flex;
          flex-direction: column;
          place-items: center;
          place-content: center;
        `}
      >
        <div
          css={`
            width: 100%;
            text-align: right;
          `}
        >
        <IconButton
          color="secondary"
          onClick={togglePopUp}
          aria-label="Close"
          className={classes.largeButton}
        >
          <CloseIcon className={classes.largeIcon} />
        </IconButton>
        </div>
        <Typography color="error" variant="h2">
          We are currently in beta and don't support your screen resolution.
          Please open the desktop version of this page.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" size="large" onClick={togglePopUp}>
          okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
  mobilePopup: store.ui.mobilePopup,
  chartPageView: store.chart.view,
})

const mapDispatchToProps = (dispatch: any) => ({
  togglePopUp: () => dispatch(toggleMobilePopup()),
})

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUp))
