import React from 'react'
import styled from 'styled-components'
import { Theme, CSSProperties } from '@material-ui/core'

export const Text = styled.span`
  color: ${(props: { active?: boolean; theme: Theme }) =>
    props.active
      ? props.theme.palette.blue.main
      : props.theme.palette.grey.text};
  font-weight: ${(props: { active?: boolean }) =>
    props.active ? 'bold' : 'normal'};
  font-size: 1.4rem;
  font-family: 'DM Sans';
  text-transform: capitalize;
`

type RowProps = {
  direction?: string
  justify?: string
  align?: string
  width?: string
  style?: CSSProperties
}

export const Row = styled.div`
  display: flex;
  flex-direction: ${(props: RowProps) => props.direction || 'row'};
  justify-content: ${(props: RowProps) => props.justify || 'center'};
  align-items: ${(props: RowProps) => props.align || 'center'};
  width: ${(props: RowProps) => props.width || '100%'};
  ${(props: RowProps) => props.style};
`
