import { Theme } from "@material-ui/core";

export interface IState {
  loading: boolean
}

export interface IProps {
  theme: Theme
  open: boolean
  completeOnboarding: () => Promise<void>
}
