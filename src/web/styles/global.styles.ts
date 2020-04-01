import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
 
 html {
  font-size: 10px;
 }
 
 &::-webkit-scrollbar {
    width: ${({ scrollBarWidth }: { scrollBarWidth?: number }) =>
      scrollBarWidth ? `${scrollBarWidth}px` : '3px'};
    height: 3px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #165BE0;
  }

  .DateRangePicker {
    display: block;
  }
  
  .DateRangePicker_picker.DateRangePicker_picker__portal {
    z-index: 200;
  }
  
  @media only screen and (max-width: 1400px) {
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


  @media only screen and (min-width: 1921px) {
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
