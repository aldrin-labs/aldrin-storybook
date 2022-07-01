import * as React from 'react'
import { FetchPolicy } from 'apollo-client'

export type VariablesType = {
  [key: string]: any
}

export interface IVariablesFunction {
  (props: any): VariablesType
}

export interface HOCTypes {
  component?: React.ComponentType<any>
  query: any
  pollInterval?: number
  withOutSpinner?: boolean
  withTableLoader?: boolean
  withoutLoading?: boolean
  fetchPolicy?: FetchPolicy | 'cache-and-network'
  placeholder?: React.SFC | React.ComponentClass | React.ReactFragment
  variables?: { [key: string]: any } | ((props: any) => VariablesType) | null
  [key: string]: any
  centerAlign?: boolean
  showLoadingWhenQueryParamsChange?: boolean
}

export interface IProps extends HOCTypes {
  component: React.ComponentType<any>
}
