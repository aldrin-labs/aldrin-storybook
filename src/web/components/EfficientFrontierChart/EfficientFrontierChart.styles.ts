import styled from 'styled-components'

export const Container = styled.div`
  height: 300px;
  width: 100%;
`

export const ChartTooltip = styled.span`
  white-space: nowrap;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: ${(props: { color: string }) => props.color};
  border-radius: 3px;
  background: ${(props: { background: string }) => props.background};
  box-shadow: 0 2px 6px 0 #0006;
  padding: 8px;
`
