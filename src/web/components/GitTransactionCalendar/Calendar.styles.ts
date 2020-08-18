import styled, { createGlobalStyle } from 'styled-components'
import { Typography } from '@material-ui/core'

export const LEGEND_COLORS = {
  // spot
  zero: '#E0E5EC',
  one: '#A1BFF9',
  two: '#6992E1',
  three: '#447AE2',
  four: '#0B1FD1',

  // futures
  oneProfit: '#AAF390',
  twoProfit: '#59C257',
  threeProfit: '#23B929',
  fourProfit: '#008805',

  oneLoss: '#F39E90',
  twoLoss: '#C26757',
  threeLoss: '#D34730',
  fourLoss: '#AE321E',
}

export const HeatmapWrapper = styled.div`
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
  background: #16253d;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.75rem;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1008;

  box-shadow: 0px 0.4rem 0.6rem rgba(8, 22, 58, 0.3);
  border-radius: 0.4rem;
  padding: 0 1rem;
  border: 0.1rem solid #e0e5ec;
`

export const StyleForCalendar = createGlobalStyle`
.DateInput {
  background: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.white &&
      props.theme.palette.white.background) ||
    '#fff'};

  .DateInput_input {
       
  background: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.white &&
      props.theme.palette.white.background) ||
    '#fff'};
  color:  ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.dark &&
      props.theme.palette.dark.main) ||
    '#16253d'};
     
     border: ${(props) =>
       (props.theme &&
         props.theme.palette &&
         props.theme.palette.border &&
         props.theme.palette.border.main) ||
       '.1rem solid #e0e5ec'};
  }
}

.DateRangePicker_picker.DateRangePicker_picker__portal {
  z-index: 1008;
}

.DayPicker_transitionContainer {
  border: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.border &&
      props.theme.palette.border.main) ||
    '.1rem solid #e0e5ec'};
}

.DateRangePicker_picker {
  font-family: DM Sans;

  .DayPicker__withBorder {
    border-radius: 1rem;
  }
  
  .DayPicker_weekHeader {
    color: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.grey &&
        props.theme.palette.grey.light) ||
      '#7284A0'};
  }

  .DayPicker, .CalendarMonthGrid, .CalendarMonth {
    background: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.grey &&
        props.theme.palette.grey.main) ||
      '#f2f4f6'};
  }

  .CalendarDay__default {
    background: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.white &&
        props.theme.palette.white.background) ||
      '#fff'};
    border: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.border &&
        props.theme.palette.border.main) ||
      '.1rem solid #e0e5ec'};
  }

  .CalendarDay__default, 
  .CalendarMonth_caption {
    color: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.dark &&
        props.theme.palette.dark.main) ||
      '#16253d'};
  }

  .CalendarDay__selected_span {
    color: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.white &&
        props.theme.palette.white.main) ||
      '#fff'};
     background: ${(props) =>
       (props.theme &&
         props.theme.palette &&
         props.theme.palette.blue &&
         props.theme.palette.blue.main) ||
       '#0b1fd1'}; 
    border: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.border &&
        props.theme.palette.border.main) ||
      '.1rem solid #e0e5ec'};
  }

  .CalendarDay__hovered_span,
  .CalendarDay__hovered_span:hover, 
  .CalendarDay__hovered_span:active {
    color: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.white &&
        props.theme.palette.white.main) ||
      '#fff'};
    background: #A1BFF9;
    border: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.border &&
        props.theme.palette.border.main) ||
      '.1rem solid #e0e5ec'};
  }

  .CalendarDay__selected_span:hover, 
  .CalendarDay__selected_span:active {
    color: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.white &&
        props.theme.palette.white.main) ||
      '#fff'};
    background: #4152AF;
    border: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.border &&
        props.theme.palette.border.main) ||
      '.1rem solid #e0e5ec'};
    border: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.border &&
        props.theme.palette.border.main) ||
      '.1rem solid #e0e5ec'};
  }

  & .CalendarDay__selected,
  .CalendarDay__selected:active,
  .CalendarDay__selected:hover {
    color: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.white &&
        props.theme.palette.white.main) ||
      '#fff'};
    background: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.blue &&
        props.theme.palette.blue.main) ||
      '#0b1fd1'}; 
    border: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.border &&
        props.theme.palette.border.main) ||
      '.1rem solid #e0e5ec'};
  }

   .CalendarDay__blocked_out_of_range:active,
    .CalendarDay__blocked_out_of_range:hover {
      background: ${(props) =>
        (props.theme &&
          props.theme.palette &&
          props.theme.palette.grey &&
          props.theme.palette.grey.background) ||
        '#f2f4f6'};
    color: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.grey &&
        props.theme.palette.grey.light) ||
      '#7284A0'};
       border: ${(props) =>
         (props.theme &&
           props.theme.palette &&
           props.theme.palette.border &&
           props.theme.palette.border.main) ||
         '.1rem solid #e0e5ec'};
  }

  .DayPickerKeyboardShortcuts_show__bottomRight::before {
    border-right-color: #0b1fd1;
  }

  .DayPickerKeyboardShortcuts_show__bottomRight:hover::before {
    border-right-color: #4152AF;
  }

  .DayPickerNavigation_svg__horizontal {
    fill: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.grey &&
        props.theme.palette.grey.light) ||
      '#7284A0'};
  }

  .DayPickerNavigation_button__default, .DayPickerNavigation_button__default:focus, .DayPickerNavigation_button__default:hover {
    border: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.border &&
        props.theme.palette.border.main) ||
      '.1rem solid #e0e5ec'};

    background: ${(props) =>
      (props.theme &&
        props.theme.palette &&
        props.theme.palette.white &&
        props.theme.palette.white.background) ||
      '#fff'};
  }

  .DateRangePickerInput_arrow {
    display: flex;
  }
}
`

export const PopupDateContainer = styled.div`
  border-bottom: 0.1rem solid #e0e5ec;
  padding: 0.6rem 0;
  font-size: 1rem;
`

export const PopupInfoContainer = styled.div`
  display: flex;
  padding: 0.6rem 0;
`

export const PopupInfoBlock = styled.div`
  border-right: ${(props) => props.isFirstBlock && '.1rem solid #e0e5ec'};
  padding: ${(props) =>
    props.isFirstBlock ? '0 1.5rem 0 .6rem' : '0 .6rem 0 1.5rem'};
`

export const PopupInfoTitle = styled.p`
  padding: 0;
  margin: 0;
  font-size: 1rem;
  padding-bottom: 0.6rem;
`

export const PopupInfoValue = styled.span`
  font-size: 1.2rem;
  white-space: nowrap;
  color: ${(props) => props.isSPOTRealized && '#5C8CEA'};
`
