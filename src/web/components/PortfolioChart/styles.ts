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
    padding: '1.6rem',
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


export const horizontalGridLinesStyle = {
  stroke: 'rgba(134, 134, 134, 0.2)',
}

export const verticalGridLinesStyle = {
  stroke: '#848484',
}

export const areaSeriesStyle = {
  stroke: 'rgb(78, 216, 218)',
  strokeWidth: '1px',
}

export const crosshairStyle = {
  background: '#4c5055',
  color: '#4ed8da',
  padding: '5px',
  fontSize: '14px',
}
