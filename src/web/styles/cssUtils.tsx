import React from 'react'
import styled from 'styled-components'
import { Card } from '@material-ui/core'

export const customAquaScrollBar = `
  &::-webkit-scrollbar {
    width: 3px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }`

export const PTWrapper = styled(({ tableData, ...rest }) => <Card {...rest} />)`
  grid-column: 2;
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 1.5rem auto;
  padding: 1rem 0;
  height: calc(100vh - 130px);
  overflow-y: auto;
  @media (max-width: 840px) {
    margin: 1.5rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 0.625rem auto;
  }

  @media (max-width: 425px) {
    width: calc(100% - 20px);
  }
`

