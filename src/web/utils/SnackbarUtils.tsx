import { useSnackbar, withSnackbarProps, OptionsObject } from 'notistack'
import React from 'react'

interface IProps {
  setUseSnackbarRef: (showSnackbar: withSnackbarProps) => void
}

const InnerSnackbarUtilsConfigurator: React.FC<IProps> = (props: IProps) => {
  props.setUseSnackbarRef(useSnackbar())
  return null
}

let useSnackbarRef: withSnackbarProps
const setUseSnackbarRef = (useSnackbarRefProp: withSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfigurator = () => {
  return (
    <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
  )
}

export default {
  success(msg: string, options: OptionsObject = {}) {
    console.log('this: ', this)
    console.log('this.toast: ', this.toast)

    return this.toast(msg, { ...options, variant: 'success' })
  },
  warning(msg: string, options: OptionsObject = {}) {
    return this.toast(msg, { ...options, variant: 'warning' })
  },
  info(msg: string, options: OptionsObject = {}) {
    return this.toast(msg, { ...options, variant: 'info' })
  },
  loading(msg: string, options: OptionsObject = {}) {
    return this.toast(msg, { ...options, variant: 'loading' })
  },
  error(msg: string, options: OptionsObject = {}) {
    return this.toast(msg, { ...options, variant: 'error' })
  },
  toast(msg: string, options: OptionsObject = {}) {
    return useSnackbarRef.enqueueSnackbar(msg, options)
  },
  close(key: string) {
    useSnackbarRef.closeSnackbar(key)
  },
}
