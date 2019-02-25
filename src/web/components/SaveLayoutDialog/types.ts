export interface IProps {
  handleClickOpen: () => void
  handleClose: () => void
  open: boolean
  handleChange: () => void
  values: { layoutNameInput: string }
  handleSubmit: () => void
  errors: { layoutNameInput: string }
}

export interface IhandleSubmitProps {
  props: {
    handleClose: () => void
    saveLayout: (layoutName: string) => void
  }
  setSubmitting: (status: boolean) => void
}
