import React, { CSSProperties } from 'react'
import styled from 'styled-components'

const Text = styled.span`
  color: ${(props) => props.theme.colors.red3};
  font-family: Avenir Next Demi;
  font-size: 1.4rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 1.6rem;
  padding: 0 0.6rem;

  ${(props) => props.style}
`

export const Label = ({
  style = {},
  text = 'Beta',
}: {
  style?: CSSProperties
  text?: string
}) => {
  return <Text style={style}>{text}</Text>
}
