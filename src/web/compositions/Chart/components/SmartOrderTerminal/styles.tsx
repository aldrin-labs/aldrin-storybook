import React from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { HeaderProperties, BlockProperties, InputRowProps } from './types'

export const TerminalBlocksContainer = styled(Grid)`
  padding-top: 1rem;
  min-height: 90%;
`

export const TerminalHeaders = styled.div`
  display: flex;
  position: relative;
`

export const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props: HeaderProperties) => props.justify};

  width: ${(props: HeaderProperties) => props.width};
  padding: ${(props: HeaderProperties) => props.padding || '.8rem 1.5rem'};
  margin: ${(props: HeaderProperties) => props.margin || '0'};

  background: #f2f4f6;
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.2rem;
`

export const HeaderLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #16253d;
  border-bottom: 0.1rem dashed #5c8cea;
  cursor: pointer;
`

export const HeaderTitle = styled.span`
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #16253d;
`

export const InputTitle = styled(HeaderTitle)`
  color: #7284a0;
  margin-right: 1rem;
`

export const TimeoutTitle = styled(HeaderTitle)`
  font-size: 1.1rem;
  text-transform: capitalize;
  border: none;
  color: #7284a0;
`

export const TargetValue = styled(HeaderTitle)`
  border: 0;
`

export const TargetTitle = styled(TargetValue)`
  color: #7284a0;
`

export const CloseHeader = styled(TerminalHeader)`
  position: absolute;
  right: 0;
  cursor: pointer;
`

export const TerminalBlock = styled(({ borderRight, ...rest }) => (
  <Grid {...rest} />
))`
  width: ${(props: BlockProperties) => props.width};
  padding: ${(props) => props.padding || '0rem 1rem 0rem 1.2rem'};
  border-right: ${(props) => props.borderRight || '0.1rem solid #abbad1'};
  position: relative;
`

export const FieldsContainer = styled.div`
  padding: ${(props) => props.padding || '0.9rem 0 0 0'};
`

export const SubBlocksContainer = styled.div`
  width: 50%;
  border-right: ${(props) => props.needBorder && '.1rem solid #e0e5ec'};
  padding-right: 0.4rem;
`

export const InputRowContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: ${(props: InputRowProps) => props.direction || 'row'};
  justify-content: ${(props: InputRowProps) => props.justify};
  padding: ${(props: InputRowProps) => props.padding || '0 0 .6rem 0'};

  @media (min-width: 1921px) {
    padding-bottom: ${(props) => props.padding || '0 0 .8rem 0'};
  }
`

export const BluredBackground = styled.div`
  position: absolute;
  z-index: 11;
  top: -0.5rem;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(0.4rem);

  display: flex;
  justify-content: center;
  align-items: center;
`

export const BeforeCharacter = styled.span`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  z-index: 10;
  transform: translateY(-55%);
  display: ${(props) => (props.needCharacter ? 'block' : 'none')};
  font-size: 1.2rem;
  color: ${(props) => (props.beforeSymbol === '+' ? '#29AC80' : '#DD6956')};
`
