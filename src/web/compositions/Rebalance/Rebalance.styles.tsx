import React, { CSSProperties, HTMLAttributes, } from 'react'
import styled from 'styled-components'

export interface TextInterface extends HTMLAttributes<HTMLSpanElement> { fontSize?: string, paddingBottom?: string, children: any, style: CSSProperties } 

export const Text = styled.span`
  font-size: ${ (props: TextInterface) => props.fontSize || '1.5rem'};
  padding-bottom: ${(props) => props.paddingBottom};
  text-transform: none;
  font-family: Avenir Next Medium;
  color: #ecf0f3;
`