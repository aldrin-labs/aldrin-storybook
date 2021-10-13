import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
 
 html {
  font-size: 10px;
 }
 
 &::-webkit-scrollbar {
    width: ${({ scrollBarWidth }: { scrollBarWidth?: number }) =>
      scrollBarWidth ? `${scrollBarWidth}px` : '.2rem'};
    height: .1rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #651CE4;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  .DateRangePicker {
    display: block;
  }
  
  .DateRangePicker_picker.DateRangePicker_picker__portal {
    z-index: 200;
  }
  
  @media only screen and (max-width: 1440px) {
    html {
      font-size: 8px;
    }
  }

  @media only screen and (max-width: 1300px) {
    html {
      font-size: 7px;
    }
  }

  @media only screen and (max-width: 1200px) {
    html {
      font-size: 6px;
    }
  }


  @media only screen and (min-width: 2200px) {
    html {
      font-size: 15px;
    }
  }

  @media only screen and (min-width: 2560px) {
    html {
      font-size: 18px;
    }
  }
`
