import React, { useState } from 'react'
import {
  Dialog,
  IconButton,
  Button,
  Typography,
  Slide,
  DialogActions,
  DialogContent,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import CloseIcon from '@material-ui/icons/Close'

const styles = (theme) => ({
  largeButton: {
    margin: theme.spacing.unit,
    padding: 24,
  },
  largeIcon: {
    fontSize: '3em',
  },
})

function isMobileDevice() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true
  } else {
    return false
  }
}

const Transition = (props: any) => {
  return <Slide direction="up" {...props} />
}

const PopUp = ({ classes }: { classes: any }) => {
  const [showMobilePopUp, toggleMobilePopUp] = useState(true)

  return (
    <Dialog
      css={`
        opacity: 0.75;
      `}
      TransitionComponent={Transition}
      fullScreen
      open={isMobileDevice() && showMobilePopUp}
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
            onClick={() => toggleMobilePopUp(!showMobilePopUp)}
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
        <Button
          color="secondary"
          size="large"
          onClick={() => toggleMobilePopUp(!showMobilePopUp)}
        >
          okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default withStyles(styles)(PopUp)
