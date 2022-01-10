import React from 'react'
import { COLORS } from '@variables/variables'
import { Loader } from './Loader'
import { LoaderBlockWrap, LoaderBlockInner } from './styles'

export const LoadingBlock: React.FC<{ loading?: boolean }> = (props) => {
  const { loading, children } = props
  if (!loading) {
    return <>{children}</>
  }

  return (
    <LoaderBlockWrap>
      <Loader className="with-loader" color={COLORS.white} width="3em" />
      <LoaderBlockInner>{children}</LoaderBlockInner>
    </LoaderBlockWrap>
  )
}
