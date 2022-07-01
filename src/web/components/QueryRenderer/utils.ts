import { isFunction } from '@core/utils/helpers'

import { VariablesType, IVariablesFunction } from './index.types'

export const isVariablesFunction = (arg: any): arg is IVariablesFunction => true

export const getVariables = (
  variables: any,
  props: any
): VariablesType | boolean | null | undefined => {
  if (!isFunction(variables)) {
    return variables
  }

  if (variables && isFunction(variables) && isVariablesFunction(variables)) {
    return variables(props)
  }

  return variables
}
