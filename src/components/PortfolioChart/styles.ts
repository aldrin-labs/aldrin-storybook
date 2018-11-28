import styled from 'styled-components'
import { Card } from '@material-ui/core'

export const Chart = styled.div`
  width: 100%;
  min-height: 5em;
  height: ${(props: { height: string }) => props.height || '100%'};
`

export const SProfileChart = styled(Card)`
  position: relative;
  height: 100%;
  width: 100%;
`
export const axisStyle = {
  ticks: {
    padding: '1rem',
    stroke: '#3E3E4A',
    opacity: 0.75,
    fontWeight: 100,
  },
  text: {
    stroke: 'none',
    fill: '#777777',
    fontWeight: 600,
    opacity: 1,
    fontFamily: 'Roboto',
    fontSize: '14px',
  },
}
