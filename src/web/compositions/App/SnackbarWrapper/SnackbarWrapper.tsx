
import { withStyles } from '@material-ui/styles'
import { COLORS } from '@variables/variables'
import { SnackbarProvider } from 'notistack'
import React from 'react'

import { Loading } from '@sb/components'
import SvgIcon from '@sb/components/SvgIcon'

import errorIcon from '@icons/errorIcon.svg'
import infoIcon from '@icons/infoIcon.svg'
import successIcon from '@icons/successIcon.svg'

const commonStyles = {
  background: COLORS.cardsBack,
  border: '1px solid #5b5b5b',
  color: '#fff',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  borderRadius: '16px',
  flexGrow: 0,
  maxWidth: '100%',
}

const snackStyeles = () => ({
  success: {
    ...commonStyles,
  },
  error: {
    ...commonStyles,
  },
  warning: {
    ...commonStyles,
  },
})

const IntegrationNotistack = ({ ...props }) => {
  return (
    <SnackbarProvider
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
          <Loading size="3.5rem" margin="0 0.8rem 0 0" color={COLORS.white} />
        ),
      }}
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      classes={{
        variantWarning: props.classes.warning,
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
