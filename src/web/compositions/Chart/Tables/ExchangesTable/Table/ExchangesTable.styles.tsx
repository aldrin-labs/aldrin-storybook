import React from 'react'
import { Button } from '@material-ui/core'
import styled from 'styled-components'
import FaCircle from '@material-ui/icons/Brightness1'
import {
  Table,
  HeadCell,
  FullWidthBlock,
  Cell,
} from '@storybook/components/OldTable/Table'

export const Icon = styled(({ iconColor, ...rest }) => <FaCircle { ...rest } />)`
  font-size: 0.5rem;
  min-width: 20%;
  flex-basis: 20%;
  color: ${(props: { iconColor: string }) => props.iconColor};
`

export const FlexCell = styled(Cell)`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
`

export const FullWidthBlockMovedLeft = styled(FullWidthBlock)`
  position: relative;
  left: 20%;
`

export const StyledHeadCell = styled(HeadCell)`
  line-height: 37px;
  padding: 0.25rem 0.4rem;
`

export const StyledTable = styled(Table)`
  overflow-x: hidden;
`

export const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }
`
