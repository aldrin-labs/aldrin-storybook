export interface IProps {
  history: any
  theme: any,
  handleClose: () => void,
  open: boolean,
  completeOnboarding: () => Promise<any>,
}
