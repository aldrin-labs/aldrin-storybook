import { compose, withState, branch, renderComponent, setDisplayName, lifecycle } from 'recompose'

import { ErrorFallback } from '@sb/components/index'

export const withErrorFallback: any = compose(
  setDisplayName('ErrorBoundry'),
  withState('hasError', 'setHasError', false),
  withState('errorInfo', 'setErrorInfo', ''),
  lifecycle({
    componentDidCatch(error: any, errorInfo: any): void {
      this.props.setHasError(true)
      this.props.setErrorInfo(errorInfo)
      console.log(error, errorInfo)
    },
  }),
  branch((props) => props.hasError, renderComponent(ErrorFallback))
)
