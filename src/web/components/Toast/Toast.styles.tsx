import styled from 'styled-components'

export const Left = styled.div``

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.2em;
`

export const Description = styled.div`
  color: ${(props) => props.theme.colors.white2};
`

export const DescriptionSuccess = styled.div`
  color: ${(props) => props.theme.colors.green2};
`

export const DescriptionError = styled.div`
  color: ${(props) => props.theme.colors.red1};
`

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${Title} + ${Description} {
    margin-top: 0.3em;
  }
`

export const Container = styled.div`
  display: flex;

  ${Left} + ${Right} {
    margin-left: 2em;
  }
`

export const ProgressContainer = styled.div`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  svg {
    #progress-spin {
      transform-origin: center center;
      animation-name: spin;
      animation-duration: 1000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  }
`
