import styled from 'styled-components'

type TextProps = {
  fontSize?: string
  paddingBottom?: string
  fontFamily?: string
}

export const Text = styled.span`
  font-size: ${(props: TextProps) => props.fontSize || '1.5rem'};
  padding-bottom: ${(props) => props.paddingBottom || '0'};
  text-transform: none;
  font-family: ${(props: TextProps) =>
    props.fontFamily || 'Avenir Next Medium'};
  color: ${(props: TextProps) => props.color || '#ecf0f3'};
  white-space: ${(props) => props.whiteSpace || 'normal'};
  padding: ${(props) => props.padding || '0'};
  letter-spacing: 0.01rem;
`
