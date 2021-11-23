import React from 'react'
import { SORT_ORDER } from '../types'
import { ArrowContainer } from '../styles'

export interface SortButtonProps {
  sortOrder: SORT_ORDER
  sortColumn: string
  columnName: string
}

export const SortButton: React.FC<SortButtonProps> = (props) => {
  const { sortOrder, sortColumn, columnName } = props
  const isActive = sortColumn === columnName

  return (
    <ArrowContainer>
      {isActive && sortOrder !== SORT_ORDER.NONE &&
        <>
          {sortOrder === SORT_ORDER.ASC ? '↑' : '↓'}
        </>
      }
    </ArrowContainer>
  )
}