import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export const LEGEND_COLORS = {
  zero: '#E0E5EC',
  one: '#A1BFF9',
  two: '#6992E1',
  three: '#447AE2',
  four: '#0B1FD1',
}

export const HeatmapWrapper = styled.div`
  margin-bottom: 1.25rem;

  .react-calendar-heatmap-month-label,
  .react-calendar-heatmap .react-calendar-heatmap-small-text {
    font-family: 'DM Sans', sans-serif;
    fill: #16253d;
  }

  .react-calendar-heatmap .react-calendar-heatmap-small-text {
    font-size: 0.575rem;
  }

  .react-calendar-heatmap-week rect {
    cursor: pointer;
  }

  .react-calendar-heatmap-month-labels {
    transform: translate(48px, -1px);
  }

  .react-calendar-heatmap-weekday-labels {
    transform: translate(22px,15px);
  }

  .react-calendar-heatmap {
    text {
      font-size: 10px;
      fill: #16253D;
      font-family: DM Sans;
      text-anchor: end;
    }
  }

  @media only screen and (min-width: 1024px) {
    .ChoosePeriodsBlock {
      top: 11.7em;
    }
  }

  @media only screen and (min-width: 1100px) {
    .ChoosePeriodsBlock {
      top: 12.7em;
    }
  }

  @media only screen and (min-width: 1200px) {
    .ChoosePeriodsBlock {
      top: 14.5em;
    }
  }

  @media only screen and (min-width: 1300px) {
    .ChoosePeriodsBlock {
      top: 16em;
    }
  }

  @media only screen and (min-width: 1400px) {
    .ChoosePeriodsBlock {
      top: 12.7em;
    }
  }

  @media only screen and (min-width: 1500px) {
    .ChoosePeriodsBlock {
      top: 14.4em;
    }
  }

  @media only screen and (min-width: 1600px) {
    .ChoosePeriodsBlock {
      top: 14.8em;
    }
  }

  @media only screen and (min-width: 1700px) {
    .ChoosePeriodsBlock {
      top: 15.5em;
    }
  }

  @media only screen and (min-width: 1800px) {
    .ChoosePeriodsBlock {
      top: 17em;
    }
  }

  @media only screen and (min-width: 1900px) {
    .ChoosePeriodsBlock {
      top: 17em;
    }
  }

  @media only screen and (min-width: 1920px) {
    .ChoosePeriodsBlock {
      top: 13.3em;
    }
  }

  @media only screen and (min-width: 2560px) {
    .react-calendar-heatmap-month-label,
    .react-calendar-heatmap .react-calendar-heatmap-small-text {
      font-size: 0.45rem;
    }
  }
`
export const LegendTypography = styled(Typography)`
  font-size: 0.925rem;
  color: #16253d;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'DM Sans';
  font-weight: 600;
  margin: 0 0.5rem;
`
export const LegendHeatmapSquare = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  background-color: ${(props) => props.fill || '#E0E5EC'};
  margin: 0 0.175rem;
`

export const SquarePopup = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: .9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 700;
  padding: .75rem;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
`
