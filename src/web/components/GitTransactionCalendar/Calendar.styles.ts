import styled, { createGlobalStyle } from 'styled-components'
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
    transform: translate(22px, 15px);
  }

  .react-calendar-heatmap {
    text {
      font-size: 10px;
      fill: #16253d;
      font-family: DM Sans;
      text-anchor: end;
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
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.75rem;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`

export const StyleForCalendar = createGlobalStyle`
.DateRangePicker_picker.DateRangePicker_picker__portal {
  z-index: 1008;
}

.DateRangePicker_picker {
  font-family: DM Sans;

  .DayPicker__withBorder {
    border-radius: 1rem;
  }
  
  .DayPicker_weekHeader {
    color: #7284A0;
  }

  .DayPicker, .CalendarMonthGrid, .CalendarMonth {
    background: #F9FBFD;
  }

  .CalendarDay__default {
    border: 1px solid #e0e5ec;
  }

  .CalendarDay__default, 
  .CalendarMonth_caption {
    color: #16253D;
  }

  .CalendarDay__selected_span {
    color: #fff;
    background: #5c8cea;
    border: 1px solid #e0e5ec;
  }

  .CalendarDay__hovered_span,
  .CalendarDay__hovered_span:hover, 
  .CalendarDay__hovered_span:active {
    color: #fff;
    background: #A1BFF9;
    border: 1px solid #e0e5ec;
  }

  .CalendarDay__selected_span:hover, 
  .CalendarDay__selected_span:active {
    color: #fff;
    background: #4152AF;
    border: 1px solid #e0e5ec;
    border: 1px solid #e0e5ec;
  }

  & .CalendarDay__selected,
  .CalendarDay__selected:active,
  .CalendarDay__selected:hover {
    color: #fff;
    background: #0b1fd1;
    border: 1px solid #e0e5ec;
  }

  .CalendarDay__blocked_out_of_range,
   .CalendarDay__blocked_out_of_range:active,
    .CalendarDay__blocked_out_of_range:hover {
    color: #7284A0;
  }

  .DayPickerKeyboardShortcuts_show__bottomRight::before {
    border-right-color: #0b1fd1;
  }

  .DayPickerKeyboardShortcuts_show__bottomRight:hover::before {
    border-right-color: #4152AF;
  }

  .DayPickerNavigation_svg__horizontal {
    fill: #7284A0;
  }

  .DayPickerNavigation_button__default {
    border: 1px solid #e0e5ec;
  }
}
`
