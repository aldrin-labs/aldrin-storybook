import React from 'react'
import { useTheme } from 'styled-components'

import { Loader } from './Loader'
import { LoaderBlockWrap, LoaderBlockInner } from './styles'

export const LoadingBlock: React.FC<{ loading?: boolean }> = (props) => {
  const { loading, children } = props
  const theme = useTheme()
  if (!loading) {
    return <>{children}</>
  }

  return (
    <LoaderBlockWrap>
      <Loader className="with-loader" color={theme.colors.white1} width="3em" />
      <LoaderBlockInner>{children}</LoaderBlockInner>
    </LoaderBlockWrap>
  )
}
