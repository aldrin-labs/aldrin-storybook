import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/styles'
import { COLORS } from '@variables/variables'
import { SnackbarProvider } from 'notistack'
import React from 'react'

import { Loader } from '@sb/components/Loader/Loader'
import SvgIcon from '@sb/components/SvgIcon'

import errorIcon from '@icons/errorIcon.svg'
import infoIcon from '@icons/infoIcon.svg'
import successIcon from '@icons/successIcon.svg'

const canselStyeles = (theme) => ({
  icon: {
    fontSize: 20,
  },
})

const CloseButton = withStyles(canselStyeles)((props) => (
  <IconButton key="close" aria-label="Close" color="inherit">
    <CloseIcon className={props.classes.icon} />
  </IconButton>
))

const commonStyles = {
  background: COLORS.cardsBack,
  border: '1px solid #5b5b5b',
}

const snackStyeles = (theme) => ({
  success: {
    ...commonStyles,
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '16px',
    flexGrow: 0,
    maxWidth: '100%',
  },
  error: {
    ...commonStyles,
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '16px',
    flexGrow: 0,
    maxWidth: '100%',
  },
})

const IntegrationNotistack = ({ ...props }) => {
  return (
    <SnackbarProvider
      // domRoot={document.getElementById('react-notification')}
      iconVariant={{
        success: (
          <SvgIcon
            src={successIcon}
            width="3.5rem"
            height="auto"
            style={{
              marginRight: '.8em',
            }}
          />
        ),
        error: (
          <SvgIcon
            src={errorIcon}
            width="3.5rem"
            height="auto"
            style={{
              marginRight: '.8em',
            }}
          />
        ),
        info: (
          <SvgIcon
            src={infoIcon}
            width="3.5rem"
            height="auto"
            style={{
              marginRight: '.8em',
            }}
          />
        ),
        warning: (
          <SvgIcon
            src={infoIcon}
            width="3.5rem"
            height="auto"
            style={{
              marginRight: '.8em',
            }}
          />
        ),
        loading: <Loader width="3.5rem" color={COLORS.white} />,
      }}
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      action={<CloseButton />}
      classes={{
        variantSuccess: props.classes.success,
        variantError: props.classes.error,
        variantInfo: props.classes.success,
      }}
    >
      {props.children}
    </SnackbarProvider>
  )
}

export default withStyles(snackStyeles)(IntegrationNotistack)
