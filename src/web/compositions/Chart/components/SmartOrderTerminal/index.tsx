import React from 'react'

import { IProps, IState } from './types'

import { CustomCard } from '../../Chart.styles'
import { StyledZoomIcon } from '@sb/components/TradingWrapper/styles'
import {
  TerminalBlocksContainer,
  TerminalHeaders,
  TerminalBlock,
  TerminalHeader,
  CloseHeader,
} from './styles'

export class SmartOrderTerminal extends React.Component<IProps, IState> {
  state = {}

  render() {
    const { updateTerminalViewMode } = this.props

    return (
      <CustomCard>
        <TerminalHeaders>
          <TerminalHeader width={'33%'}>
            <span>entry point</span>
          </TerminalHeader>
          <TerminalHeader width={'31%'} margin={'0 1%'}>
            <span>entry point</span>
          </TerminalHeader>
          <TerminalHeader width={'31%'}>
            <span>entry point</span>
          </TerminalHeader>
          <CloseHeader
            padding={'.3rem .5rem'}
            onClick={() => updateTerminalViewMode('default')}
          >
            <StyledZoomIcon />
          </CloseHeader>
        </TerminalHeaders>
        <TerminalBlocksContainer xs={12} container item>
          <TerminalBlock width={'calc(33% + 0.5%)'}>block1</TerminalBlock>
          <TerminalBlock width={'calc(31% + 1%)'}>block2</TerminalBlock>
          <TerminalBlock width={'calc(31% + 1%)'}>block3</TerminalBlock>
        </TerminalBlocksContainer>
      </CustomCard>
    )
  }
}
