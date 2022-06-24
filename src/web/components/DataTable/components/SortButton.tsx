import React from 'react'

import { ArrowContainer } from '../styles'
import { SORT_ORDER } from '../types'
import { SortButtonProps } from './types'

export const SortButton: React.FC<SortButtonProps> = (props) => {
  const { sortOrder, sortColumn, columnName } = props
  const isActive = sortColumn === columnName

  return (
    <ArrowContainer>
      {isActive && sortOrder !== SORT_ORDER.NONE && (
        <>{sortOrder === SORT_ORDER.ASC ? '↑' : '↓'}</>
      )}
    </ArrowContainer>
  )
}
